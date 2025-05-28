import Link from 'next/link';

export function PostCard({ post }) {
  // Construct the full image URL if post.image exists
  const imageUrl = post.image
    ? `http://localhost:8080/uploads/${post.image}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="group rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 transform cursor-pointer overflow-hidden">
      <div className="overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col justify-between h-[220px]">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:underline cursor-pointer">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-base flex-grow line-clamp-3">{post.excerpt}</p>

        <Link
          href={`/posts/${post.id}`}
          className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
}
