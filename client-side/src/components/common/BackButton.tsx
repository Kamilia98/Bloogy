import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BackButton() {
  return (
    <Link
      to={'/blogs'}
      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
    >
      <ArrowLeft size={18} />
      Back to blogs
    </Link>
  );
}
