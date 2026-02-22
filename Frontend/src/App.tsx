import { useState } from 'react';
import Header from './components/Header';
import Landing from './components/Landing';
import Scan from './components/Scan';
import Results from './components/Results';
import About from './components/About';
import Footer from './components/Footer';
import Loading from './components/Loading';

type Section = 'landing' | 'scan' | 'about' | 'results' | 'loading';

interface DetectionResult {
  imageData: string;
  isReal: boolean;
  confidence: number;
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>('landing');
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleNavigate = (section: Section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetect = (imageData: string, isReal: boolean, confidence: number) => {
    setResult({
      imageData,
      isReal,
      confidence,
    });
    setActiveSection('results');
  };

  const handleNewScan = () => {
    setResult(null);
    setActiveSection('scan');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onNavigate={handleNavigate} activeSection={activeSection} />

      {activeSection === 'landing' && <Landing onNavigate={handleNavigate} />}
      {activeSection === 'scan' && <Scan onDetect={handleDetect} />}
      {activeSection === 'loading' && <Loading />}
      {activeSection === 'results' && result && (
        <Results
          imageData={result.imageData}
          isReal={result.isReal}
          confidence={result.confidence}
          onNewScan={handleNewScan}
        />
      )}
      {activeSection === 'about' && <About />}

      {activeSection !== 'landing' && <Footer />}
    </div>
  );
}

export default App;
