import { relations } from 'drizzle-orm'
import type { AnyMySqlColumn } from 'drizzle-orm'
import {
  int,
  longtext,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'user']).notNull().default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const blogs = mysqlTable('blogs', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: longtext('content').notNull(),
  thumbnail: varchar('thumbnail', { length: 500 }),
  status: mysqlEnum('status', ['draft', 'published', 'archived'])
    .notNull()
    .default('draft'),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const comments = mysqlTable('comments', {
  id: int('id').primaryKey().autoincrement(),
  blog_id: int('blog_id')
    .notNull()
    .references(() => blogs.id, { onDelete: 'cascade' }),
  user_id: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parent_id: int('parent_id').references((): AnyMySqlColumn => comments.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

export const likes = mysqlTable(
  'likes',
  {
    id: int('id').primaryKey().autoincrement(),
    blog_id: int('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    user_id: int('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('likes_blog_user_idx').on(table.blog_id, table.user_id),
  ],
)

export const saves = mysqlTable(
  'saves',
  {
    id: int('id').primaryKey().autoincrement(),
    user_id: int('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    blog_id: int('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('saves_user_blog_idx').on(table.user_id, table.blog_id),
  ],
)

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  comments: many(comments),
  likes: many(likes),
  saves: many(saves),
}))

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.user_id],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  saves: many(saves),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  blog: one(blogs, {
    fields: [comments.blog_id],
    references: [blogs.id],
  }),
  author: one(users, {
    fields: [comments.user_id],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parent_id],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, {
    relationName: 'comment_replies',
  }),
}))

export const likesRelations = relations(likes, ({ one }) => ({
  blog: one(blogs, {
    fields: [likes.blog_id],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [likes.user_id],
    references: [users.id],
  }),
}))

export const savesRelations = relations(saves, ({ one }) => ({
  blog: one(blogs, {
    fields: [saves.blog_id],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [saves.user_id],
    references: [users.id],
  }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Blog = typeof blogs.$inferSelect
export type NewBlog = typeof blogs.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export type Like = typeof likes.$inferSelect
export type NewLike = typeof likes.$inferInsert

export type Save = typeof saves.$inferSelect
export type NewSave = typeof saves.$inferInsert
