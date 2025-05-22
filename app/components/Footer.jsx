import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-gray-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>

        <div className="flex space-x-6">
          {[FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="text-gray-300 hover:text-pink-500 transition duration-300 transform hover:scale-110"
              aria-label="Social Link"
            >
              <Icon size={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
