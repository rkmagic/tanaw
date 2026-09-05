import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export default storage;
