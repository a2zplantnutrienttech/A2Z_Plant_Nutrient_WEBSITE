import { fetchBlog } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    const blog = await fetchBlog(slug);
    if (!blog) {
      return {
        title: "Blog Not Found",
        robots: {
          index: false,
        },
      };
    }
    
    return {
      title: blog.title,
      description: blog.excerpt || blog.title,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.title,
        type: "article",
        images: blog.cover_image ? [{ url: blog.cover_image }] : [],
      },
    };
  } catch (error) {
    return {
      title: "Blog",
      alternates: {
        canonical: `/blog/${slug}`,
      },
    };
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
