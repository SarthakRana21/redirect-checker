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
    console.log("worker started")
    await db.update(records).set({
        status: "active"
    }).where(eq(records.jobId, `${job.id}`))

    const path = job.data.filePath;
    const result: redirectObject[] = [];

    const workbook = xlsx.readFile(path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (let i = 0; i < data.length; i++) {
        const item = data[i] as redirectObject;
        const response = await axios.get(item.address, {
            maxRedirects: 0,
            validateStatus: () => true
        });

        if (response.headers.location !== item.redirect_url) {
            result.push({
                address: item.address,
                status_code: response.status || 0,
                redirect_url: response.headers.location,
                expected_url: item.redirect_url
            });
        }

        job.updateProgress({
            current: i,
            total: data.length,
            message: `Processing item ${i} of ${data.length}`
        })

        await wait(Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000);
    }

    await fs.unlink(path);

    await db.update(records).set({
        data: JSON.stringify(result),
        status: "complete"
    }).where(eq(records.jobId, `${job.id}`))

    console.log("Redirect Check Completed", result);
}, { connection });
