import { Worker } from 'bullmq';
import xlsx from 'xlsx';
import axios from 'axios';
import fs from 'fs/promises';
import { connection } from './queue';
import { db } from '../../db';
import { records } from '../models/records.model';
import { eq } from 'drizzle-orm';

interface redirectObject {
    address: string;
    status_code?: number;
    redirect_url: string;
    expected_url?: string;
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const redirectWorker = new Worker('redirect-check', async job => {
  console.log("worker started");
  
  try {
    await db.update(records).set({
      status: "active"
    }).where(eq(records.jobId, `${job.id}`));

    const path = job.data.filePath;
    const result: redirectObject[] = [];

    const workbook = xlsx.readFile(path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i] as redirectObject;

        const response = await axios.get(item.address, {
          maxRedirects: 0,
          validateStatus: () => true,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'text/html',
          }
        });

        if (response.headers.location !== item.redirect_url) {
          result.push({
            address: item.address,
            status_code: response.status || 0,
            redirect_url: response.headers.location,
            expected_url: item.redirect_url
          });
        }

        await job.updateProgress({
          current: i + 1,
          total: data.length,
          message: `Processing item ${i+1} of ${data.length}`
        });

        if (i % 100 === 0) {
          await wait(Math.floor(Math.random() * (17000 - 12000 + 1)) + 12000);
        } else {
          await wait(Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000);
        }
      } catch (itemError) {
        console.error(`Error processing item ${i} (${data[i]}):`, itemError);
      }
    }

    try {
      await fs.unlink(path);
    } catch (unlinkError) {
      console.warn(`Failed to delete file at path ${path}:`, unlinkError);
    }

    await db.update(records).set({
      data: JSON.stringify(result),
      status: "complete"
    }).where(eq(records.jobId, `${job.id}`));

    console.log("Redirect Check Completed: ", job.id);

  } catch (err) {
    console.error("Worker error:", err);

    try {
      await db.update(records).set({
        status: "failed",
      }).where(eq(records.jobId, `${job.id}`));
    } catch (dbErr) {
      console.error("Failed to update job status to failed:", dbErr);
    }

    throw err;
  }
}, { connection, concurrency: 5 });
