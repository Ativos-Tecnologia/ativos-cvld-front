export const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB
export const MAX_PAGES = 100;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePdfFile(file: File): FileValidationResult {
  if (!file.type.includes("pdf")) {
    return {
      isValid: false,
      error: "File must be a PDF",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size must be less than 32MB",
    };
  }

  return { isValid: true };
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(",")[1];
      resolve(base64Content);
    };
    reader.onerror = (error) => reject(error);
  });
}
