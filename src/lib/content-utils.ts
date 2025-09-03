/**
 * Content Management Utilities
 * Helper functions for managing content in the admin panel
 */

export interface ContentStructure {
  [key: string]: any
}

/**
 * Convert relative image paths to full Supabase URLs
 */
export function convertToSupabaseUrl(path: string): string {
  if (!path) return path
  
  // Already a full URL
  if (path.startsWith('http')) return path
  
  // Convert relative path to Supabase URL
  if (path.startsWith('/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tmgbrmkzagzfjdjmtifo.supabase.co'
    // Remove leading slash and replace first segment with bucket name
    const pathParts = path.substring(1).split('/')
    if (pathParts.length >= 2) {
      const bucket = pathParts[0] // Hero, About, etc.
      const filename = pathParts.slice(1).join('/')
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`
    }
  }
  
  return path
}

/**
 * Process content to convert image paths to Supabase URLs
 */
export function processContentImages(content: any): any {
  if (!content) return content
  
  const processed = JSON.parse(JSON.stringify(content)) // Deep copy
  
  function processValue(value: any): any {
    if (typeof value === 'string') {
      // Check if it's an image path
      if (value.includes('/Hero/') || value.includes('/About/') || 
          value.includes('/icons/') || value.includes('/uploads/')) {
        return convertToSupabaseUrl(value)
      }
      return value
    }
    
    if (Array.isArray(value)) {
      return value.map(processValue)
    }
    
    if (typeof value === 'object' && value !== null) {
      const result: any = {}
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val)
      }
      return result
    }
    
    return value
  }
  
  return processValue(processed)
}

/**
 * Get nested value from an object using dot notation
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    if (key.includes('[') && key.includes(']')) {
      const [arrayKey, indexStr] = key.split('[')
      const index = parseInt(indexStr.replace(']', ''))
      return current?.[arrayKey]?.[index]
    }
    return current?.[key]
  }, obj)
}

/**
 * Set nested value in an object using dot notation
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const result = { ...obj }
  let current = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (key.includes('[') && key.includes(']')) {
      const [arrayKey, indexStr] = key.split('[')
      const index = parseInt(indexStr.replace(']', ''))
      if (!current[arrayKey]) current[arrayKey] = []
      if (!current[arrayKey][index]) current[arrayKey][index] = {}
      current = current[arrayKey][index]
    } else {
      if (!current[key]) current[key] = {}
      current = current[key]
    }
  }

  const lastKey = keys[keys.length - 1]
  if (lastKey.includes('[') && lastKey.includes(']')) {
    const [arrayKey, indexStr] = lastKey.split('[')
    const index = parseInt(indexStr.replace(']', ''))
    if (!current[arrayKey]) current[arrayKey] = []
    current[arrayKey][index] = value
  } else {
    current[lastKey] = value
  }

  return result
}

/**
 * Validate content structure
 */
export function validateContent(content: ContentStructure): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check required sections
  const requiredSections = ['hero', 'about', 'services', 'contact', 'menu']
  requiredSections.forEach(section => {
    if (!content[section]) {
      errors.push(`Missing required section: ${section}`)
    }
  })

  // Check bilingual fields
  const checkBilingualField = (obj: any, path: string) => {
    if (obj && typeof obj === 'object' && (obj.ar || obj.en)) {
      if (!obj.ar) errors.push(`Missing Arabic text at ${path}`)
      if (!obj.en) errors.push(`Missing English text at ${path}`)
    }
  }

  // Validate hero section
  if (content.hero) {
    checkBilingualField(content.hero.title, 'hero.title')
    checkBilingualField(content.hero.description, 'hero.description')
    checkBilingualField(content.hero.cta, 'hero.cta')
  }

  // Validate contact section
  if (content.contact) {
    if (!content.contact.phone?.value) {
      errors.push('Missing phone number in contact section')
    }
    if (!content.contact.email?.value) {
      errors.push('Missing email in contact section')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Get all image fields from content
 */
export function getImageFields(content: ContentStructure): Array<{
  path: string
  label: string
  value: string
}> {
  const imageFields: Array<{ path: string; label: string; value: string }> = []

  const findImageFields = (obj: any, currentPath: string = '') => {
    if (typeof obj !== 'object' || obj === null) return

    Object.entries(obj).forEach(([key, value]) => {
      const path = currentPath ? `${currentPath}.${key}` : key
      
      if (key.includes('image') || key.includes('icon') || key.includes('logo') || key === 'slides') {
        if (typeof value === 'string') {
          imageFields.push({
            path,
            label: path.replace(/\./g, ' > ').replace(/([A-Z])/g, ' $1').trim(),
            value
          })
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              imageFields.push({
                path: `${path}[${index}]`,
                label: `${path.replace(/\./g, ' > ')} ${index + 1}`,
                value: item
              })
            }
          })
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          findImageFields(item, `${path}[${index}]`)
        })
      } else if (typeof value === 'object') {
        findImageFields(value, path)
      }
    })
  }

  findImageFields(content)
  return imageFields
}

/**
 * Export content for backup
 */
export function exportContent(content: ContentStructure): string {
  return JSON.stringify(content, null, 2)
}

/**
 * Import content from backup
 */
export function importContent(jsonString: string): { success: boolean; content?: ContentStructure; error?: string } {
  try {
    const content = JSON.parse(jsonString)
    const validation = validateContent(content)
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      }
    }

    return {
      success: true,
      content
    }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format'
    }
  }
}

/**
 * Generate content preview
 */
export function generateContentPreview(content: ContentStructure): {
  totalSections: number
  totalTextFields: number
  totalImageFields: number
  missingTranslations: number
} {
  let totalSections = Object.keys(content).length
  let totalTextFields = 0
  let totalImageFields = 0
  let missingTranslations = 0

  const analyze = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return

    Object.entries(obj).forEach(([key, value]) => {
      if (key.includes('image') || key.includes('icon') || key.includes('logo') || key === 'slides') {
        if (typeof value === 'string') {
          totalImageFields++
        } else if (Array.isArray(value)) {
          totalImageFields += value.length
        }
      } else if (typeof value === 'object' && value && (value as any).ar !== undefined && (value as any).en !== undefined) {
        totalTextFields++
        if (!(value as any).ar || !(value as any).en) missingTranslations++
      } else if (Array.isArray(value)) {
        value.forEach(item => analyze(item))
      } else if (typeof value === 'object') {
        analyze(value)
      }
    })
  }

  analyze(content)

  return {
    totalSections,
    totalTextFields,
    totalImageFields,
    missingTranslations
  }
}
