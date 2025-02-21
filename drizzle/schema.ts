import { pgTable, point, serial, text, timestamp } from "drizzle-orm/pg-core";



export const photoLocations = pgTable("photo_locations", {
	id: serial().primaryKey().notNull(),
	locationTakenAt: point("location_taken_at").notNull(),
	photoId: text("photo_id").notNull(),
	dateTakenAt: timestamp("date_taken_at", { withTimezone: true, mode: 'string' }),
});

