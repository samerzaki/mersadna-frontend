import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';
import { config } from './config.js';

const adapter = new PrismaMariaDb(config.DATABASE_URL);
export const prisma = new PrismaClient({ adapter });
