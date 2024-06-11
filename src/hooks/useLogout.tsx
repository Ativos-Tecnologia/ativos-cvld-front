import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/constants';
import { useRouter } from 'next/navigation';
import UseMySwal from './useMySwal';
import api from '@/utils/api';

const clearAuthData = () => {
  localStorage.removeItem(`ATIVOS_${ACCESS_TOKEN}`)
  localStorage.removeItem(`ATIVOS_${REFRESH_TOKEN}`)
};

const useLogout = () => {
  const router = useRouter();
  const MySwal = UseMySwal();

  const logout = async () => {
    try {
      const response = await api.post('/api/token/logout/', {
        refresh: localStorage.getItem(`ATIVOS_${REFRESH_TOKEN}`),
      });

      if (response.status === 205) {

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

      } else {

        MySwal.fire({
          icon: 'error',
          title: 'Houve algum problem ao tentar o logout!',
          showConfirmButton: false,
          toast: true,
          timer: 2000,
          timerProgressBar: true,
          position: 'bottom-end',
        });

      }

    } catch (error) {
      console.error('Falha ao deslogar:', error);
    }

  };

  return logout;
};

export default useLogout;
