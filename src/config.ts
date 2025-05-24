import { config } from 'dotenv';

config();

export const BOT_TOKEN = process.env.TOKEN;

if (!BOT_TOKEN) throw new Error('No bot token found');
