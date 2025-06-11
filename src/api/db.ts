import { Pool, types } from 'pg';

types.setTypeParser(20, (val) => Number(val));

export const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT!,
});
