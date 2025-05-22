'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWithOptionalHeaderFooter({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
