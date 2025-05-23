export function PostCard({ post }) {
  return (
    <div className="group rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 transform cursor-pointer overflow-hidden">
      <div className="overflow-hidden rounded-t-xl">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col justify-between h-[220px]">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-base flex-grow line-clamp-3">{post.excerpt}</p>
        <a
          href={`/posts/${post.id}`}
          className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300"
          aria-label={`Read more about ${post.title}`}
        >
          Read More &rarr;
        </a>
      </div>
    </div>
  );
}
