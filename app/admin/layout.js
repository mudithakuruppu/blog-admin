// app/admin/layout.js
import React from 'react';
import AdminLayout from '@/components/admin/Layout'; // adjust path if needed
import '../../globals.css'; // make sure styles are still applied

export const metadata = {
  title: 'Admin Panel',
};

export default function AdminRootLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
