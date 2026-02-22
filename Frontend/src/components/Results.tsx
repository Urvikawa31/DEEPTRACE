import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ResultsProps {
  imageData: string;
  isReal: boolean;
  confidence: number;
  onNewScan: () => void;
}

export default function Results({ imageData, isReal, confidence, onNewScan }: ResultsProps) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Detection Results</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <img
              src={imageData}
              alt="Analyzed"
              className="w-full rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div
              className={`${
                isReal ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'
              } border-2 rounded-xl p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                {isReal ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                )}
                <span
                  className={`text-3xl font-bold ${
                    isReal ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isReal ? 'REAL' : 'FAKE'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-white font-semibold">{confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      isReal ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Analysis</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {isReal
                      ? 'This face shows characteristics of a genuine human image.'
                      : 'This face exhibits patterns commonly found in AI-generated images.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onNewScan}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Scan Another Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
