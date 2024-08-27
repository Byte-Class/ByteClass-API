import {
  pgTable,
  text,
  unique,
  timestamp,
  json,
  primaryKey,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const timetable = pgTable("timetable", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
});

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    image: text("image"),
  },
  (table) => {
    return {
      userEmailUnique: unique("user_email_unique").on(table.email),
    };
  }
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "string" }).notNull(),
});

export const event = pgTable("event", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  timetableId: text("timetableId")
    .notNull()
    .references(() => timetable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  day: text("day").notNull(),
  time: json("time").$type<{
    start: string;
    end: string;
  }>(),
  location: text("location"),
});

export const kamar = pgTable("kamar", {
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  loginCreds: json("loginCreds"),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenPk: primaryKey({
        columns: [table.identifier, table.token],
        name: "verificationToken_identifier_token_pk",
      }),
    };
  }
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialId: text("credentialID").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (table) => {
    return {
      authenticatorUserIdCredentialIdPk: primaryKey({
        columns: [table.credentialId, table.userId],
        name: "authenticator_userId_credentialID_pk",
      }),
      authenticatorCredentialIdUnique: unique(
        "authenticator_credentialID_unique"
      ).on(table.credentialId),
    };
  }
);

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      accountProviderProviderAccountIdPk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_provider_providerAccountId_pk",
      }),
    };
  }
);
