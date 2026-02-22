import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { detectDeepfake } from '../services/deepfakeApi';
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

interface ScanProps {
  onDetect: (imageData: string, isReal: boolean, confidence: number) => void;
}

export default function Scan({ onDetect }: ScanProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceValid, setFaceValid] = useState(false);
  const [detector, setDetector] = useState<FaceDetector | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number | null>(null);

  /* ---------------- INITIALIZE MEDIAPIPE ---------------- */
  // useEffect(() => {
  //   async function loadModel() {
  //     try {
  //       const vision = await FilesetResolver.forVisionTasks(
  //         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  //       );
  //       const faceDetector = await FaceDetector.createFromOptions(vision, {
  //         baseOptions: {
  //           modelAssetPath:
  //             "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
  //         },
  //         runningMode: "VIDEO",
  //       });
  //       setDetector(faceDetector);
  //     } catch (error) {
  //       console.error("SYS.ERR.VISION_LOAD:", error);
  //       setError("Failed to initialize vision module.");
  //     }
  //   }
  //   loadModel();
  // }, []);

  const detectorRef = useRef<FaceDetector | null>(null);

  useEffect(() => {

    if (detectorRef.current) return;

    async function loadModel() {

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
        },
        runningMode: "VIDEO",
      });

      detectorRef.current = faceDetector;

      setDetector(faceDetector);

    }

    loadModel();

  }, []);
  /* ---------------- FACE DETECTION LOGIC ---------------- */
  const detectFace = useCallback(async (source: HTMLVideoElement | HTMLImageElement) => {
    if (!detector) return false;
    try {
      const detections = await detector.detectForVideo(source, performance.now());
      return detections.detections.length > 0;
    } catch (e) {
      return false;
    }
  }, [detector]);

  const liveLoop = useCallback(async () => {
    if (isCapturing && videoRef.current && videoRef.current.readyState >= 2) {
      const hasFace = await detectFace(videoRef.current);
      setFaceValid(hasFace);
    }
    if (isCapturing) {
      requestRef.current = requestAnimationFrame(liveLoop);
    }
  }, [detectFace, isCapturing]);

  useEffect(() => {
    if (isCapturing) {
      requestRef.current = requestAnimationFrame(liveLoop);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCapturing, liveLoop]);

  /* ---------------- SAFE CAMERA STOP ---------------- */
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsCapturing(false);
  };

  /* ---------------- START CAMERA ---------------- */
  const startCamera = () => {
    setError(null);
    setSelectedImage(null);
    setCapturedFile(null);
    setImageSource(null);
    setFaceValid(false);
    setIsCapturing(true);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function enableStream() {
      if (isCapturing && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
          }
        } catch (err) {
          setError("Camera access denied.");
          setIsCapturing(false);
        }
      }
    }

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCapturing]);

  /* ---------------- CAPTURE ---------------- */
  const capturePhoto = () => {
    if (!faceValid) {
      setError('Face not properly detected. Ensure your full face is visible.');
      return;
    }

    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      stopCamera();

      setCapturedFile(new File([blob], 'camera_face.jpg', { type: 'image/jpeg' }));
      setSelectedImage(URL.createObjectURL(blob));
      setImageSource('camera');
    }, 'image/jpeg', 0.95);
  };

  /* ---------------- UPLOAD ---------------- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !detector) return;

    setError(null);
    const previewUrl = URL.createObjectURL(file);

    // Check face in uploaded image
    const img = new Image();
    img.src = previewUrl;
    img.onload = async () => {
      const hasFace = await detectFace(img);
      if (!hasFace) {
        setError('No human face detected. Please upload a clear face image. For best results, Ensure the face is clearly visible (passport-style framing).');
        URL.revokeObjectURL(previewUrl);
        e.target.value = '';
        return;
      }

      setCapturedFile(file);
      setSelectedImage(previewUrl);
      setImageSource('upload');
    };

    img.onerror = () => setError("Invalid image file.");
  };

  /* ---------------- ANALYZE ---------------- */
  const handleAnalyze = async () => {
    if (!capturedFile || !imageSource) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await detectDeepfake(capturedFile, imageSource);
      onDetect(
        selectedImage!,
        result.prediction === 'REAL',
        result.confidence ?? 0
      );
    } catch {
      setError('Detection failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ---------------- UI (OLD STYLE RESTORED) ---------------- */
  return (
    <div className="min-h-screen pt-24 px-6 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-10">
          Scan Face Image
        </h2>

        {error && !selectedImage && (
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-red-900/40 border border-red-500/50
                      text-red-300 px-6 py-3 rounded-lg">
              <AlertCircle size={18} />
              {error}
            </div>
          </div>
        )}

        {!selectedImage && !isCapturing && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
              <button
                onClick={startCamera}
                className="group bg-gradient-to-br from-gray-800 to-gray-900
                           hover:from-blue-600 hover:to-cyan-600
                           border border-gray-700 hover:border-blue-400
                           rounded-3xl p-16 transition-all duration-300
                           flex flex-col items-center justify-center
                           shadow-xl hover:shadow-blue-500/30
                           transform hover:-translate-y-2"
              >
                <Camera className="w-24 h-24 text-blue-400 group-hover:text-white transition-colors" />
                <p className="mt-6 text-2xl font-bold text-white">Camera Capture</p>
                <p className="mt-2 text-gray-400 group-hover:text-white/80">Use live camera to scan face</p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="group bg-gradient-to-br from-gray-800 to-gray-900
                           hover:from-cyan-600 hover:to-blue-600
                           border border-gray-700 hover:border-cyan-400
                           rounded-3xl p-16 transition-all duration-300
                           flex flex-col items-center justify-center
                           shadow-xl hover:shadow-cyan-500/30
                           transform hover:-translate-y-2"
              >
                <Upload className="w-24 h-24 text-cyan-400 group-hover:text-white transition-colors" />
                <p className="mt-6 text-2xl font-bold text-white">Upload Image</p>
                <p className="mt-2 text-gray-400 group-hover:text-white/80">Upload image from device</p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {isCapturing && (
          <div className="bg-gray-800 p-6 rounded-xl mt-6">
            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black scale-x-[-1]" />

            <p className={`text-center mt-2 font-semibold ${faceValid ? 'text-green-400' : 'text-red-400'}`}>
              {faceValid ? 'Face aligned ✓' : 'Align full face, remove obstructions'}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button onClick={capturePhoto} className="bg-blue-600 px-6 py-3 rounded-lg text-white">
                Capture Photo
              </button>
              <button onClick={() => stopCamera()} className="bg-gray-600 px-6 py-3 rounded-lg text-white">
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="bg-gray-800 p-6 rounded-xl mt-6 text-center">
            <img src={selectedImage} className="w-full max-h-96 object-contain rounded-lg mx-auto" />

            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-6">
              {imageSource === 'camera' && (
                <button onClick={startCamera} className="bg-gray-600 px-6 py-3 rounded-lg text-white">
                  Re-capture
                </button>
              )}
              {imageSource === 'upload' && (
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-600 px-6 py-3 rounded-lg text-white">
                  Change Image
                </button>
              )}

              <button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-blue-600 px-6 py-3 rounded-lg text-white">
                {isAnalyzing ? 'Analyzing...' : 'Detect'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
