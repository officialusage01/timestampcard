import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

const supabaseUrl = 'https://wwpbaunudhvliddgmqyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGJhdW51ZGh2bGlkZGdtcXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTExMDQsImV4cCI6MjA1MjU4NzEwNH0.QJk4t5xics3ldh6C7bG8qd2hXIotC6asbiBqAjis8ow';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);