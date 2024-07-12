import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import api from '@/utils/api';

const useUpdateOficio = (data:any, setData: React.Dispatch<React.SetStateAction<any[]>>) => {

    const updateOficioStatus = async (id: string, status: statusOficio) => {
        try {
            const response = await api.put(`/api/extrato/update/status/${id}/`, {
                status
            });

            const updatedData = data.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: response.data.status
                    }
                }

                return item;
            });

            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    }

    const updateOficioTipo = async (id: string, tipo: tipoOficio) => {
        try {
            const response = await api.put(`/api/extrato/update/tipo/${id}/`, {
                tipo_do_oficio: tipo
            });

            const updatedData = data.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        tipo_do_oficio: response.data.tipo_do_oficio
                    }
                }

                return item;
            });

            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    }

    return {
        updateOficioStatus,
        updateOficioTipo
    }

}

export default useUpdateOficio;
