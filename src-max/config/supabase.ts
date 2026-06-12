import { createClient } from '@supabase/supabase-js';
import { MAX_SUPABASE_KEY, MAX_SUPABASE_URL, TG_SUPABASE_KEY, TG_SUPABASE_URL } from './variables';

export const supabase = createClient(MAX_SUPABASE_URL, MAX_SUPABASE_KEY);
export const tgSupabase = createClient(TG_SUPABASE_URL, TG_SUPABASE_KEY);