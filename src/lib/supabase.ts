import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnvdjhwceywfbcwvkrla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudmRqaHdjZXl3ZmJjd3ZrcmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjExNzIsImV4cCI6MjA4Njc5NzE3Mn0.w4czf1eyX16T3pYP2md4TxDsxIKTF-ShkBEtzryImOA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
