"use client";

import React, { useContext, useRef, useState } from "react";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../Forms/CustomFormField";
import { useForm } from "react-hook-form";
import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { FaUser } from "react-icons/fa6";
import { FaBalanceScale, FaIdCard } from "react-icons/fa";
import {
  LiaBalanceScaleLeftSolid,
  LiaBalanceScaleRightSolid,
} from "react-icons/lia";
import { VscLaw } from "react-icons/vsc";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { Input } from "../ui/input";
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import { CelerInputField } from "../CrmUi/InputFactory";
import { handleDesembolsoVsRentabilidade, handlePercentualDeGanhoVsRentabilidadeAnual } from "@/functions/juridico/solverDesembolsoVsRentabilidade";
import { estados } from "@/constants/estados";
import { SelectItem } from "../ui/select";

type JuridicoDetailsProps = {
  id: string;
};

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);



    const handleSubmit = (name: string, value: any) => {
        console.log(name, value);
    }

  async function fetchData() {
    const response = await api.get(`/api/notion-api/list/page/${id}/`);
    return response.data;
  }

  const { data, isFetching, isLoading } = useQuery<NotionPage>({
    queryKey: ["page", id],
    refetchOnReconnect: true,
    refetchInterval: 60000,
    queryFn: fetchData,
  });

  const t = !isLoading && handleDesembolsoVsRentabilidade(0.3, data)
  const y = !isLoading && handlePercentualDeGanhoVsRentabilidadeAnual(0.653451365971927, data)

  console.log(data?.properties["Honorários já destacados?"].checkbox)
  const form = useForm();

  return (
    <div className="space-y-12">


      <div className="mb-4 flex w-full items-end justify-end gap-5 rounded-md">
        <Breadcrumb
          customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
          altIcon="Espaço de trabalho do time jurídico"
          pageName="Jurídico / Detalhes"
          title={`Olá, ${first_name}`}
        />
      </div>

      <Form {...form}>
        <form className="flex-1 ">
          <div className="space-y-6 rounded-md">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Teste</h2>
            </div>
            <section id="info_credor">
              <div className="form-inputs-container">

            

                {/* <CelerInputField onValueChange={handleSubmit} name="estado_ente_devedor" fieldType={InputFieldVariant.SELECT} label="Nome do Credor" defaultValue={data?.properties["Estado do Ente Devedor"].select?.name} iconSrc={<FaUser className="self-center" />} iconAlt="user" className="w-full">
                    {
                        estados.map((estado) => (
                            <SelectItem defaultChecked={
                                data?.properties["Estado do Ente Devedor"].select?.name === estado.id
                            } key={estado.id} value={estado.id}>{estado.nome}</SelectItem>
                        ))
                    }
                </CelerInputField> */}
                
                
                <CustomFormField
                    fieldType={InputFieldVariant.CHECKBOX}
                    control={form.control}
                    name="estado_ente_devedor"
                    label="Honorários já destacados?"
                    defaultValue={data?.properties["Honorários já destacados?"].checkbox}
                    />
                <div className="w-full lg:w-56">
                  <CustomFormField
                    fieldType={InputFieldVariant.INPUT}
                    control={form.control}
                    name="cpf_cnpj"
                    label={
                      data?.properties["CPF/CNPJ"]?.rich_text?.[0]
                        ?.plain_text &&
                      data.properties["CPF/CNPJ"].rich_text[0].plain_text
                        .length > 11
                        ? "CNPJ"
                        : "CPF"
                    }
                    defaultValue={
                      data?.properties["CPF/CNPJ"]?.rich_text?.[0].plain_text
                    }
                    iconSrc={<FaIdCard className="self-center" />}
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            <section className="form-inputs-container" id="info_processo">
              <div className="min-w-64">
                <CustomFormField
                  fieldType={InputFieldVariant.INPUT}
                  control={form.control}
                  name="npu_originario"
                  label="NPU (Originário)"
                  iconSrc={
                    <LiaBalanceScaleLeftSolid className="self-center text-xl" />
                  }
                  defaultValue={
                    data?.properties["NPU (Originário)"]?.rich_text?.[0]
                      .plain_text
                  }
                />
              </div>
              <div className="min-w-64">
                <CustomFormField
                  fieldType={InputFieldVariant.INPUT}
                  control={form.control}
                  name="npu_precatorio"
                  label="NPU (Precatório)"
                  iconSrc={
                    <LiaBalanceScaleRightSolid className="self-center text-xl" />
                  }
                  defaultValue={
                    data?.properties["NPU (Precatório)"]?.rich_text?.[0]
                      .plain_text
                  }
                />
              </div>
              <div className="w-full">
                <CustomFormField
                  fieldType={InputFieldVariant.INPUT}
                  control={form.control}
                  name="juizo_vara"
                  label="Vara"
                  iconSrc={<VscLaw />}
                  defaultValue={
                    data?.properties["Juízo"].rich_text?.[0].plain_text
                  }
                  className="w-full"
                />
              </div>
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
};
