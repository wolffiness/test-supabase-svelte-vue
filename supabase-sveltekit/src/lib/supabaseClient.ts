import { createClient } from '@supabase/supabase-js';
import type { Database } from './../../database.types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
