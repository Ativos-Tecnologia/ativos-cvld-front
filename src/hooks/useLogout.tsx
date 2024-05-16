import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/constants';
import { useRouter } from 'next/navigation';
import UseMySwal from './useMySwal';

const clearAuthData = () => {
  localStorage.removeItem(`ATIVOS_${ACCESS_TOKEN}`)
  localStorage.removeItem(`ATIVOS_${REFRESH_TOKEN}`)
};

const useLogout = () => {
  const router = useRouter();
  const MySwal = UseMySwal();

  const logout = async () => {
    try {
      // await fetch('/api/logout', { method: 'POST' });

      clearAuthData();
      MySwal.fire({
        icon: 'success',
        title: 'Logout realizado com sucesso!',
        showConfirmButton: false,
        toast: true,
        timer: 2000,
        timerProgressBar: true,
        position: 'bottom-end',
      });
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);

    } catch (error) {
      console.error('Falha ao deslogar:', error);
    }
  };

  return logout;
};

export default useLogout;
