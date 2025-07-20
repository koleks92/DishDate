import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qfrqpvxingpjmmebgkfh.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnFwdnhpbmdwam1tZWJna2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MTk1NDksImV4cCI6MjA1MTk5NTU0OX0.OGcnt0PwzqZg1lMZ3hXUn2XnhjEc0ufRI8W51I_clog";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
    },
});

AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});
