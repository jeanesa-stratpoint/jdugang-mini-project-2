import { pgTable, uuid, varchar, text, timestamp, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(), // Unique 
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  profileImg: text('profile_img'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastPasswordReset: timestamp('last_password_reset'),
});

export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), 
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(), 
  content: text('content').notNull(),
  blogImg: text('blog_img'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const gratitudeEntries = pgTable('gratitude_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: varchar('content', { length: 280 }).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  blogId: uuid('blog_id').references(() => blogs.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
});

// user can only like a specific blog ONCE.
export const likes = pgTable('likes', {
    blogId: uuid('blog_id').references(() => blogs.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  }, (t) => ({
    pk: uniqueIndex('user_blog_like_unique').on(t.userId, t.blogId), // Prevents duplicate likes
  })
);

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' }) 
    .notNull(),
  

  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: uuid("recipient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  senderId: uuid("sender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  blogId: uuid("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELATIONS 

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  comments: many(comments),
  likes: many(likes),
  gratitudeEntries: many(gratitudeEntries),
  passwordResetTokens: many(passwordResetTokens),
  notificationsReceived: many(notifications, { relationName: "recipientNotifications" }),
  notificationsSent: many(notifications, { relationName: "senderNotifications" }),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  blog: one(blogs, {
    fields: [comments.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  blog: one(blogs, {
    fields: [likes.blogId],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const gratitudeEntriesRelations = relations(gratitudeEntries, ({ one }) => ({
  author: one(users, {
    fields: [gratitudeEntries.authorId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.recipientId],
    references: [users.id],
    relationName: "recipientNotifications",
  }),
  sender: one(users, {
    fields: [notifications.senderId],
    references: [users.id],
    relationName: "senderNotifications",
  }),
  blog: one(blogs, {
    fields: [notifications.blogId],
    references: [blogs.id],
  }),
}));