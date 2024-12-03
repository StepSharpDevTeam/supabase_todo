import { ReactNode } from 'react'; 

import './globals.css';

export const metadata = {
  title: 'Todo with Supabase',
  description: 'Todo with Supabase',
};
interface RootLayoutProps {
  children: ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
    >
      {children}
    </body>
  </html >
  );
}
