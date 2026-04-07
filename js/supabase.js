import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://delozvlqkgphhkemgfzg.supabase.co';
const supabaseAnonKey = 'sb_publishable_WeunjKKA27H-3Em_YAbTOA_x3ERg4Wb';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };