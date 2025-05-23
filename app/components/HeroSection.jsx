export default function HeroSection() {
  return (
    <section className=" relative py-16 px-6 text-center bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 text-white ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Welcome to TechVerse
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Stay updated with the latest in tech, gadgets, and programming!
        </p>
        <form className="max-w-xl mx-auto flex items-center shadow-lg rounded-full overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="flex-grow px-6 py-3 text-gray-900 text-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold transition-colors duration-300"
            aria-label="Search blog posts"
          >
            Search
          </button>
        </form>
      </div>
      {/* Optional subtle background pattern or shape */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-radial from-indigo-600/20 via-transparent to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
