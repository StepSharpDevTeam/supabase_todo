import { ReactNode } from 'react'; // Import ReactNode type

import { Inter } from 'next/font/google';
import './globals.css'; 

const inter = Inter({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
});

export const metadata = {
  title: 'Todo with Supabase',
  description: 'Todo with Supabase',
};

// Define props type explicitly
interface RootLayoutProps {
  children: ReactNode; // ReactNode is the correct type for children in JSX
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
