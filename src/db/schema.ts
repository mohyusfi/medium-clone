import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    role: text('role').default('user').notNull(),
    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
    createdAt: timestamp('created_at')
      .default(sql`(now())`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`(now())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
)

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at')
      .default(sql`(now())`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`(now())`)
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [unique('sessions_token_unique').on(table.token)],
)

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at')
    .default(sql`(now())`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`(now())`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`(now())`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`(now())`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const blogs = pgTable(
  'blogs',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content').notNull(),
    thumbnail: text('thumbnail'),
    status: text('status').default('draft').notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at')
      .default(sql`(now())`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`(now())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [unique('blogs_slug_unique').on(table.slug)],
)

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  blogId: integer('blog_id')
    .notNull()
    .references(() => blogs.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: integer('parent_id'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`(now())`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`(now())`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const likes = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => [unique('likes_blog_user_idx').on(table.blogId, table.userId)],
)

export const saves = pgTable(
  'saves',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .default(sql`(now())`)
      .notNull(),
  },
  (table) => [unique('saves_user_blog_idx').on(table.userId, table.blogId)],
)
