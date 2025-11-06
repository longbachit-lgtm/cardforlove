import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parse } from "exifr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi dataURL thành File object
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Xử lý EXIF orientation và xoay ảnh đúng hướng
 * Giải quyết vấn đề ảnh bị xoay ngang khi upload từ điện thoại
 * Trả về dataURL đã được xoay đúng và File object mới
 */
export async function fixImageOrientation(file: File): Promise<{ dataURL: string; file: File }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        const dataUrl = e.target?.result as string;
        
        img.onload = async () => {
          try {
            // Parse EXIF data từ file
            const exifData = await parse(file);
            
            const orientation = exifData?.Orientation || 1;
            
            // Tạo canvas để xoay ảnh
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Cannot get canvas context'));
              return;
            }
            
            // Xác định kích thước canvas dựa trên orientation
            let width = img.width;
            let height = img.height;
            
            // Các trường hợp xoay 90° hoặc 270° cần đổi width và height
            if (orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8) {
              width = img.height;
              height = img.width;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Xoay và vẽ ảnh
            ctx.save();
            
            switch (orientation) {
              case 2:
                // Horizontal flip
                ctx.scale(-1, 1);
                ctx.drawImage(img, -img.width, 0);
                break;
              case 3:
                // 180° rotation
                ctx.translate(width, height);
                ctx.rotate(Math.PI);
                ctx.drawImage(img, 0, 0);
                break;
              case 4:
                // Vertical flip
                ctx.scale(1, -1);
                ctx.drawImage(img, 0, -img.height);
                break;
              case 5:
                // 90° clockwise + horizontal flip
                ctx.translate(width, 0);
                ctx.rotate(Math.PI / 2);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0);
                break;
              case 6:
                // 90° clockwise
                ctx.translate(width, 0);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(img, 0, 0);
                break;
              case 7:
                // 90° counter-clockwise + horizontal flip
                ctx.translate(0, height);
                ctx.rotate(-Math.PI / 2);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0);
                break;
              case 8:
                // 90° counter-clockwise
                ctx.translate(0, height);
                ctx.rotate(-Math.PI / 2);
                ctx.drawImage(img, 0, 0);
                break;
              default:
                // Orientation 1 - normal, không cần xoay
                ctx.drawImage(img, 0, 0);
                break;
            }
            
            ctx.restore();
            
            // Chuyển canvas thành data URL
            const fixedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            // Tạo File mới từ canvas đã xoay
            const fixedFile = dataURLtoFile(fixedDataUrl, file.name);
            resolve({ dataURL: fixedDataUrl, file: fixedFile });
          } catch (error) {
            // Nếu không đọc được EXIF, trả về ảnh gốc
            console.warn('Could not read EXIF data:', error);
            resolve({ dataURL: dataUrl, file: file });
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = dataUrl;
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
