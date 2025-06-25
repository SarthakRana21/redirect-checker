import { Queue } from 'bullmq';
import Redis from 'ioredis';

export const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
};


export const redirectQueue = new Queue('redirect-check', { connection });
