import { PaginatedResponse } from '@/components/TaskElements';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import api from '@/utils/api';

const useUpdateOficio = (data: PaginatedResponse<CVLDResultProps>, setData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>) => {

    const updateOficioStatus = async (id: string, status: statusOficio, page_id?: string) => {
        try {
            const response = await api.put(`/api/extrato/update/status/${id}/`, {
                status
            });

            // if (page_id) {

            //     const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            //         "Status": {
            //             "status": {
            //                 "name": `${status}`
            //             }
            //         }
            //     });
            //     if (resNotion.status !== 202) {
            //         console.log('houve um erro ao salvar os dados no notion');
            //     }
            // }

            const updatedData = data?.results.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: response.data.status
                    }
                }

                return item;
            });

            setData({
                ...data,
                results: updatedData
            });
        } catch (error) {
            console.error(error);
        }
    }

    const updateOficioTipo = async (id: string, tipo: tipoOficio, page_id?: string) => {
        try {
            const response = await api.put(`/api/extrato/update/tipo/${id}/`, {
                tipo_do_oficio: tipo
            });



            const updatedData = data?.results.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        tipo_do_oficio: response.data.tipo_do_oficio
                    }
                }

                return item;
            });

            setData({
                ...data,
                results: updatedData
            });

            // const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            //     "Tipo": {
            //         "select": {
            //             "name": `${tipo}`
            //         }
            //     },
            // });

            // if (resNotion.status !== 202) {
            //     console.log('houve um erro ao salvar os dados no notion');
            // }
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
