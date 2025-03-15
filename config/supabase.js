const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kmtyomxhyjhjcoljuzro.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdHlvbXhoeWpoamNvbGp1enJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjA0NjM3NywiZXhwIjoyMDU3NjIyMzc3fQ.qskFg4jBuZBdIWGrzJnZWQtm3aVu6PVirhwVPakbky4';


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;