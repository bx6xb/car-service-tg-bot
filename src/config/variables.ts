import 'dotenv/config';

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const API_URL = process.env.API_URL;
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;
export let ADMIN_IDS: number[] = [];

const adminIdsString = process.env.ADMIN_IDS;

if (adminIdsString) {
  ADMIN_IDS = adminIdsString.split(',').map(Number);
}
