import { defineConfig } from "drizzle-kit";
import { readConfig } from "/home/jacob/BootDev/projects/aggregator/src/config.ts"


export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db",
  dialect: "postgresql",
  dbCredentials: {
    url: readConfig().dbUrl,
  },
});