import { createClient } from '@supabase/supabase-js'

const URL = 'https://wjwnizrbemducygequfx.supabase.co'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqd25penJiZW1kdWN5Z2VxdWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjA2NDYsImV4cCI6MjA3ODM5NjY0Nn0.L8JWQdBQnTDndieA0JutAKpb4BbPFykROV1UNIh1MF0'

export const supabase = createClient(URL, API_KEY)