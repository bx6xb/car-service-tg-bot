import { createBrowserClient } from '@supabase/ssr';
import { MAX_SUPABASE_KEY, MAX_SUPABASE_URL, TG_SUPABASE_KEY, TG_SUPABASE_URL } from './variables';

export const supabase = createBrowserClient(MAX_SUPABASE_URL, MAX_SUPABASE_KEY);
export const tgSupabase = createBrowserClient(TG_SUPABASE_URL, TG_SUPABASE_KEY);
