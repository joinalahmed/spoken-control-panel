
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-center text-sm text-gray-600">
        <span>Made with</span>
        <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
        <span>by Aivar Innovations</span>
      </div>
    </footer>
  );
};

export default Footer;
