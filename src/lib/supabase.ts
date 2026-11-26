import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_SUPABASE_URL = "https://vlsnxbszmhisromyzczx.supabase.co";
export const DEFAULT_SUPABASE_KEY = "sb_publishable_SF25OuZLX7xc1MsGltU3lg_EE0nyxH4";

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export type SupabaseLink = {
  id: string;
  name: string;
  slug: string;
  safe_url: string;
  offer_url: string;
  status: "active" | "paused";
  clicks_human: number;
  clicks_bot: number;
  created_at?: string;
};
