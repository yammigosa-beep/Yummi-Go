/**
 * Example: How to use Supabase images by name
 * 
 * This file demonstrates the different ways to access images
 * from Supabase using the useSupabaseImages hook
 */

import useSupabaseImages from '../hooks/useSupabaseImages'

export function ImageExamples() {
  const { getImageByName, images, imagesByBucket, loading } = useSupabaseImages(['Hero', 'About'])

  if (loading) {
    return <div>Loading images...</div>
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Supabase Image Usage Examples</h1>
      
      {/* Method 1: Get image by filename */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Method 1: By exact filename</h2>
        <img 
          src={getImageByName('1.jpeg', 'Hero')} 
          alt="Hero 1" 
          className="w-48 h-32 object-cover rounded"
        />
        <p className="text-sm text-gray-600 mt-2">
          Code: <code>getImageByName('1.jpeg', 'Hero')</code>
        </p>
      </div>

      {/* Method 2: Get image by name without extension */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Method 2: By name without extension</h2>
        <img 
          src={getImageByName('1', 'Hero')} 
          alt="Hero 1" 
          className="w-48 h-32 object-cover rounded"
        />
        <p className="text-sm text-gray-600 mt-2">
          Code: <code>getImageByName('1', 'Hero')</code>
        </p>
      </div>

      {/* Method 3: Get image by partial name */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Method 3: By partial name (searches all buckets)</h2>
        <img 
          src={getImageByName('about')} 
          alt="About" 
          className="w-48 h-32 object-cover rounded"
        />
        <p className="text-sm text-gray-600 mt-2">
          Code: <code>getImageByName('about')</code> - searches all buckets
        </p>
      </div>

      {/* Method 4: Direct access to images object */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Method 4: Direct access to images object</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(images).slice(0, 8).map(([name, url]) => (
            <div key={name} className="text-center">
              <img 
                src={url} 
                alt={name} 
                className="w-full h-24 object-cover rounded mb-2"
              />
              <p className="text-xs text-gray-600 truncate">{name}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Code: <code>images['1']</code> or <code>images['1.jpeg']</code>
        </p>
      </div>

      {/* Method 5: Access by bucket */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Method 5: Browse by bucket</h2>
        {Object.entries(imagesByBucket).map(([bucketName, bucketImages]) => (
          <div key={bucketName} className="mb-6">
            <h3 className="font-medium mb-2">{bucketName} Bucket ({bucketImages.length} images)</h3>
            <div className="grid grid-cols-6 gap-2">
              {bucketImages.slice(0, 6).map((image) => (
                <div key={image.filename} className="text-center">
                  <img 
                    src={image.url} 
                    alt={image.filename} 
                    className="w-full h-20 object-cover rounded mb-1"
                  />
                  <p className="text-xs text-gray-600 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-600 mt-2">
          Code: <code>imagesByBucket['Hero']</code> returns array of image objects
        </p>
      </div>

      {/* Usage Summary */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">📋 Usage Summary</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Simple by name:</strong> <code>getImageByName('1')</code></p>
          <p><strong>Specific bucket:</strong> <code>getImageByName('1', 'Hero')</code></p>
          <p><strong>With extension:</strong> <code>getImageByName('1.jpeg')</code></p>
          <p><strong>Direct access:</strong> <code>images['1']</code></p>
          <p><strong>Fallback pattern:</strong> <code>getImageByName('logo') || '/default-logo.png'</code></p>
        </div>
      </div>
    </div>
  )
}
