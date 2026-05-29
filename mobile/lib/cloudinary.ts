const CLOUD = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export async function uploadImage(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
  formData.append('upload_preset', PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.secure_url as string;
}
