# Yummi Go Platform - Admin Panel

A comprehensive content management system for the Yummi Go platform with advanced admin panel capabilities.

## Features

### 🔐 Authentication
- Secure login system with password protection
- Admin key validation for API access
- Session management with logout functionality

### 📝 Content Management
- **Visual Editor**: User-friendly section-based editor
- **Raw JSON Editor**: Direct JSON editing for advanced users
- **Bilingual Support**: Arabic and English text management
- **Real-time Preview**: See changes as you make them

### 🖼️ Image Management
- **Image Upload**: Drag & drop or click to upload images
- **Image Gallery**: Browse and select from uploaded images
- **Multiple Formats**: Support for JPG, PNG, WEBP, AVIF, SVG
- **File Size Validation**: Maximum 5MB per image
- **Auto-categorization**: Images organized by upload date

### 🛡️ Data Validation
- JSON structure validation
- Required field checking
- Bilingual content verification
- Error reporting and handling

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd "Yummi Go Platform"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create upload directory**
   ```bash
   mkdir public/uploads
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Admin Panel Usage

### 🔑 Login
- **URL**: `/admin`
- **Password**: `admin123` (change in `src/app/admin/page.tsx`)
- **Admin Key**: `yummi-admin-2024` (change in API routes)

### 📖 Content Editing

#### Visual Editor Mode
1. **Select Section**: Choose from navigation sidebar
2. **Edit Fields**: 
   - Text fields: Direct input
   - Bilingual fields: Arabic and English tabs
   - Images: Click "Select Image" or "Change Image"
3. **Save Changes**: Click "💾 Save Changes"

#### Raw JSON Mode  
1. **Switch to Raw Editor**: Click "Raw JSON Editor"
2. **Edit JSON**: Direct JSON manipulation
3. **Validate**: Automatic validation on save
4. **Save Changes**: Click "💾 Save Changes"

### 🖼️ Image Management
1. **Click any image field** in the Visual Editor
2. **Upload new images**: 
   - Drag & drop files onto the upload area
   - Or click "Upload a file" to browse
3. **Select existing images**: Click any image in the gallery
4. **Auto-selection**: Newly uploaded images are auto-selected

### 📊 Content Structure

The content is organized in the following sections:

- **Hero**: Title, description, CTA, background images
- **About**: Company information, mission, team image
- **Services**: Service list with icons and descriptions
- **Why Choose Us**: Benefits with icons and explanations
- **Achievements**: Statistics and accomplishments
- **Contact**: Contact information and forms
- **Footer**: Links, social media, company info
- **Menu**: Navigation labels
- **Branding**: Logos, colors, and brand assets

## API Endpoints

### Content API (`/api/content`)
- **GET**: Retrieve current content
- **POST**: Update content (requires `x-admin-key` header)

### Upload API (`/api/upload`)  
- **GET**: List uploaded files
- **POST**: Upload new image (requires `x-admin-key` header)

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin panel interface
│   ├── api/
│   │   ├── content/
│   │   │   └── route.ts      # Content API
│   │   └── upload/
│   │       └── route.ts      # Upload API
│   └── ...
├── components/
│   └── ImageManager.tsx      # Image management component
├── lib/
│   └── content-utils.ts      # Content utility functions
└── ...

public/
├── content.json              # Main content file
├── uploads/                  # Uploaded images directory
└── ...
```

## Security Features

### 🔐 Authentication
- Password-based admin login
- API key validation for all write operations
- Session management

### 🛡️ File Upload Security
- File type validation (images only)
- File size limits (5MB maximum)  
- Secure file naming with timestamps
- Upload directory isolation

### ✅ Data Validation
- JSON structure validation
- Content field validation
- XSS protection through React
- CSRF protection via Next.js

## Customization

### Change Admin Password
Edit the `PASSWORD` constant in `src/app/admin/page.tsx`:
```typescript
const PASSWORD = 'your-new-password'
```

### Change Admin API Key
Update the `ADMIN_KEY` constant in:
- `src/app/api/content/route.ts`  
- `src/app/api/upload/route.ts`
- `src/app/admin/page.tsx`

### Add New Content Sections
1. **Update content structure** in `public/content.json`
2. **Add TypeScript types** in `src/app/admin/page.tsx`
3. **Implement editor fields** in the `AdvancedSectionEditor` component

### Customize Image Categories
Modify the upload API in `src/app/api/upload/route.ts` to add custom categories.

## Troubleshooting

### Common Issues

**Build Errors**
```bash
npm run build
```
Check for TypeScript errors in the terminal output.

**Upload Failures**  
- Verify `public/uploads` directory exists
- Check file size (max 5MB)
- Ensure file is a valid image format

**Save Failures**
- Verify admin key matches across all files
- Check network connection
- Validate JSON structure in Raw Editor mode

**Image Display Issues**
- Ensure image URLs start with `/` for relative paths
- Check if uploaded images are in `public/uploads/`
- Verify image file extensions

### Debug Mode
Enable detailed logging by adding console.log statements to:
- `src/app/api/content/route.ts` for content operations
- `src/app/api/upload/route.ts` for upload operations

## Performance

### Optimization Tips
- **Image Compression**: Compress images before upload
- **Caching**: Images are automatically cached by Next.js
- **Bundle Size**: Keep content.json reasonable size
- **Database**: Consider moving to database for large content

### Monitoring
- Check browser Network tab for API response times
- Monitor `public/uploads` directory size
- Use Next.js analytics for performance insights

## Backup & Recovery

### Export Content
Use the admin panel's Raw JSON Editor to copy full content for backup.

### Import Content
Paste JSON content into Raw JSON Editor and save.

### Automated Backups
Consider implementing automated backups by:
1. Adding a backup API endpoint
2. Scheduling regular content exports
3. Storing backups in cloud storage

## Future Enhancements

### Planned Features
- [ ] OAuth integration (Google, GitHub)
- [ ] Database integration (Supabase/PostgreSQL)
- [ ] Image optimization and compression
- [ ] Content versioning and rollback
- [ ] Multi-user support with roles
- [ ] Real-time collaborative editing
- [ ] Content scheduling and publishing
- [ ] SEO metadata management
- [ ] Analytics and usage tracking
- [ ] Mobile responsive admin panel

### API Improvements
- [ ] Rate limiting
- [ ] Request logging
- [ ] Content backup endpoints
- [ ] Webhook support for external integrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Yummi Go Platform.

---

**Support**: For technical support, contact the development team.
**Version**: 1.0.0
**Last Updated**: September 2025
