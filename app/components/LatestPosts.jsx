export default function LatestPosts({ posts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex flex-col bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <img
            src={
              post.image
                ? `http://localhost:8080/uploads/${post.image}`
                : 'https://via.placeholder.com/300x200?text=No+Image'
            }
            alt={post.title}
            className="w-full h-36 object-cover rounded-t-lg"
            loading="lazy"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {post.title}
            </h3>
            <p className="text-gray-700 line-clamp-4 flex-grow">{post.excerpt}</p>
            <a
              href={`/posts/${post.id}`}
              className="mt-3 self-start text-indigo-600 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
