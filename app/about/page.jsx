"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Founder & CEO",
    image: "/team/alice.jpg",
    bio: "Passionate about building great products and empowering teams to innovate.",
  },
  {
    name: "Mark Stevens",
    role: "Chief Technology Officer",
    image: "/team/mark.jpg",
    bio: "Tech visionary focused on creating scalable and sustainable software solutions.",
  },
  {
    name: "Sophia Lee",
    role: "Head of Design",
    image: "/team/sophia.jpg",
    bio: "Designing beautiful and user-friendly experiences is her top priority.",
  },
];

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/yourprofile", icon: TwitterIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/yourprofile", icon: LinkedInIcon },
  { name: "Email", href: "mailto:contact@yourdomain.com", icon: EmailIcon },
];

function TwitterIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M23.954 4.569c-0.885 0.393-1.83 0.656-2.825 0.775 1.014-0.608 1.794-1.574 2.163-2.724..." />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5..." />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M4 4h16v16H4z" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  );
}

export default function AboutPage() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <main
      className={`max-w-7xl mx-auto px-6 py-16 transition-opacity duration-700 ${
        fadeIn ? "fade-in" : "opacity-0"
      }`}
    >
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">About Us</h1>
        <p className="text-lg leading-relaxed">
          We are a passionate team committed to delivering the best solutions with a human touch.
          Our mission is to make your life easier, one step at a time.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="rounded-xl p-10 mb-20 text-center border border-gray-200">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-4">Our Mission</h2>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed">
          To innovate and inspire by creating high-quality products that enrich the lives of people everywhere.
          We believe in transparency, collaboration, and continuous improvement.
        </p>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-semibold text-blue-700 mb-10 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map(({ name, role, image, bio }) => (
            <div
              key={name}
              className="rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-indigo-400">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 32vw"
                />
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-indigo-600 font-medium mb-3">{role}</p>
              <p className="text-sm">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Get in Touch</h2>
        <p className="mb-6">Have questions or want to collaborate? Reach out to us!</p>
        <div className="flex justify-center gap-8 text-indigo-600">
          {socialLinks.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="hover:text-indigo-800 transition-colors duration-300"
            >
              <Icon />
            </a>
          ))}
        </div>
      </section>

      <style jsx>{`
        .fade-in {
          animation: fadeInAnimation 1s ease forwards;
        }
        @keyframes fadeInAnimation {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
