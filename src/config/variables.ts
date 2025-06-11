import 'dotenv/config';

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const PG_USER = process.env.PG_USER;
export const PG_HOST = process.env.PG_HOST;
export const PG_DATABASE = process.env.PG_DATABASE;
export const PG_PASSWORD = process.env.PG_PASSWORD;
export const PG_PORT = Number(process.env.PG_PORT);
export let ADMIN_IDS: number[] = [];

const adminIdsString = process.env.ADMIN_IDS;

if (adminIdsString) {
  ADMIN_IDS = adminIdsString.split(',').map(Number);
}
