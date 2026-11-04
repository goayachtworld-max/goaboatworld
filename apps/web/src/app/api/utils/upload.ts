import fs from 'fs/promises';
import path from 'path';

interface UploadInput {
  url?: string;
  buffer?: Buffer;
  base64?: string;
}

interface UploadResult {
  url?: string;
  mimeType: string | null;
  error?: string;
}

async function upload({ url, buffer, base64 }: UploadInput): Promise<UploadResult> {
  try {
    let finalBuffer: Buffer;
    let extension = 'jpg';

    if (buffer) {
      finalBuffer = buffer;
    } else if (base64) {
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      finalBuffer = Buffer.from(base64Data, 'base64');
    } else if (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      finalBuffer = Buffer.from(await res.arrayBuffer());
    } else {
      return { mimeType: null, error: 'No image data provided' };
    }

    const mimeType = await detectMimeType(finalBuffer);
    extension = getExtensionFromMime(mimeType);

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), finalBuffer);

    return {
      url: `/uploads/${fileName}`,
      mimeType: mimeType || 'image/jpeg',
    };
  } catch (e) {
    console.error('Local upload error:', e);
    return {
      mimeType: null,
      error: e instanceof Error ? e.message : 'Unknown upload error',
    };
  }
}

async function detectMimeType(buffer: Buffer): Promise<string | null> {
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return 'image/gif';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x46) return 'image/webp';
  return null;
}

function getExtensionFromMime(mime: string | null): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };
  return map[mime || ''] || 'jpg';
}

export { upload };
export default upload;
