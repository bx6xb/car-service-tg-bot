import 'dotenv/config';

export const MAX_BOT_TOKEN = process.env.MAX_BOT_TOKEN;
export const API_URL = process.env.API_URL;
export const MAX_SUPABASE_URL = process.env.MAX_SUPABASE_URL!;
export const MAX_SUPABASE_KEY = process.env.MAX_SUPABASE_KEY!;
export const TG_SUPABASE_URL = process.env.SUPABASE_URL!;
export const TG_SUPABASE_KEY = process.env.SUPABASE_KEY!;
export let MAX_ADMIN_IDS: number[] = [];

const adminIdsString = process.env.MAX_ADMIN_IDS;

if (adminIdsString) {
  MAX_ADMIN_IDS = adminIdsString.split(',').map(Number);
}
