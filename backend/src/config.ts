import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  APP_ORIGIN: z.string().url().default('http://localhost:3000'),
  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_NAME: z.string().default('gold_session'),
});

const values = schema.parse(process.env);
export const config = { ...values, appUsesHttps: new URL(values.APP_ORIGIN).protocol === 'https:' };
