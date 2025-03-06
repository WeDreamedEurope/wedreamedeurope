import { relations } from "drizzle-orm/relations";
import { user, session, account, authenticator, photoLocations } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	authenticators: many(authenticator),
	photoLocations: many(photoLocations),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const photoLocationsRelations = relations(photoLocations, ({one}) => ({
	user: one(user, {
		fields: [photoLocations.userId],
		references: [user.id]
	}),
}));