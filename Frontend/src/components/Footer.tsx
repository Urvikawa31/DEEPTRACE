import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg">DEEPTRACE</p>
            <p className="text-gray-400 text-sm">
              Created by Urvi Kava
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Urvikawa31"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/urvikava31/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center mt-6 space-y-3 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DEEPTRACE. AI-powered forensic analysis.</p>
          <p className="text-xs text-gray-600 max-w-3xl mx-auto">
            Disclaimer: DEEPTRACE is primarily trained on StyleGAN-generated images. Detection accuracy may vary with newer architectures and models. Always verify results with multiple tools for critical applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
