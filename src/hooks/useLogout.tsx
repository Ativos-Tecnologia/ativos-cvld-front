import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/constants';
import { useRouter } from 'next/navigation';

const clearAuthData = () => {
  localStorage.removeItem(`ATIVOS_${ACCESS_TOKEN}`)
  localStorage.removeItem(`ATIVOS_${REFRESH_TOKEN}`)
};

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // await fetch('/api/logout', { method: 'POST' });

      clearAuthData();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Falha ao deslogar:', error);
    }
  };

  return logout;
};

export default useLogout;
