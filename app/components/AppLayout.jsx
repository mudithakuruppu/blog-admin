'use client';

import { usePathname } from 'next/navigation';
import LayoutWithOptionalHeaderFooter from './LayoutWithOptionalHeaderFooter';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return isAdminRoute ? children : <LayoutWithOptionalHeaderFooter>{children}</LayoutWithOptionalHeaderFooter>;
}
