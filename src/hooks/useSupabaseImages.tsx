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
        
        // Map images by filename (without extension for easier access)
        bucketImages.forEach((image) => {
          // Store by full filename
          allImages[image.filename] = image.url
          
          // Also store by filename without extension
          const nameWithoutExt = image.filename.replace(/\.[^/.]+$/, "")
          allImages[nameWithoutExt] = image.url
          
          // Store by just the number if it's a numbered file (like "1.jpeg" -> "1")
          const numberMatch = image.filename.match(/^(\d+)\./);
          if (numberMatch) {
            allImages[numberMatch[1]] = image.url
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
  }, [buckets, fetchImagesFromBucket])

  const refetch = useCallback(async (bucket?: string) => {
    if (bucket) {
      await fetchAllImages([bucket])
    } else {
      await fetchAllImages()
    }
  }, [fetchAllImages])

  const getImageByName = useCallback((name: string, bucket?: string): string | null => {
    // First try exact match
    if (images[name]) {
      return images[name]
    }
    
    // If bucket specified, look in that bucket specifically
    if (bucket && imagesByBucket[bucket]) {
      const bucketImage = imagesByBucket[bucket].find(img => 
        img.filename === name || 
        img.filename.replace(/\.[^/.]+$/, "") === name ||
        img.filename.startsWith(name)
      )
      if (bucketImage) return bucketImage.url
    }
    
    // Search all buckets
    for (const bucketImages of Object.values(imagesByBucket)) {
      const found = bucketImages.find(img => 
        img.filename === name || 
        img.filename.replace(/\.[^/.]+$/, "") === name ||
        img.filename.startsWith(name)
      )
      if (found) return found.url
    }
    
    return null
  }, [images, imagesByBucket])

  useEffect(() => {
    fetchAllImages()
  }, [fetchAllImages])

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
