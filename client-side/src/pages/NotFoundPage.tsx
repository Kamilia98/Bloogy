import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center">
      <h1 className="animate-bounce text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Oops! Page not found.</p>
      <p className="mt-1 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className='mt-6'>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
