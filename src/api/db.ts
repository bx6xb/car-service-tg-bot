import 'dotenv/config';
import { Pool } from 'pg';
// import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from '../config';

export const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT!,
});
