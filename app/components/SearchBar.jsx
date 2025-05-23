export default function SearchBar() {
  return (
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Search blog posts..."
        className="w-full max-w-xl p-3 rounded-l-md border border-gray-300 shadow-md focus:outline-none"
      />
      <button className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700">Search</button>
    </div>
  );
}
