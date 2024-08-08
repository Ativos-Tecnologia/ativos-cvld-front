/*

  Este é um hook personalizado para filtrar a ExtratosTable.
  O hook consiste em duas funções: Uma que reseta os filtros
  e outra que faz os filtros mediante parâmetros passados.

  Ele depende de certas funções e estados que vem diretamente
  do ExtratosTable para funcionar, então é importante observar
  os parâmetros necessários para o funcionamento do mesmo antes
  de tentar aplicá-lo em algum outro lugar.

  Futuramente o hook será melhorado, abrangindo uma maior visão
  e dinamismo quanto ao seu funcionamento.

 */


'use client';
import { PaginatedResponse } from '@/components/TaskElements';
import statusOficio from '@/enums/statusOficio.enum';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import React from 'react';

interface IUseFilterProps extends PaginatedResponse<CVLDResultProps> {
  alreadyFiltered: boolean
}

export function useFilter(
  data: PaginatedResponse<CVLDResultProps>,
  setData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>,
  setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>>,
  setOficioSelectValue: React.Dispatch<React.SetStateAction<string | null>>,
  auxData: PaginatedResponse<CVLDResultProps>,
  statusSelectValue: statusOficio | null,
  oficioSelectValue: string | null
) {

  const resetFilters = () => {
    setData(auxData);
    setStatusSelectValue(null);
    setOficioSelectValue(null);
  }

  const filterData = (): void => {
   
    const conditions: any[] = [];

    if (oficioSelectValue !== null) {
      const filterParamOne = (item: any) => item.tipo_do_oficio === oficioSelectValue;
      conditions.push(filterParamOne);
    }

    if (statusSelectValue !== null) {
      const filterParamTwo = (item: any) => item.status === statusSelectValue;
      conditions.push(filterParamTwo);
    }

    const newData = auxData.results.filter((item: any) => conditions.every(condition => condition(item)));

    setData({
      ...data,
      count: newData.length,
      results: newData
    });

  }

  return {
    filterData,
    resetFilters
  }

}