// Firebase configuration and initialization

'use client'

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase configuration
function validateFirebaseConfig() {
    const requiredKeys = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
    ]

    const missingKeys = requiredKeys.filter(
        (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
    )

    if (missingKeys.length > 0) {
        console.error(
            '[Firebase] Missing configuration:',
            missingKeys.map((key) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`)
        )
        throw new Error(
            `Missing Firebase configuration. Please add the following environment variables: ${missingKeys
                .map((key) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`)
                .join(', ')}`
        )
    }
}

// Initialize Firebase (lazy initialization)
let firebaseApp: FirebaseApp | undefined
let firebaseAuth: Auth | undefined
let firebaseGoogleProvider: GoogleAuthProvider | undefined

function initializeFirebase() {
    if (typeof window === 'undefined') {
        return { auth: null, googleProvider: null, app: null }
    }

    try {
        validateFirebaseConfig()

        // Initialize Firebase app (only once)
        if (!firebaseApp) {
            if (!getApps().length) {
                firebaseApp = initializeApp(firebaseConfig)
                console.log('[Firebase] App initialized successfully')
            } else {
                firebaseApp = getApps()[0]
                console.log('[Firebase] Using existing app instance')
            }
        }

        // Initialize Firebase Auth
        if (!firebaseAuth && firebaseApp) {
            firebaseAuth = getAuth(firebaseApp)
        }

        // Configure Google Auth Provider
        if (!firebaseGoogleProvider) {
            firebaseGoogleProvider = new GoogleAuthProvider()
            firebaseGoogleProvider.addScope('profile')
            firebaseGoogleProvider.addScope('email')
            firebaseGoogleProvider.setCustomParameters({
                prompt: 'select_account',
            })
        }

        return { auth: firebaseAuth, googleProvider: firebaseGoogleProvider, app: firebaseApp }
    } catch (error) {
        console.error('[Firebase] Initialization error:', error)
        throw error
    }
}

// Export getter functions
export function getFirebaseAuth() {
    const { auth } = initializeFirebase()
    if (!auth) {
        throw new Error('Firebase Auth not initialized')
    }
    return auth
}

export function getGoogleProvider() {
    const { googleProvider } = initializeFirebase()
    if (!googleProvider) {
        throw new Error('Google Provider not initialized')
    }
    return googleProvider
}

// Export proxies for backward compatibility and ease of use
// These proxies ensure that Firebase is initialized only when these objects are accessed
const auth = new Proxy({} as Auth, {
    get(target, prop) {
        const authInstance = getFirebaseAuth()
        const value = authInstance[prop as keyof Auth]
        return typeof value === 'function' ? value.bind(authInstance) : value
    },
})

const googleProvider = new Proxy({} as GoogleAuthProvider, {
    get(target, prop) {
        const providerInstance = getGoogleProvider()
        const value = providerInstance[prop as keyof GoogleAuthProvider]
        return typeof value === 'function' ? value.bind(providerInstance) : value
    },
})

export { auth, googleProvider }
export default firebaseApp
