import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Playo US — Badminton Activity Hosting',
  description: 'Find and join badminton games near you',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-primary text-white px-4 py-3 flex items-center justify-between shadow">
          <a href="/" className="text-xl font-bold">Playo US</a>
          <nav className="flex gap-4 text-sm">
            <a href="/activities/new" className="hover:underline">Host a Game</a>
            <a href="/profile" className="hover:underline">Profile</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
