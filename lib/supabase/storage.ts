import { createClient } from './client'

const BUCKET_NAMES = {
  AVATARS: 'avatars',
  PRODUCTS: 'products',
} as const

export type BucketName = (typeof BUCKET_NAMES)[keyof typeof BUCKET_NAMES]

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  bucket: BucketName,
  file: File,
  path: string
): Promise<{ path: string; url: string } | null> {
  try {
    const supabase = createClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}-${Date.now()}.${fileExt}`

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('[Storage] Upload error:', uploadError)
      return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return {
      path: fileName,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error('[Storage] File upload error:', error)
    return null
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(bucket: BucketName, path: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error('[Storage] Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Storage] File delete error:', error)
    return false
  }
}

/**
 * Get public URL for a file in storage
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload avatar for user
 */
export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  const result = await uploadFile(BUCKET_NAMES.AVATARS, file, `${userId}/avatar`)
  return result?.url || null
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string | null> {
  const result = await uploadFile(BUCKET_NAMES.PRODUCTS, file, `${productId}/image`)
  return result?.url || null
}

/**
 * Delete user avatar
 */
export async function deleteAvatar(path: string): Promise<boolean> {
  return deleteFile(BUCKET_NAMES.AVATARS, path)
}

/**
 * Delete product image
 */
export async function deleteProductImage(path: string): Promise<boolean> {
  return deleteFile(BUCKET_NAMES.PRODUCTS, path)
}
