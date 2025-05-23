export default function FeaturedPosts({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.slice(0, 2).map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h3>
            <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
