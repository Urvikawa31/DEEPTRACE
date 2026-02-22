import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onNavigate: (section: 'scan') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const subtitles = [
    'Unmasking AI-Generated Faces with Deep Learning',
    'Detecting GAN and Diffusion-Generated Face Images',
  ];

  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = subtitles[currentSubtitle];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseTime = 2000;

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(currentText.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentSubtitle]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-4xl text-center">
        <div className="mb-8 inline-block">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
            <div className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
              DEEPTRACE
            </div>
          </div>
        </div>

        <div className="h-16 mb-8">
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            {displayedText}
            <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse"></span>
          </p>
        </div>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          AI-powered forensic analysis for face authenticity
        </p>

        <button
          onClick={() => onNavigate('scan')}
          className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto"
        >
          Scan Face Image
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
