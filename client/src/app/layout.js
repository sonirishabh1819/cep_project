import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { Toaster } from 'react-hot-toast';
export const metadata = {
  title: 'LearnShare — Student Marketplace for Educational Materials',
  description: 'Buy, sell, donate, and exchange educational materials. Reduce the cost of education through community-driven resource sharing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>
            <Toaster position="top-right" toastOptions={{ 
              style: { 
                background: '#faf5f0', 
                color: '#1a1210', 
                fontFamily: 'Inter, sans-serif' 
              } 
            }} />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
