import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const plannerState = pgTable("planner_state", {
  id: integer("id").primaryKey(),
  data: text("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
});
