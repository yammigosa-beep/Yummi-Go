import React, { useState, useRef } from 'react'
import useSupabaseImages from '../hooks/useSupabaseImages'

interface ImageManagerProps {
  onImageSelect: (url: string) => void
  currentImage?: string
  bucket?: string
  onClose?: () => void
  adminApiKey: string
}

export function ImageManager({ onImageSelect, currentImage, bucket = 'Hero', onClose, adminApiKey }: ImageManagerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { imagesByBucket, refetch } = useSupabaseImages([bucket])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadedFiles = imagesByBucket[bucket] || []

  const loadUploadedFiles = async () => {
    await refetch(bucket)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('Uploading...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', (window as any).__CURRENT_IMAGE_BUCKET || 'Hero')
      formData.append('overwrite', (window as any).__CURRENT_IMAGE_OVERWRITE ? 'true' : 'false')

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': adminApiKey
        },
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await res.json()
      setUploadStatus('✅ Upload successful')
      setTimeout(() => setUploadStatus(''), 3000)
      
      // Reload file list
      await loadUploadedFiles()
      
      // Auto-select the uploaded image
      onImageSelect(result.url)
      
    } catch (error: any) {
      setUploadStatus('❌ ' + error.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!isOpen) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Image
        </label>
        <div className="flex items-center gap-3">
          {currentImage && (
            <img
              src={currentImage}
              alt="Current"
              className="w-20 h-20 object-cover rounded-lg border"
            />
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            {currentImage ? 'Change Image' : 'Select Image'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Image Manager</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Upload Section */}
          <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, SVG up to 5MB</p>
              {uploadStatus && (
                <p className={`mt-2 text-sm ${
                  uploadStatus.includes('✅') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>

          {/* File Gallery */}
          <div className="max-h-96 overflow-y-auto">
            <h4 className="text-md font-medium text-gray-900 mb-4">Uploaded Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.filename}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === file.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    onImageSelect(file.url)
                    setIsOpen(false)
                    onClose?.()
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      // delete file via API
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json', 'x-admin-key': adminApiKey },
                          body: JSON.stringify({ bucket: bucket, path: file.filename })
                        })
                        if (res.ok) {
                          await loadUploadedFiles()
                        } else {
                          console.error('Failed to delete')
                        }
                      } catch (err) {
                        console.error(err)
                      }
                    }}
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-red-600"
                    title="Delete"
                  >
                    ✕
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{file.filename}</p>
                    <p className="text-xs text-gray-400">{Math.round(file.size / 1024)}KB</p>
                  </div>
                </div>
              ))}
              
              {uploadedFiles.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No images uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
