import crypto from 'crypto'

// Simple in-memory user storage (in production, use a real database)
const users = new Map<string, {
  id: string
  email: string
  name: string
  password: string
  role: 'ADMIN' | 'SELLER' | 'BUYER'
  createdAt: Date
  avatar?: string
  phone?: string
}>()

// Session storage
export const sessions = new Map<string, {
  userId: string
  email: string
  name: string
  role: 'ADMIN' | 'SELLER' | 'BUYER'
  avatar?: string
  phone?: string
  createdAt: Date
  expiresAt: Date
}>()

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function registerUser(email: string, password: string, name: string) {
  if (users.has(email)) {
    throw new Error('User already exists')
  }

  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required')
  }

  const userId = crypto.randomUUID()
  const hashedPassword = hashPassword(password)

  users.set(email, {
    id: userId,
    email,
    name,
    password: hashedPassword,
    role: 'BUYER',
    createdAt: new Date(),
  })

  return {
    id: userId,
    email,
    name,
    role: 'BUYER',
  }
}

export function loginUser(email: string, password: string) {
  const user = users.get(email)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const hashedPassword = hashPassword(password)
  if (user.password !== hashedPassword) {
    throw new Error('Invalid email or password')
  }

  const sessionId = generateSessionId()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

  sessions.set(sessionId, {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    createdAt: now,
    expiresAt,
  })

  return {
    sessionId,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    },
  }
}

export function getSession(sessionId: string) {
  const session = sessions.get(sessionId)

  if (!session) {
    return null
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionId)
    return null
  }

  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    avatar: session.avatar,
    phone: session.phone,
  }
}

export function logoutUser(sessionId: string) {
  sessions.delete(sessionId)
}

export function updateUserProfile(email: string, updates: { name?: string; phone?: string; avatar?: string }) {
  const user = users.get(email)

  if (!user) {
    throw new Error('User not found')
  }

  if (updates.name) user.name = updates.name
  if (updates.phone) user.phone = updates.phone
  if (updates.avatar) user.avatar = updates.avatar

  // Update all active sessions for this user
  sessions.forEach((session) => {
    if (session.email === email) {
      if (updates.name) session.name = updates.name
      if (updates.phone) session.phone = updates.phone
      if (updates.avatar) session.avatar = updates.avatar
    }
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
  }
}
