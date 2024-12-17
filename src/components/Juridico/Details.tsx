"use client";

import React, { useContext } from "react";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../Forms/CustomFormField";
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

type JuridicoDetailsProps = {
  id: string;
};

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

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
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="credor"
                  label="Nome do Credor"
                  defaultValue={data?.properties["Credor"].title[0].plain_text}
                  placeholder="John Doe"
                  iconSrc={<FaUser className="self-center" />}
                  iconAlt="user"
                  className="w-full "
                />
                <div className="w-full lg:w-56">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
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
                  fieldType={FormFieldType.INPUT}
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
                  fieldType={FormFieldType.INPUT}
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
                  fieldType={FormFieldType.INPUT}
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
