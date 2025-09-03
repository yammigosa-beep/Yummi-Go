"use client"

import { useState, useEffect, useCallback } from 'react'

interface SupabaseImage {
  filename: string
  url: string
  size: number
  created: string | null
}

interface UseSupabaseImagesReturn {
  images: Record<string, string> // filename -> url mapping
  imagesByBucket: Record<string, SupabaseImage[]> // bucket -> images
  loading: boolean
  error: string | null
  refetch: (bucket?: string) => Promise<void>
  getImageByName: (name: string, bucket?: string) => string | null
}

export function useSupabaseImages(buckets: string[] = ['Hero', 'About']): UseSupabaseImagesReturn {
  const [images, setImages] = useState<Record<string, string>>({})
  const [imagesByBucket, setImagesByBucket] = useState<Record<string, SupabaseImage[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImagesFromBucket = useCallback(async (bucket: string): Promise<SupabaseImage[]> => {
    try {
      const response = await fetch(`/api/upload?bucket=${encodeURIComponent(bucket)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch images from ${bucket}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.files || []
    } catch (err) {
      console.error(`Error fetching images from ${bucket}:`, err)
      throw err
    }
  }, [])

  // Accept bucketsToFetch explicitly so callers can pass inline arrays
  // without causing the hook to re-create callbacks on every render.
  const fetchAllImages = useCallback(async (bucketsToFetch: string[] = buckets) => {
    setLoading(true)
    setError(null)
    
    try {
      const allImages: Record<string, string> = {}
      const allImagesByBucket: Record<string, SupabaseImage[]> = {}
      
  // Fetch images from all buckets
  const bucketPromises = bucketsToFetch.map(async (bucket) => {
        const bucketImages = await fetchImagesFromBucket(bucket)
        allImagesByBucket[bucket] = bucketImages
        
        // Map images by filename (normalized lowercase, and without extension for easier access)
        bucketImages.forEach((image) => {
          const filename = image.filename
          const url = image.url
          const filenameLower = filename.toLowerCase()

          // Store by full filename (lowercase)
          allImages[filenameLower] = url

          // Also store by filename without extension
          const nameWithoutExt = filenameLower.replace(/\.[^/.]+$/, "")
          allImages[nameWithoutExt] = url

          // Store by just the number if it's a numbered file (like "1.jpeg" -> "1")
          const numberMatch = filenameLower.match(/^(\d+)\./)
          if (numberMatch) {
            allImages[numberMatch[1]] = url
          }
        })
      })
      
      await Promise.all(bucketPromises)
      
      setImages(allImages)
      setImagesByBucket(allImagesByBucket)
    } catch (err: any) {
      console.error('Error fetching images:', err)
      setError(err.message || 'Failed to fetch images')
    } finally {
      setLoading(false)
    }
  }, [fetchImagesFromBucket])

  const refetch = useCallback(async (bucket?: string) => {
    if (bucket) {
      await fetchAllImages([bucket])
    } else {
      await fetchAllImages(buckets)
    }
  }, [fetchAllImages, buckets])

  const getImageByName = useCallback((name: string, bucket?: string): string | null => {
    if (!name) return null

    const normalize = (s: string) => s.toLowerCase()
    const stripExt = (s: string) => s.replace(/\.[^/.]+$/, "")

    const target = normalize(name)
    // Try exact filename match first
    if (images[target]) return images[target]

    // Helper to match against a SupabaseImage
    const matches = (img: SupabaseImage) => {
      const fname = normalize(img.filename)
      if (fname === target) return true
      if (stripExt(fname) === stripExt(target)) return true
      if (fname.startsWith(target) || stripExt(fname).startsWith(stripExt(target))) return true
      return false
    }

    // If bucket specified, look in that bucket specifically
    if (bucket && imagesByBucket[bucket]) {
      const bucketImage = imagesByBucket[bucket].find(matches)
      if (bucketImage) return bucketImage.url
    }

    // Search all buckets
    for (const bucketImages of Object.values(imagesByBucket)) {
      const found = bucketImages.find(matches)
      if (found) return found.url
    }

    return null
  }, [images, imagesByBucket])

  useEffect(() => {
    // Call with the original buckets array provided by the caller.
    fetchAllImages(buckets)
    // Intentionally depend on fetchAllImages and buckets. If callers pass
    // inline arrays repeatedly, they should memoize them to avoid re-fetches.
  }, [fetchAllImages, buckets])

  return {
    images,
    imagesByBucket,
    loading,
    error,
    refetch,
    getImageByName
  }
}

export default useSupabaseImages
