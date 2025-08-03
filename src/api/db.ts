import { Pool, types } from 'pg';
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from '../config';

types.setTypeParser(20, (val) => Number(val));

export const db = new Pool({
  user: PG_USER,
  host: PG_HOST || 'localhost',
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT || 5432,
});
