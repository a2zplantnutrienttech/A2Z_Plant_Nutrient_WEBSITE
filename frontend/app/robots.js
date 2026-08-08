export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin-login', '/add-blog', '/add-media'],
    },
    sitemap: 'https://www.a2zplantnutrient.com/sitemap.xml',
  }
}
