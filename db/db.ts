import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

const db = drizzle({
  connection: process.env.DB_URL!,
  ws: ws,
});

export default db;
