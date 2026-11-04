import React from 'react';

interface ReactNativeAsset {
  file?: File;
  uri: string;
  name?: string;
  mimeType?: string;
}

interface UploadInput {
  reactNativeAsset?: ReactNativeAsset;
  file?: File;
  url?: string;
  base64?: string;
  buffer?: Buffer;
}

interface UploadResult {
  url?: string;
  mimeType?: string | null;
  error?: string;
}

interface UploadHookResult {
  upload: (input: UploadInput | File) => Promise<string | null>;
  uploading: boolean;
}

function useUpload(): UploadHookResult {
  const [uploading, setLoading] = React.useState(false);
  const upload = React.useCallback(async (input: UploadInput | File): Promise<string | null> => {
    // Normalize: if a bare File is passed, wrap it
    const normalized: UploadInput = input instanceof File ? { file: input } : input;
    try {
      setLoading(true);
      let response: Response | undefined;
      if ('file' in normalized && normalized.file) {
        const formData = new FormData();
        formData.append('file', normalized.file);
        response = await fetch('/api/upload', { method: 'POST', body: formData });
      } else if ('url' in normalized && normalized.url) {
        response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: normalized.url }),
        });
      } else if ('base64' in normalized && normalized.base64) {
        response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: normalized.base64 }),
        });
      } else {
        return null;
      }
      if (!response || !response.ok) return null;
      const data = await response.json();
      return data.url ?? null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upload, uploading };
}

export default useUpload;
