import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // Generation happens while building the image, before runtime credentials
  // exist. Migration commands still receive the real URL from the container.
  datasource: { url: process.env.DATABASE_URL || 'mysql://build:build@localhost:3306/build' },
});
