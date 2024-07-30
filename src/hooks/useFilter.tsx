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
import { set } from 'date-fns';
import React, { useState } from 'react';

interface IUseFilterProps extends PaginatedResponse<CVLDResultProps> {
  alreadyFiltered: boolean
}

export function useFilter(
  data: PaginatedResponse<CVLDResultProps>,
  setData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>,
  setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>>,
  auxData: PaginatedResponse<CVLDResultProps>,
  statusSelectValue: string | null,
  oficioSelectValue: string | null
) {

  const [filterCount, setFilterCount] = useState<number>(0);
  const [oficiosFilter, setOficiosFilter] = useState<IUseFilterProps>({ results: [], count: 0, next: "", previous: "", alreadyFiltered: false });
  const [statusFilter, setStatusFilter] = useState<IUseFilterProps>({ results: [], count: 0, next: "", previous: "", alreadyFiltered: false });

  console.log(statusSelectValue, oficioSelectValue)
  console.log(oficiosFilter.alreadyFiltered, statusFilter.alreadyFiltered)

  const resetFilters = () => {
    setData(auxData);
    setStatusSelectValue(null);
    setOficiosFilter({ results: [], count: 0, next: "", previous: "", alreadyFiltered: false });
    setStatusFilter({ results: [], count: 0, next: "", previous: "", alreadyFiltered: false });
    setFilterCount(0);
  }

  const filterData = (type: string, value: string) => {

    /* primero caso: quando não há nenhuma condição de filtro */
    if (filterCount === 0) {

      const newData = auxData.results.filter((item: any) => item[type] === value);

      if (type === 'tipo_do_oficio') {
        setOficiosFilter({
          ...auxData,
          count: newData.length,
          results: newData,
          alreadyFiltered: true
        });
      } else {
        setStatusFilter({
          ...auxData,
          count: newData.length,
          results: newData,
          alreadyFiltered: true
        });
      }

      setData({
        ...data,
        count: newData.length,
        results: newData
      });
      setFilterCount(prev => prev + 1);

      return;
    }

    if (filterCount === 1) {

      if (type === 'tipo_do_oficio') {

        if (statusFilter.alreadyFiltered) {

          const newData = auxData.results.filter((item: any) => item[type] === value && item.status === statusSelectValue);

          setOficiosFilter({
            ...auxData,
            count: newData.length,
            results: newData,
            alreadyFiltered: true
          });

          setData({
            ...data,
            count: newData.length,
            results: newData
          })

        } else {

          const newData = auxData.results.filter((item: any) => item[type] === value);

          setOficiosFilter({
            ...auxData,
            count: newData.length,
            results: newData,
            alreadyFiltered: true
          });

          setData({
            ...data,
            count: newData.length,
            results: newData
          });

        }
        return;

      }

      if (type === 'status') {
        
        if (oficiosFilter.alreadyFiltered) {

          const newData = auxData.results.filter((item: any) => item[type] === value && item.tipo_do_oficio === oficioSelectValue);

          setStatusFilter({
            ...auxData,
            count: newData.length,
            results: newData,
            alreadyFiltered: true
          });

          setData({
            ...data,
            count: newData.length,
            results: newData
          })

        } else {
          
          const newData = auxData.results.filter((item: any) => item[type] === value);

          setStatusFilter({
            ...auxData,
            count: newData.length,
            results: newData,
            alreadyFiltered: true
          });

          setData({
            ...data,
            count: newData.length,
            results: newData
          });

        }
        return;

      }

      // if (oficiosFilter.alreadyFiltered) {

      //   const newData = auxData.results.filter((item: any) => item[type] === value);
      //   setOficiosFilter({
      //     ...auxData,
      //     count: newData.length,
      //     results: newData,
      //     alreadyFiltered: true
      //   });

      //   setData({
      //     ...data,
      //     count: newData.length,
      //     results: newData
      //   });

      //   return;

      // }

      // if (statusFilter.alreadyFiltered) {

      //   const newData = auxData.results.filter((item: any) => item[type] === value);
      //   setOficiosFilter({
      //     ...auxData,
      //     count: newData.length,
      //     results: newData,
      //     alreadyFiltered: true
      //   });

      //   setData({
      //     ...data,
      //     count: newData.length,
      //     results: newData
      //   });

      //   return;
      // }

    }

  }

  return {
    filterData,
    resetFilters
  }

}