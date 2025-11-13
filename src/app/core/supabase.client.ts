import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://tebiptcqkzucydultnyi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYmlwdGNxa3p1Y3lkdWx0bnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDYzMTMsImV4cCI6MjA3ODQyMjMxM30.gvK8ym00aFOqcGwd183R_bK3aEDZeXNHl-WeZZzwWOs'
);