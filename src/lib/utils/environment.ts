/**
 * ไฟล์สำหรับจัดการสภาพแวดล้อมและค่าคงที่ที่เกี่ยวข้อง
 */

/**
 * ประเภทของสภาพแวดล้อมที่รองรับ
 */
export type Environment = 'development' | 'preview' | 'production';

/**
 * เช็คว่าปัจจุบันอยู่ในสภาพแวดล้อมการพัฒนาหรือไม่
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * เช็คว่าปัจจุบันอยู่ในสภาพแวดล้อม preview หรือไม่
 */
export const isPreview = (): boolean => {
  return getEnvironment() === 'preview';
};

/**
 * เช็คว่าปัจจุบันอยู่ในสภาพแวดล้อมการผลิตหรือไม่
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * ดึงค่าสภาพแวดล้อมปัจจุบัน
 */
export const getEnvironment = (): Environment => {
  // ดึงค่าจาก environment variable
  const env = process.env.NEXT_PUBLIC_ENV;

  // ตรวจสอบว่าเป็นค่าที่ถูกต้องหรือไม่
  if (env === 'development' || env === 'preview' || env === 'production') {
    return env;
  }

  // ถ้าไม่มีค่า หรือค่าไม่ถูกต้อง ให้ใช้ค่าเริ่มต้นเป็น 'development'
  return 'development';
};

/**
 * ดึง URL ของ site ตามสภาพแวดล้อมปัจจุบัน
 */
export const getSiteUrl = (): string => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

/**
 * ดึง URL สำหรับการ redirect หลังจาก authentication
 */
export const getAuthRedirectUrl = (): string => {
  return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || `${getSiteUrl()}/auth/token`;
};
