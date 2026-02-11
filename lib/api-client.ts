import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// In dev environment, prefer window location if running in browser to support mobile access
const finalUrl = (process.env.NODE_ENV === "development" && typeof window !== "undefined") 
  ? window.location.origin 
  : baseUrl;

export const client = hc<AppType>(finalUrl);
