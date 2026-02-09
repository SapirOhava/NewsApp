import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            News App
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
