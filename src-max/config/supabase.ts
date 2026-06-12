import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { MAX_SUPABASE_KEY, MAX_SUPABASE_URL, TG_SUPABASE_KEY, TG_SUPABASE_URL } from './variables';

// Фикс для Node.js < 22
if (!global.WebSocket) {
  (global as any).WebSocket = ws;
}

export const supabase = createClient(MAX_SUPABASE_URL, MAX_SUPABASE_KEY);
export const tgSupabase = createClient(TG_SUPABASE_URL, TG_SUPABASE_KEY);