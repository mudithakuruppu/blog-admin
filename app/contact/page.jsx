"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: Connect with backend or email service
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We'd love to hear from you. Fill out the form below and we'll get back to you shortly.
        </p>
      </section>

      {/* Form + Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block font-medium mb-1">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>123 Modern Street, Tech City, NY 10001</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>hello@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
