"use client";

import React, { useContext } from "react";
import DataStats from "../DataStats/DataStats";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { FaBalanceScale } from "react-icons/fa";
import { UserInfoAPIContext, UserInfoContextType } from "@/context/UserInfoContext";
import { Button } from "../Button";

enum navItems {
    TODOS = "Todos",
    DUE_DILIGENCE = "Due Diligence",
    PROPOSTA_ACEITA = "Proposta aceita",
    NEGOCIACAO_EM_ANDAMENTO = "Negociação em andamento",
    EM_LIQUIDACAO = "Em liquidação",
}

const Juridico = () => {


    const { data: { first_name } } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        title: `Item ${i}`
      }));

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full items-end justify-end gap-5 rounded-md">
        <Breadcrumb customIcon={<FaBalanceScale className="w-[32px] h-[32px]"/>} altIcon="Espaço de trabalho do time jurídico" pageName="Jurídico" title={`Olá, ${first_name}`} />
      </div>
      <div className="mt-2 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        <DataStats />
      </div>
        <div className="flex gap-5 item-center bg-white dark:bg-boxdark my-4 p-5 rounded-md">
            {
                Object.values(navItems).map((item, index) => (
                    <Button size="sm" key={index} variant="secondary" onClick={() => console.log(item)}>
                        {item}
                    </Button>
                ))
            }
        </div>
      <ul className="my-5 grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
        {mockData.map((item) => (
          <li key={item.id} className={`mb-4 h-65 max-w-full cursor-pointer font-nexa xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4 opacity-50 hover:cursor-not-allowed bg-white dark:bg-boxdark p-5 rounded-md`}>

            <p className="font-semibold text-lg">{item.title}</p>
          </li>
        ))}
        </ul>        
    </div>
  );
};

export default Juridico;
