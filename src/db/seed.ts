import { eq } from 'drizzle-orm'
import { db } from './index'
import { users } from './schema'
import { auth } from '@/lib/auth'

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    await auth.api.signUpEmail({
      body: {
        name: 'Untad Chronicle Admin',
        email: 'admin@chronicle.untad.ac.id',
        password: 'AdminPassword123!',
      },
    })
    console.log('✅ Admin user registered: admin@chronicle.untad.ac.id')
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log('ℹ️ Admin user registration notice:', msg)
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: 'Untad Author',
        email: 'user@chronicle.untad.ac.id',
        password: 'UserPassword123!',
      },
    })
    console.log('✅ Standard author registered: user@chronicle.untad.ac.id')
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log('ℹ️ Author registration notice:', msg)
  }

  try {
    await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, 'admin@chronicle.untad.ac.id'))
    console.log('👑 Promoted admin@chronicle.untad.ac.id to role: admin')
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log('⚠️ Could not update admin role:', msg)
  }

  console.log('🎉 Seeding process completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
