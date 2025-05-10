import type { Metadata } from 'next';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { Web3Provider } from './providers';
import { FarcasterProvider } from '@/components/FarcasterProvider';
import './globals.css';

// Using Poppins font for a more rounded, friendly look
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Builder Journal on Monad',
  description: 'Document your builder journey on Monad blockchain as NFTs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
        <meta name="fc:frame" content='{
          "version": "next",
          "imageUrl": "/og-image.png",
          "button": {
            "title": "✍️ Open Journal",
            "action": {
              "type": "launch_frame",
              "name": "Monad Journal",
              "splashImageUrl": "/splash.png",
              "splashBackgroundColor": "#6c54f8"
            }
          }
        }' />
      </head>
      <body className={poppins.className}>
        <FarcasterProvider>
          <Web3Provider>
            <div className="min-h-screen bg-white">
              <header className="bg-[#6c54f8] py-3 md:py-4 rounded-b-2xl md:rounded-b-3xl shadow-lg">
                <nav className="container mx-auto px-3 md:px-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-3 sm:mb-0">
                      <div className="p-1.5 md:p-2 bg-white rounded-full shadow-md">
                        <svg
                          className="h-6 w-6 md:h-8 md:w-8 text-[#6c54f8]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-white">
                        Builder Journal
                      </span>
                    </div>
                    <div className="flex space-x-2 md:space-x-4">
                      <NavLink href="/" label="Home" />
                      <NavLink href="/journal" label="Write" />
                      <NavLink href="/gallery" label="Gallery" />
                    </div>
                  </div>
                </nav>
              </header>
              
              <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
                {children}
              </main>
              
              <footer className="mt-8 md:mt-12 bg-[#6c54f8] rounded-t-2xl md:rounded-t-3xl pt-6 md:pt-8 pb-4 md:pb-6 text-white">
                <div className="container mx-auto px-3 sm:px-4 md:px-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <p className="text-xs md:text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Builder Journal on Monad
                      </p>
                    </div>
                    <div className="flex space-x-4 md:space-x-6">
                      <FooterLink href="https://monad.xyz" label="Monad" />
                      <FooterLink href="https://github.com/yourusername/builder-journal-app" label="GitHub" />
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </Web3Provider>
        </FarcasterProvider>
      </body>
    </html>
  );
}

// Custom NavLink component with game-like button style
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="px-2 py-1.5 md:px-4 md:py-2 bg-white text-[#6c54f8] text-xs md:text-sm rounded-full font-medium shadow-md hover:shadow-lg hover:transform hover:scale-105 transition-all duration-200">
        {label}
      </div>
    </Link>
  );
}

// Footer link with hover effects
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-white/80 hover:underline transition-all duration-200"
    >
      {label}
    </a>
  );
}