import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Create a single supabase client for the entire application
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
