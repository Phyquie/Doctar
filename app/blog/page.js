import Head from 'next/head';
import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Choosing the Right Doctor",
      excerpt: "Learn how to find the perfect healthcare provider for your needs.",
      date: "2025-01-15",
      category: "Healthcare Tips"
    },
    {
      id: 2,
      title: "Understanding Health Insurance: A Complete Guide",
      excerpt: "Everything you need to know about health insurance coverage.",
      date: "2025-01-10",
      category: "Insurance"
    },
    {
      id: 3,
      title: "Preventive Care: Why Regular Check-ups Matter",
      excerpt: "The importance of preventive healthcare and regular medical check-ups.",
      date: "2025-01-05",
      category: "Preventive Care"
    },
    {
      id: 4,
      title: "Mental Health Awareness: Breaking the Stigma",
      excerpt: "Understanding mental health and the importance of seeking help.",
      date: "2024-12-28",
      category: "Mental Health"
    },
    {
      id: 5,
      title: "Telemedicine: The Future of Healthcare",
      excerpt: "How technology is revolutionizing healthcare delivery.",
      date: "2024-12-20",
      category: "Technology"
    },
    {
      id: 6,
      title: "Healthy Living: Simple Steps to Better Health",
      excerpt: "Easy lifestyle changes that can improve your overall health.",
      date: "2024-12-15",
      category: "Lifestyle"
    }
  ];

  return (
    <>
      <Head>
        <title>Blog - Doctar</title>
        <meta name="description" content="Read our latest healthcare articles, tips, and insights." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Blog</h1>
            <p className="text-xl text-gray-600">Insights, tips, and updates from the healthcare world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#5f4191] font-medium">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#5f4191] hover:text-[#4d3374] font-medium"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
