import { fetchBlogs } from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://www.a2zplantnutrient.com";
  
  const routes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/gallery",
    "/careers",
    "/contact",
    "/company-profile"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? 'weekly' : 'monthly',
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const blogs = await fetchBlogs().catch(() => []);
    const blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    
    return [...routes, ...blogRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
