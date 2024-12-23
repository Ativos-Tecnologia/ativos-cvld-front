"use client";

import React, { useContext, useEffect, useState } from "react";
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
import LifeCycleStep from "../LifeCycleStep";
import { tribunais } from "@/constants/tribunais";
import numberFormat from "@/functions/formaters/numberFormat";
import Link from "next/link";
import { GrDocumentText } from "react-icons/gr";
import { BiSolidSave } from "react-icons/bi";
import { Button } from "../Button";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import UseMySwal from "@/hooks/useMySwal";
import { AxiosError } from "axios";

type JuridicoDetailsProps = {
  id: string;
};

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

  const [formData, setFormData] = useState<any>(null);

  const swal = UseMySwal()

  const handleSubmit = (name: string, value: any) => {
    console.log(name, value);
  }

  const onSubmitForm = async (data: any) => {

    if (data.valor_aquisicao_total) {
      data.percentual_a_ser_adquirido = 1;
    } else {
      data.percentual_a_ser_adquirido = data.percentual_a_ser_adquirido / 100;
    }

    if (typeof data.valor_principal === "string") {
      data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
      data.valor_principal = parseFloat(data.valor_principal);
    }

    if (typeof data.valor_juros === "string") {
      data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
      data.valor_juros = parseFloat(data.valor_juros);
    }

    if (data.data_base) {
      data.data_base = data.data_base.split("/").reverse().join("-");
    }

    if (data.data_requisicao) {
      data.data_requisicao = data.data_requisicao.split("/").reverse().join("-");
    }

    if (data.data_limite_de_atualizacao) {
      data.data_limite_de_atualizacao = data.data_limite_de_atualizacao.split("/").reverse().join("-");
    }

    if (typeof data.valor_pss) {
      data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
      data.valor_pss = parseFloat(data.valor_pss);
    }

    if (!data.ir_incidente_rra) {
      data.numero_de_meses = 0
    }

    if (!data.incidencia_pss) {
      data.valor_pss = 0
    }

    if (!data.data_limite_de_atualizacao_check) {
      delete data.data_limite_de_atualizacao_check
    }

    console.log(data)

    try {
      const response = await api.patch(`/api/juridico/update/precatorio/${id}/`, data);

      swal.fire({
        title: 'Sucesso',
        text: 'Dados atualizados com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error: AxiosError | any) {
      swal.fire({
        title: 'Erro',
        text: `${error.response?.data?.detail || error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
      console.log(error)
    }

  }

  async function fetchData() {
    const response = await api.get(`/api/notion-api/list/page/${id}/`);
    return response.data;
  }

  const { data, isFetching, isLoading } = useQuery<NotionPage>({
    queryKey: ["page", id],
    refetchOnWindowFocus: false,
    // refetchOnReconnect: true,
    // refetchInterval: 60000,
    queryFn: fetchData,
  });

  const t = !isLoading && handleDesembolsoVsRentabilidade(0.3, data)
  const y = !isLoading && handlePercentualDeGanhoVsRentabilidadeAnual(0.653451365971927, data)

  const form = useForm();
  const isFormModified = Object.keys(form.watch()).some((key: any) => form.watch()[key] !== formData?.[key]);

  console.log(data)

  useEffect(() => {
    if (data) {
      form.setValue("tipo_do_oficio", data?.properties["Tipo"].select?.name || "PRECATÓRIO");
      form.setValue("natureza", data?.properties["Natureza"].select?.name || "NÃO TRIBUTÁRIA");
      form.setValue("esfera", data?.properties["Esfera"].select?.name || "FEDERAL");
      form.setValue("regime", data?.properties["Regime"].select?.name || "GERAL");
      form.setValue("tribunal", data?.properties["Tribunal"].select?.name || "STJ");
      form.setValue("valor_principal", numberFormat(data?.properties["Valor Principal"].number || 0));
      form.setValue("valor_juros", numberFormat(data?.properties["Valor Juros"].number || 0));
      form.setValue("data_base", data?.properties["Data Base"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("data_requisicao", data?.properties["Data do Recebimento"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("valor_aquisicao_total", data?.properties["Percentual a ser adquirido"].number === 1);
      form.setValue("ja_possui_destacamento", data?.properties["Honorários já destacados?"].checkbox);
      form.setValue("percentual_de_honorarios", data?.properties["Percentual de Honorários Não destacados"].number! * 100 || 0);
      form.setValue("incidencia_juros_moratorios", data?.properties["Incidência de Juros Moratórios"].checkbox);
      form.setValue("nao_incide_selic_no_periodo_db_ate_abril", data?.properties["Incide Selic Somente Sobre Principal"].checkbox);
      form.setValue("incidencia_rra_ir", data?.properties["Incidencia RRA/IR"].checkbox);
      form.setValue("ir_incidente_rra", data?.properties["IR Incidente sobre RRA"].checkbox);
      form.setValue("numero_de_meses", data?.properties["Meses RRA"].number || 0);
      form.setValue("incidencia_pss", data?.properties["Meses RRA"].number || 0);
      form.setValue("incidencia_pss", data?.properties["PSS"].number! > 0);
      form.setValue("valor_pss", data?.properties["PSS"].number || 0);
      console.log("atualizando valores")
      setFormData(form.watch);
    }
  }, [data])

  return (
    <div className="flex flex-col w-full gap-5">


      <div className="flex w-full items-end justify-end rounded-md">
        <Breadcrumb
          customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
          altIcon="Espaço de trabalho do time jurídico"
          pageName="Jurídico / Detalhes"
          title={`Olá, ${first_name}`}
        />
      </div>
      <LifeCycleStep status={data?.properties["Status Diligência"].select?.name ?? "ops"} />

      <Form {...form}>
        <div className="space-y-6 rounded-md">
          <section id="info_credor" className="form-inputs-container">
            <div className="col-span-1 w-full">
              <CelerInputField
                name="credor"
                fieldType={InputFieldVariant.INPUT}
                label="Nome do Credor"
                defaultValue={data?.properties["Credor"].title[0].plain_text}
                iconSrc={<FaUser
                  className="self-center" />}
                iconAlt="user"
                className="w-full"
                onSubmit={handleSubmit}
              />
            </div>

            <div className="col-span-1 w-full">
              <CelerInputField
                name="cpf_cnpj"
                fieldType={InputFieldVariant.INPUT}
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
                iconSrc={<FaMapMarkedAlt className="self-center" />}
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

          <section id="info_valores" className="p-4 rounded-md bg-white dark:bg-boxdark">
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-4 3xl:grid-cols-5 gap-6">
                {/* tipo */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="tipo_do_oficio"
                    label="Tipo"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Tipo"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="PRECATÓRIO">PRECATÓRIO</SelectItem>
                    <SelectItem value="CREDITÓRIO">CREDITÓRIO</SelectItem>
                    <SelectItem value="R.P.V.">R.P.V.</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* natureza */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="natureza"
                    label="Natureza"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Natureza"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="NÃO TRIBUTÁRIA">NÃO TRIBUTÁRIA</SelectItem>
                    <SelectItem value="TRIBUTÁRIA">TRIBUTÁRIA</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* esfera */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="esfera"
                    label="Esfera"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Esfera"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="FEDERAL">FEDERAL</SelectItem>
                    <SelectItem value="ESTADUAL">ESTADUAL</SelectItem>
                    <SelectItem value="MUNICIPAL">MUNICIPAL</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* regime */}
                {form.watch("esfera") !== "FEDERAL" && (
                  <div className="col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="regime"
                      label="Regime"
                      fieldType={InputFieldVariant.SELECT}
                      defaultValue={data?.properties["Regime"].select?.name ?? ""}
                      className="w-full"
                    >
                      <SelectItem value="GERAL">GERAL</SelectItem>
                      <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                    </CelerInputFormField>
                  </div>
                )}
                {/* tribunal */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="tribunal"
                    label="Tribunal"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Tribunal"].select?.name ?? ""}
                    className="w-full"
                  >
                    {tribunais.map(tribunal => (
                      <SelectItem key={tribunal.id} value={tribunal.id}>{tribunal.nome}</SelectItem>
                    ))}
                  </CelerInputFormField>
                </div>
                {/* valor principal */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="valor_principal"
                    label="Valor Principal"
                    fieldType={InputFieldVariant.NUMBER}
                    currencyFormat="R$ "
                    defaultValue={data?.properties["Valor Principal"].number ?? 0}
                    className="w-full"
                  />
                </div>
                {/* valor juros */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="valor_juros"
                    label="Juros"
                    fieldType={InputFieldVariant.NUMBER}
                    currencyFormat="R$ "
                    defaultValue={data?.properties["Valor Juros"].number ?? 0}
                    className="w-full"
                  />
                </div>
                {/* data base */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="data_base"
                    label="Data Base"
                    fieldType={InputFieldVariant.DATE}
                    defaultValue={data?.properties["Data Base"].date?.start ?? ""}
                    className="w-full"
                  />
                </div>
                {/* data requisição */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="data_requisicao"
                    label="Data Requisição"
                    fieldType={InputFieldVariant.DATE}
                    defaultValue={data?.properties["Data do Recebimento"].date?.start ?? ""}
                    className="w-full"
                  />
                </div>
              </div>

              <hr className="border border-stroke dark:border-strokedark mt-6" />

              <div className="w-1/2 grid grid-cols-2 gap-6 mt-6">
                {/* percentual adquirido */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="valor_aquisicao_total"
                    label="Aquisição Total"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                </div>
                {form.watch("valor_aquisicao_total") === false ? (
                  <div className="col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="percentual_a_ser_adquirido"
                      label="Percentual de Aquisição (%)"
                      fieldType={InputFieldVariant.NUMBER}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="col-span-1">&nbsp;</div>
                )}

                {/* destacamento de honorários */}
                <div className="col-span-2 flex gap-6">
                  <CelerInputFormField
                    control={form.control}
                    name="ja_possui_destacamento"
                    label="Já Possui Destacamento de Honorários?"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                  {form.watch("ja_possui_destacamento") === false ? (
                    <div className="col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="percentual_de_honorarios"
                        label="Percentual"
                        fieldType={InputFieldVariant.NUMBER}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    null
                  )}
                </div>

                {/* juros moratórios */}
                <div className={`col-span-2 ${form.watch("data_base") && form.watch("data_base").split("/").reverse().join("-") < "2021-12-01" && form.watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                  <CelerInputFormField
                    control={form.control}
                    name="incidencia_juros_moratorios"
                    label="Juros de Mora Fixados em Sentença"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                </div>

                {/* incide selic */}
                <div className={`col-span-2 ${form.watch("data_base") && form.watch("data_base").split("/").reverse().join("-") > "2021-12-01" && form.watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                  <CelerInputFormField
                    control={form.control}
                    name="nao_incide_selic_no_periodo_db_ate_abril"
                    label="SELIC Somente Sobre o Principal"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                </div>

                {/* incidência IR */}
                <div className="col-span-2">
                  <CelerInputFormField
                    control={form.control}
                    name="incidencia_rra_ir"
                    label="Incidência de IR"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                </div>

                {/* Incidência de IR sobre RRA */}
                {form.watch("natureza") !== "TRIBUTÁRIA" && form.watch("incidencia_rra_ir") === true ? (
                  <>
                    <div className="col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="ir_incidente_rra"
                        label="IR Incidente sobre RRA?"
                        fieldType={InputFieldVariant.CHECKBOX}
                        className="w-full"
                      />
                    </div>
                    {form.watch("ir_incidente_rra") === true ? (
                      <div className="col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="numero_de_meses"
                          label="Número de Meses"
                          fieldType={InputFieldVariant.INPUT}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="col-span-1">&nbsp;</div>
                    )}
                  </>
                ) : (
                  null
                )}

                {/* incidência de PSS */}
                {form.watch("natureza") !== "TRIBUTÁRIA" && (
                  <>
                    <div className="col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="incidencia_pss"
                        label="Incide PSS?"
                        fieldType={InputFieldVariant.CHECKBOX}
                        className="w-full"
                      />
                    </div>
                    {form.watch("incidencia_pss") === true ? (
                      <div className="col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="valor_pss"
                          label="Valor PSS"
                          fieldType={InputFieldVariant.NUMBER}
                          currencyFormat={"R$ "}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="col-span-1">&nbsp;</div>
                    )}
                  </>
                )}

                {/* data limite de atualização */}
                <div className="col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="data_limite_de_atualizacao_check"
                    label="Atualiza Para Data Passada?"
                    fieldType={InputFieldVariant.CHECKBOX}
                    className="w-full"
                  />
                </div>

                {form.watch("data_limite_de_atualizacao_check") === true ? (
                  <div className="col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="data_limite_de_atualizacao"
                      label="Atualizado Até:"
                      fieldType={InputFieldVariant.DATE}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="col-span-1">&nbsp;</div>
                )}

                {(form.watch("data_limite_de_atualizacao") && form.watch("data_limite_de_atualizacao").split("/").reverse().join("-") < form.watch("data_requisicao").split("/").reverse().join("-")) && (
                  <span className="text-red-500 dark:text-red-400 text-xs col-span-2">
                    Data de atualização não pode ser menor que a data da requisição
                  </span>
                )}

              </div>

              <hr className="border border-stroke dark:border-strokedark mt-6" />

              <div className="flex items-center justify-center gap-6 mt-6">

                <Button
                  type="submit"
                  variant="success"
                  disabled={!isFormModified}
                  className="py-2 px-4 rounded-md flex items-center gap-3 disabled:opacity-50 disabled:hover:bg-green-500 uppercase text-sm"
                >
                  <BiSolidSave className="h-4 w-4" />
                  <span>Salvar Alterações</span>
                </Button>

                {data?.properties["Memória de Cálculo Ordinário"].url && (
                  <Link
                    href={data?.properties["Memória de Cálculo Ordinário"].url}
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 rounded-md flex items-center gap-3 transition-colors duration-300 uppercase text-sm"
                  >
                    <GrDocumentText className="h-4 w-4" />
                    <span>Memória de Cálculo Simples</span>
                  </Link>
                )}

                {data?.properties["Memória de Cálculo RRA"].url && (
                  <Link
                    href={data?.properties["Memória de Cálculo RRA"].url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 rounded-md flex items-center gap-3 transition-colors duration-300 uppercase text-sm"
                  >
                    <GrDocumentText className="h-4 w-4" />
                    <span>Memória de Cálculo RRA</span>
                  </Link>
                )}
              </div>

            </form>
          </section>
        </div>
      </Form>
    </div>
  );
};
