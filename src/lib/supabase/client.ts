// @/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Tetap buat fungsinya (untuk best practice)
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Tambahkan baris ini untuk mengekspor variabel langsung
export const supabase = createClient()