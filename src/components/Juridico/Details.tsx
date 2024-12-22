"use client";

import React, { useContext, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { FaBuilding, FaBuildingColumns, FaUser } from "react-icons/fa6";
import { FaBalanceScale, FaIdCard, FaMapMarkedAlt } from "react-icons/fa";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import { CelerInputField } from "../CrmUi/InputFactory";
import { handleDesembolsoVsRentabilidade, handlePercentualDeGanhoVsRentabilidadeAnual } from "@/functions/juridico/solverDesembolsoVsRentabilidade";
import { SelectItem } from "../ui/select";
import { estados } from "@/constants/estados";
import { IoDocumentTextSharp } from "react-icons/io5";
import CelerInputFormField from "../Forms/CustomFormField";

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

  console.log(data)

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
                <CelerInputField
                    fieldType={InputFieldVariant.CHECKBOX}
                    name="estado_ente_devedor"
                    label="Honorários já destacados?"
                    defaultValue={data?.properties["Honorários já destacados?"].checkbox}
                    />
                    </div>
                <div className="w-full lg:w-56">
                  <CelerInputField
                    fieldType={InputFieldVariant.INPUT}
                    name="cpf_cnpj"
                    label={
                      data?.properties["CPF/CNPJ"]?.rich_text?.[0]
                        ?.plain_text &&
                      data.properties["CPF/CNPJ"].rich_text[0].plain_text
                        .length > 11
                      ? "CNPJ"
                      : "CPF"
                  }
                  defaultValue={data?.properties["CPF/CNPJ"]?.rich_text?.[0].plain_text}
                  iconSrc={<FaIdCard
                    className="self-center" />}
                  iconAlt="document"
                  className="w-full"
                  onSubmit={handleSubmit}
                />
              </div>
            </section>

            <section className="form-inputs-container" id="info_processo">
              <div className="col-span-1">
                <CelerInputField
                  name="npu_originario"
                  fieldType={InputFieldVariant.INPUT}
                  label="NPU (Originário)"
                  defaultValue={data?.properties["NPU (Originário)"]?.rich_text?.[0].plain_text}
                  iconSrc={<IoDocumentTextSharp className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="col-span-1">
                <CelerInputField
                  name="npu_precatorio"
                  fieldType={InputFieldVariant.INPUT}
                  label="NPU (Precatório)"
                  defaultValue={data?.properties["NPU (Precatório)"]?.rich_text?.[0].plain_text}
                  iconSrc={<IoDocumentTextSharp className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="col-span-1">
                <CelerInputField
                  name="juizo_vara"
                  fieldType={InputFieldVariant.INPUT}
                  label="Vara"
                  defaultValue={data?.properties["Juízo"]?.rich_text?.[0].plain_text}
                  iconSrc={<FaBuildingColumns className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="col-span-1">
                <CelerInputField
                  name="ente_devedor"
                  fieldType={InputFieldVariant.INPUT}
                  label="Ente Devedor"
                  defaultValue={data?.properties["Ente Devedor"].select?.name}
                  iconSrc={<FaBuilding className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="col-span-1">
                <CelerInputField
                  name="estado_ente_devedor"
                  fieldType={InputFieldVariant.SELECT}
                  label="Estado Ente Devedor"
                  defaultValue={data?.properties["Estado do Ente Devedor"].select?.name}
                  iconSrc={<FaMapMarkedAlt  className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  onValueChange={handleSubmit}
                >
                  {estados.map(estado => (
                    <SelectItem defaultChecked={
                      data?.properties["Estado do Ente Devedor"].select?.name === estado.id
                    } key={estado.id} value={estado.id}>{estado.nome}</SelectItem>
                  ))}
                </CelerInputField>
              </div>
            </section>

            <section className="form-inputs-container" id="info_valores">

            </section>
          </div>
        </form>
      </Form>
    </div>
  );
};
