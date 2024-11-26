import { Button } from '@/components/Button';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import PFdocsSkeleton from '@/components/Skeletons/PFdocsSkeleton';
import { BrokersContext } from '@/context/BrokersContext';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiCheck, BiTrash, BiX } from 'react-icons/bi';
import { FaFileDownload } from 'react-icons/fa';
import { toast } from 'sonner';

/*
  OBS: a prop que o componente recebe é somente usada para a requisição
  onde é fetcheado os dados do cedente cadastrado no ofício em questão
*/

const PFdocs = ({ cedenteId, idPrecatorio }: { cedenteId: string | null, idPrecatorio: string }) => {

  const {
    register,
    handleSubmit,
    setValue,
    control
  } = useForm();

  const { fetchDetailCardData, setDocModalInfo, setIsFetchAllowed } = useContext(BrokersContext)

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isFetchingDoc, setIsFetchingDoc] = useState<Record<string, boolean>>({
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false
  });
  const [tipoDoOficio, setTipoDoOficio] = useState<NotionPage | null>(null);
  const [isUnlinkingDoc, setIsUnlinkingDoc] = useState<Record<string, boolean>>({
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false,
    todos: false
  });

  // função para cadastrar o documento rg
  async function setDocument(id: string, data: FormData, documentType: string) {

    setIsFetchingDoc((old) => ({
      ...old,
      [documentType]: true
    }));

    setIsFetchAllowed(false);

    let type: string;

    // verificação do tipo do documento por conta de divergência de chaves no backend
    if (documentType === "comprovante_de_residencia") {
      type = "comp_res"
    } else {
      type = documentType;
    }

    try {

      const req = await api.patch(`/api/cedente/link/doc/pf/${id}/${type}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (req.status === 202) {
        toast.success("Documento vinculado com sucesso.", {
          classNames: {
            toast: "bg-white dark:bg-boxdark",
            title: "text-black-2 dark:text-white",
            actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
          },
          icon: <BiCheck className="text-lg fill-green-400" />,
          action: {
            label: "OK",
            onClick() {
              toast.dismiss();
            },
          }
        });
        await fetchCedenteData();
        await fetchDetailCardData(idPrecatorio);
      }

    } catch (error) {

      toast.error('Erro ao realizar cadastro', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });

    } finally {

      setIsFetchingDoc((old) => ({
        ...old,
        [documentType]: false
      }));
      setIsFetchAllowed(true);

    }

  };

  // função para setar o documento rg por meio do file input
  const handleDocument = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (file && cedenteInfo?.id !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append(documentType, file);
        await setDocument(cedenteInfo?.id as string, formData, documentType);
      };

      reader.readAsDataURL(file)
    }
  }

  // função que remove algum ou todos os documentos relacionados ao cedente
  const handleRemoveDocument = async (documentType: string) => {

    setIsUnlinkingDoc((old) => ({
      ...old,
      [documentType]: true
    }));
    setIsFetchAllowed(false);

    try {

      const req = await api.delete(`/api/cedente/unlink/doc/pf/${cedenteInfo?.id}/${documentType}/`);
      if (req.status === 204) {
        toast.success("Documento(s) desvinculado(s) com sucesso.", {
          classNames: {
            toast: "bg-white dark:bg-boxdark",
            title: "text-black-2 dark:text-white",
            actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
          },
          icon: <BiCheck className="text-lg fill-green-400" />,
          action: {
            label: "OK",
            onClick() {
              toast.dismiss();
            },
          }
        });
        await fetchCedenteData();
        await fetchDetailCardData(idPrecatorio);
      }

    } catch (error) {

      toast.error('Erro ao realizar operação', {
        classNames: {
          toast: "bg-white dark:bg-boxdark",
          title: "text-black-2 dark:text-white",
          actionButton: "bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-700 transition-colors duration-300"
        },
        icon: <BiX className="text-lg fill-red-500" />,
        action: {
          label: "OK",
          onClick() {
            toast.dismiss();
          },
        }
      });

    } finally {

      setIsUnlinkingDoc((old) => ({
        ...old,
        [documentType]: false
      }));
      setIsFetchAllowed(true);
      
    }

  }

  // função de submit só para que o hook form funcione (temporário)
  const submitDocument = async (data: any) => {
    console.log(data);
  };

  // função que faz fetch nos dados do cedente
  async function fetchCedenteData() {
    const req = await api.get(`/api/cedente/show/pf/${cedenteId}/`);
    if (req.data === null) return;
    setCedenteInfo(req.data);

    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }

  const fetchTipoDoOficio = async () => {
    const req = await fetchDetailCardData(idPrecatorio);
    setTipoDoOficio(req);
  }

  // preenche o estado do cedente com os dados do cadastrado no oficio
  useEffect(() => {
    fetchCedenteData();
    fetchTipoDoOficio();
  }, []);
  
  // preenche os valores dos inputs que já possuirem documento cadastrado
  useEffect(() => {
    if (cedenteInfo === null) return;
    setValue("rg", cedenteInfo.properties["Doc. RG"].url || "");
    setValue("certidao_nasc_cas", cedenteInfo.properties["Doc. Certidão Nascimento/Casamento"].url || "");
    setValue("comprovante_de_residencia", cedenteInfo?.properties["Doc. Comprovante de Residência"].url || "");
    setValue("oficio_requisitorio", cedenteInfo?.properties["Doc. Ofício Requisitório"].url || "");
  }, [cedenteInfo])

  return (
    <div className="overflow-y-auto overflow-x-hidden px-3 2xsm:max-h-[380px] xl:max-h-[480px]">
      <h2 className="mb-10 text-center text-2xl font-medium">
        Gestão de Documentos
      </h2>
      <div className="grid w-full grid-cols-2 gap-10">
        {/* doc div rg */}
        {(tipoDoOficio?.properties["Tipo"].select?.name === "PRECATÓRIO" ||
          tipoDoOficio?.properties["Tipo"].select?.name === "RPV") && (
          <div className="col-span-2 flex flex-col gap-3">
            <div className="col-span-2 flex flex-col 2xsm:gap-6 md:gap-3">
              <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
                <label className="min-w-[211px]" htmlFor="oficio_requisitorio">
                  Ofício Requisitório:
                </label>
                <input
                  type="text"
                  placeholder={
                    isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"
                  }
                  disabled={true}
                  {...register("oficio_requisitorio", { required: true })}
                  className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
                />
              </div>
              {isFirstLoad ? (
                <PFdocsSkeleton />
              ) : (
                <div className="flex 2xsm:flex-col 2xsm:items-start 2xsm:justify-center 2xsm:gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
                  <div className="flex items-center justify-between gap-3 2xsm:w-full md:w-fit md:flex-row">
                    <Button
                      variant="outlined"
                      className="flex items-center justify-center px-3 py-1"
                    >
                      <form onSubmit={handleSubmit(submitDocument)}>
                        <label
                          htmlFor="oficio_requisitorio"
                          className="cursor-pointer text-sm font-medium"
                        >
                          {cedenteInfo?.properties["Doc. Ofício Requisitório"]
                            .url
                            ? "Alterar Documento"
                            : "Selecionar Documento"}
                        </label>
                        <input
                          type="file"
                          id="oficio_requisitorio"
                          accept=".jpg, .jpeg, .png, .pdf"
                          className="sr-only"
                          onChange={(e) =>
                            handleDocument(e, "oficio_requisitorio")
                          }
                        />
                      </form>
                    </Button>
                    {isFetchingDoc.oficio_requisitorio && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full">
                        <AiOutlineLoading className="animate-spin" />
                      </div>
                    )}
                    {cedenteInfo?.properties["Doc. Ofício Requisitório"]
                      .url && (
                      <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                        <CRMTooltip
                          text="Baixar Ofício Requisitório"
                          placement="right"
                        >
                          <Link
                            href={
                              cedenteInfo.properties["Doc. Ofício Requisitório"]
                                .url || ""
                            }
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                          >
                            <FaFileDownload className="text-xl" />
                          </Link>
                        </CRMTooltip>

                        <CRMTooltip
                          text="Desvincular documento"
                          placement="right"
                        >
                          <Button
                            variant="ghost"
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                            onClick={() =>
                              handleRemoveDocument("oficio_requisitorio")
                            }
                          >
                            {isUnlinkingDoc.o ? (
                              <AiOutlineLoading className="animate-spin text-xl text-snow" />
                            ) : (
                              <BiTrash className="text-xl text-snow" />
                            )}
                          </Button>
                        </CRMTooltip>
                      </div>
                    )}
                  </div>
                  {cedenteInfo?.properties["Doc. Ofício Requisitório Status"]
                    ?.select?.name && (
                    <CRMTooltip text="Status do documento" placement="right">
                      <div
                        style={{
                          background: `${notionColorResolver(cedenteInfo?.properties["Doc. Ofício Requisitório Status"].select?.color || "")}`,
                        }}
                        className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                      >
                        {cedenteInfo?.properties[
                          "Doc. Ofício Requisitório Status"
                        ].select?.name || ""}
                      </div>
                    </CRMTooltip>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* doc div rg */}
        <div className="col-span-2 flex flex-col 2xsm:gap-6 md:gap-3">
          <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
            <label className="min-w-[211px]" htmlFor="rg">
              Identidade (RG):
            </label>
            <input
              type="text"
              placeholder={
                isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"
              }
              disabled={true}
              {...register("rg", { required: true })}
              className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className="flex 2xsm:flex-col 2xsm:items-start 2xsm:justify-center 2xsm:gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
              <div className="flex items-center justify-between gap-3 2xsm:w-full md:w-fit md:flex-row">
                <Button
                  variant="outlined"
                  className="flex items-center justify-center px-3 py-1"
                >
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label
                      htmlFor="rg"
                      className="cursor-pointer text-sm font-medium"
                    >
                      {cedenteInfo?.properties["Doc. RG"].url
                        ? "Alterar Documento"
                        : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id="rg"
                      accept=".jpg, .jpeg, .png, .pdf"
                      className="sr-only"
                      onChange={(e) => handleDocument(e, "rg")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.rg && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <AiOutlineLoading className="animate-spin" />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. RG"].url && (
                  <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                    <CRMTooltip text="Baixar RG" placement="right">
                      <Link
                        href={cedenteInfo.properties["Doc. RG"].url || ""}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                      >
                        <FaFileDownload className="text-xl" />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                        onClick={() => handleRemoveDocument("rg")}
                      >
                        {isUnlinkingDoc.rg ? (
                          <AiOutlineLoading className="animate-spin text-xl text-snow" />
                        ) : (
                          <BiTrash className="text-xl text-snow" />
                        )}
                      </Button>
                    </CRMTooltip>
                  </div>
                )}
              </div>
              {cedenteInfo?.properties["Doc. RG Status"]?.select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. RG Status"].select?.color || "")}`,
                    }}
                    className="mx-auto rounded-md px-3 py-1 text-sm font-medium text-black-2"
                  >
                    {cedenteInfo?.properties["Doc. RG Status"].select?.name ||
                      ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* doc div certidao */}
        <div className="col-span-2 flex flex-col 2xsm:gap-6 md:gap-3">
          <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
            <label className="min-w-[211px]" htmlFor="rg">
              Certidão Nasc/Casamento:
            </label>
            <input
              type="text"
              placeholder={
                isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"
              }
              disabled={true}
              {...register("certidao_nasc_cas", { required: true })}
              className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className="flex 2xsm:flex-col 2xsm:items-start 2xsm:justify-center 2xsm:gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
              <div className="flex items-center justify-between gap-3 2xsm:w-full md:w-fit md:flex-row">
                <Button
                  variant="outlined"
                  className="flex items-center justify-center px-3 py-1"
                >
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label
                      htmlFor="certidao_nasc_cas"
                      className="cursor-pointer text-sm font-medium"
                    >
                      {cedenteInfo?.properties[
                        "Doc. Certidão Nascimento/Casamento"
                      ].url
                        ? "Alterar Documento"
                        : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id="certidao_nasc_cas"
                      accept=".jpg, .jpeg, .png, .pdf"
                      className="sr-only"
                      onChange={(e) => handleDocument(e, "certidao_nasc_cas")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.certidao_nasc_cas && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <AiOutlineLoading className="animate-spin" />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"]
                  .url && (
                  <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                    <CRMTooltip text="Baixar Certidão" placement="right">
                      <Link
                        href={
                          cedenteInfo.properties[
                            "Doc. Certidão Nascimento/Casamento"
                          ].url || ""
                        }
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                      >
                        <FaFileDownload className="text-xl" />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                        onClick={() =>
                          handleRemoveDocument("certidao_nasc_cas")
                        }
                      >
                        {isUnlinkingDoc.certidao_nasc_cas ? (
                          <AiOutlineLoading className="animate-spin text-xl text-snow" />
                        ) : (
                          <BiTrash className="text-xl text-snow" />
                        )}
                      </Button>
                    </CRMTooltip>
                  </div>
                )}
              </div>
              {cedenteInfo?.properties[
                "Doc. Certidão Nascimento/Casamento Status"
              ].select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.color || "")}`,
                    }}
                    className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                  >
                    {cedenteInfo?.properties[
                      "Doc. Certidão Nascimento/Casamento Status"
                    ].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* doc div comprovante */}
        <div className="col-span-2 flex flex-col 2xsm:gap-6 md:gap-3">
          <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
            <label className="min-w-[211px]" htmlFor="rg">
              Comprovante de Residência:
            </label>
            <input
              type="text"
              placeholder={
                isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"
              }
              disabled={true}
              {...register("comprovante_de_residencia", { required: true })}
              className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className="flex 2xsm:flex-col 2xsm:items-start 2xsm:justify-center 2xsm:gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
              <div className="flex items-center justify-between gap-3 2xsm:w-full md:w-fit md:flex-row">
                <Button
                  variant="outlined"
                  className="flex items-center justify-center px-3 py-1"
                >
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label
                      htmlFor="comprovante_de_residencia"
                      className="cursor-pointer text-sm font-medium"
                    >
                      {cedenteInfo?.properties["Doc. Comprovante de Residência"]
                        .url
                        ? "Alterar Documento"
                        : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id="comprovante_de_residencia"
                      accept=".jpg, .jpeg, .png, .pdf"
                      className="sr-only"
                      onChange={(e) =>
                        handleDocument(e, "comprovante_de_residencia")
                      }
                    />
                  </form>
                </Button>
                {isFetchingDoc.comprovante_de_residencia && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <AiOutlineLoading className="animate-spin" />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Comprovante de Residência"]
                  .url && (
                  <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                    <CRMTooltip text="Baixar Comprovante" placement="right">
                      <Link
                        href={
                          cedenteInfo.properties[
                            "Doc. Comprovante de Residência"
                          ].url || ""
                        }
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                      >
                        <FaFileDownload className="text-xl" />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                        onClick={() =>
                          handleRemoveDocument("comprovante_de_residencia")
                        }
                      >
                        {isUnlinkingDoc.comprovante_de_residencia ? (
                          <AiOutlineLoading className="animate-spin text-xl text-snow" />
                        ) : (
                          <BiTrash className="text-xl text-snow" />
                        )}
                      </Button>
                    </CRMTooltip>
                  </div>
                )}
              </div>
              {cedenteInfo?.properties["Doc. Comprovante de Residência Status"]
                .select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. Comprovante de Residência Status"].select?.color || "")}`,
                    }}
                    className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                  >
                    {cedenteInfo?.properties[
                      "Doc. Comprovante de Residência Status"
                    ].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* botão que desvincula todos os documentos */}
        {(cedenteInfo?.properties["Doc. Ofício Requisitório"].url ||
          cedenteInfo?.properties["Doc. RG"].url ||
          cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url ||
          cedenteInfo?.properties["Doc. Comprovante de Residência"].url) && (
          <fieldset className="col-span-2 flex items-center justify-center gap-5 border-t border-stroke py-3 dark:border-form-strokedark">
            <legend className="px-2 text-xs uppercase">Outras opções</legend>

            <Button
              onClick={() => setDocModalInfo(null)}
              className="bg-green-500 hover:bg-green-600"
            >
              OK
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleRemoveDocument("todos")}
            >
              {isUnlinkingDoc.todos
                ? "Desvinculando documentos..."
                : "Desvincular todos os documentos"}
            </Button>
          </fieldset>
        )}
      </div>
    </div>
  );
}

export default PFdocs
