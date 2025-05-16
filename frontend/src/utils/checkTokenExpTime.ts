import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/auth/auth';

const checkTokenExpTime = (token: string): number | null => {
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    const expireTime = exp * 1000;
    const currentTime = Date.now();
    const delayForCheck = expireTime - currentTime;
    return delayForCheck > 0 ? delayForCheck : null;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
};

export default checkTokenExpTime;
