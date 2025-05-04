import { supabase } from './client';

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * ตรวจสอบว่าอีเมลมีอยู่ในระบบแล้วหรือไม่
 * @param email อีเมลที่ต้องการตรวจสอบ
 * @returns {Promise<boolean>} true ถ้ามีอีเมลนี้ในระบบแล้ว, false ถ้าไม่มี
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // ใช้ SQL Function ที่เราสร้างไว้เพื่อตรวจสอบอีเมล
    const { data, error } = await supabase.rpc('check_email_exists', { email_to_check: email });
    
    if (error) {
      console.error('Error checking email:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking email existence:', error);
    // หากมีข้อผิดพลาด ให้สันนิษฐานว่าอีเมลไม่มีในระบบ (เพื่อความปลอดภัย)
    return false;
  }
};

export const signInWithEmail = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // ตรวจสอบว่าผู้ใช้ได้ยืนยันอีเมลแล้วหรือไม่
  if (data.user && !data.user.email_confirmed_at) {
    throw new Error('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');
  }

  return data;
};

export const signUpWithEmail = async ({ email, password }: SignUpCredentials) => {
  // ตรวจสอบอีเมลซ้ำก่อนสมัครสมาชิก
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error('อีเมลนี้มีการใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/token`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }

  return true;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/token?next=/reset-password`,
  });

  if (error) {
    throw error;
  }

  return true;
};

/**
 * ส่งอีเมลยืนยันอีกครั้ง
 * @param email อีเมลที่ต้องการส่งการยืนยันอีกครั้ง
 * @returns {Promise<boolean>} true ถ้าส่งสำเร็จ
 */
export const resendVerificationEmail = async (email: string): Promise<boolean> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/token`,
    }
  });

  if (error) {
    throw error;
  }
  
  return true;
};

/**
 * ตรวจสอบสถานะการยืนยันอีเมลของผู้ใช้
 * @returns {Promise<boolean>} true ถ้ายืนยันอีเมลแล้ว, false ถ้ายังไม่ยืนยัน
 */
export const isEmailVerified = async (): Promise<boolean> => {
  try {
    const user = await getUser();
    
    if (!user) {
      return false;
    }
    
    // ตรวจสอบสถานะการยืนยันอีเมล
    return !!user.email_confirmed_at;
  } catch (error) {
    console.error('Error checking email verification status:', error);
    return false;
  }
};

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw error;
  }

  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }

  return session;
};