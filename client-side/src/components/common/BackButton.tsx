import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/blogs')}
      className="hover:text-primary flex items-center gap-2 text-gray-600 transition-colors"
    >
      <ArrowLeft size={18} />
      Back to blogs
    </button>
  );
}
