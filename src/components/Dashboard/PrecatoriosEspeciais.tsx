"use client"
import React from 'react'
import LOASynthesisChart from '../Charts/LOASynthesisChart'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'

const PrecatoriosEspeciais = () => {

    const { data: synthesisData, isLoading, refetch: refetchSysthesisData } = useQuery({
        queryKey: ['treeMapData'],
        queryFn: async () => {
            const response = await api.post(`api/precatorios-especiais/extrair-sintese-loas/`);

            return response.data
        },
        refetchOnWindowFocus: false,
    })

    return (
        <>
            <div className="grid grid-cols-12 bg-white rounded-md dark:bg-boxdark">
                <LOASynthesisChart data={synthesisData?.results} />
            </div>
        </>
    )
}

export default PrecatoriosEspeciais