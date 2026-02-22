export interface DeepfakeDetectionResult {
  prediction?: string;
  confidence?: number;
  status?: 'success' | 'invalid';
  message?: string;
}

export async function detectDeepfake(
  file: File,
  source: 'camera' | 'upload'
): Promise<DeepfakeDetectionResult> {

  const formData = new FormData();
  formData.append('file', file);
  formData.append('source', source); // 🔥 REQUIRED

  const response = await fetch('https://urvikava-deepfake.hf.space/predict', {
    // const response = await fetch('https://30b73a6ca11c.ngrok-free.app/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('API Error');
  }

  return response.json();
}
