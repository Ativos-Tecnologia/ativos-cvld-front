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
import { FaImage } from 'react-icons/fa6';
import { toast } from 'sonner';
import DocVisualizer from './ShowDocs';

/*
  OBS: a prop que o componente recebe é somente usada para a requisição
  onde é fetcheado os dados do cedente cadastrado no ofício em questão
*/

const PJdocs = ({ cedenteId, idPrecatorio, tipoDoOficio }: {
  cedenteId: string | null,
  idPrecatorio: string,
  tipoDoOficio: string
}) => {

  const {
    register,
    handleSubmit,
    setValue,
    control
  } = useForm();

  const { fetchDetailCardData, setIsFetchAllowed,
    setDocModalInfo
  } = useContext(BrokersContext)

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [showDoc, setShowDoc] = useState<boolean>(false);
  const [docUrl, setDocUrl] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isFetchingDoc, setIsFetchingDoc] = useState<Record<string, boolean>>({
    contrato_social: false,
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false,
  });
  const [isUnlinkingDoc, setIsUnlinkingDoc] = useState<Record<string, boolean>>({
    contrato_social: false,
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false,
    todos: false
  });
  const [representanteState, setRepresentanteState] = useState<{ data: NotionPage | null, isFetching: boolean }>({
    data: null,
    isFetching: true
  });

  // função para cadastrar o documento rg
  async function setDocument(id: string, data: FormData, documentType: string, from: string) {

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

      const req = from === "cedente" ?
        await api.patch(`/api/cedente/link/doc/pj/${id}/${type}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }) :
        await api.patch(`/api/cedente/link/doc/pf/${id}/${type}/`, data, {
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

  // função que remove algum ou todos os documentos relacionados ao cedente
  const handleRemoveDocument = async (documentType: string, from?: string) => {

    setIsUnlinkingDoc((old) => ({
      ...old,
      [documentType]: true
    }));

    setIsFetchAllowed(false);

    try {

      const req = from === "cedente" ?
        await api.delete(`/api/cedente/unlink/doc/pj/${cedenteInfo?.id}/${documentType}/`) :
        await api.delete(`/api/cedente/unlink/doc/pf/${representanteState.data?.id}/${documentType}/`);

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

  // função para setar o documento rg por meio do file input
  const handleDocument = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string, from: string) => {
    const file = e.target.files?.[0];
    if (file && cedenteInfo?.id !== null && representanteState.data?.id !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append(documentType, file);
        if (from === "cedente") {
          await setDocument(cedenteInfo?.id as string, formData, documentType, from);
        } else {
          await setDocument(representanteState.data?.id as string, formData, documentType, from);
        }
      };

      reader.readAsDataURL(file)
    }
  }

  /**
   * Seta a url que irá ser usada no modal
   * de exibição do documento e abre o modal
   * 
   * @param {string} url - caminho do documento
   * @returns {void}
   */
  const handleShowDoc = (url: string): void => {
    setShowDoc(true);
    setDocUrl(url)
  }

  /**
   * fecha o modal de exibição do documento
   * 
   * @returns {void}
   */
  const handleCloseDoc = (): void => {
    setShowDoc(false);
    setDocUrl("");
  }

  /**
   * função que puxa os dados do representante legal (se vinculado)
   * 
   * @param {string} id - id do representante legal
   * @returns {Promise<void>}
   */
  const fetchRepresentante = async (id: string): Promise<void> => {

    setRepresentanteState(prev => (
      {
        ...prev,
        isFetching: true
      }
    ))

    const req = await api.get(`/api/cedente/show/pf/${id}/`);

    // if (req.data === null) return

    setRepresentanteState({
      data: req.data,
      isFetching: false
    });

  }

  // função de submit só para que o hook form funcione (temporário)
  const submitDocument = async (data: any) => {
    console.log(data);
  };

  // função que faz fetch nos dados do cedente
  async function fetchCedenteData() {
    const req = await api.get(`/api/cedente/show/pj/${cedenteId}/`);
    if (req.data === null) return;
    setCedenteInfo(req.data);

    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }

  // preenche o estado do cedente com os dados do cadastrado no oficio
  useEffect(() => {
    fetchCedenteData();
  }, []);

  // preenche os valores dos inputs que já possuirem documento cadastrado
  useEffect(() => {
    if (cedenteInfo === null) return;

    setValue("contrato_social", cedenteInfo.properties["Doc. Contrato Social"].url || "");

    if (cedenteInfo.properties["Sócio Representante"].relation?.[0]) {
      fetchRepresentante(cedenteInfo.properties["Sócio Representante"].relation[0].id);
    } else {
      setRepresentanteState(prev => ({
        ...prev,
        isFetching: false
      }))
    }

  }, [cedenteInfo]);

  // preenche os valores dos input que possuírem um doc do representante
  // cadastrado
  useEffect(() => {
    if (representanteState.data === null) return;

    setValue("rg", representanteState.data?.properties["Doc. RG"].url || "");
    setValue("certidao_nasc_cas", representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url || "");
    setValue("comprovante_de_residencia", representanteState.data?.properties["Doc. Comprovante de Residência"].url || "");
    setValue("oficio_requisitorio", representanteState.data?.properties["Doc. Ofício Requisitório"].url || "");

  }, [representanteState.data])

  return (
    <div className="overflow-y-auto overflow-x-hidden 2xsm:max-h-[380px] xl:max-h-[480px] pr-3">
      <h2 className="mb-10 text-center text-2xl font-medium">
        Gestão de documentos
      </h2>
      <div className="grid w-full grid-cols-2 gap-10">
        {/* ====> área do cedente <==== */}
        <fieldset className='col-span-2 border border-stroke dark:border-form-strokedark rounded-md p-3'>
          <legend className='px-2 bg-white dark:bg-boxdark ml-3 text-black-2 dark:text-white'>
            Documentação do cedente
          </legend>
          {/* doc div contrato social */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
              <label className="min-w-[211px]" htmlFor="rg">
                Contrato Social:
              </label>
              <input
                type="text"
                placeholder={
                  isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"
                }
                disabled={true}
                {...register("contrato_social", { required: true })}
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
                        htmlFor="contrato_social"
                        className="cursor-pointer text-sm font-medium"
                      >
                        {cedenteInfo?.properties["Doc. Contrato Social"].url
                          ? "Alterar Documento"
                          : "Selecionar Documento"}
                      </label>
                      <input
                        type="file"
                        id="contrato_social"
                        accept=".jpg, .jpeg, .png, .pdf"
                        className="sr-only"
                        onChange={(e) => handleDocument(e, "contrato_social", "cedente")}
                      />
                    </form>
                  </Button>
                  {isFetchingDoc.contrato_social && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full">
                      <AiOutlineLoading className="animate-spin" />
                    </div>
                  )}
                  {cedenteInfo?.properties["Doc. Contrato Social"].url && (
                    <div className="flex 2xsm:flex-row 2xsm:gap-3 md:flex-none">
                      <CRMTooltip text="Baixar Contrato Social" placement="right">
                        <Link
                          href={
                            cedenteInfo.properties["Doc. Contrato Social"].url ||
                            ""
                          }
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                        >
                          <FaFileDownload className="text-xl" />
                        </Link>
                      </CRMTooltip>

                      {!cedenteInfo?.properties["Doc. Contrato Social"].url.toLowerCase().includes(".pdf") && (
                        <CRMTooltip text="Visualizar Documento" placement="right">
                          <Button
                            variant='ghost'
                            className='w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'
                            onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. Contrato Social"].url || "")}
                          >
                            <FaImage className='text-xl' />
                          </Button>
                        </CRMTooltip>
                      )}

                      <CRMTooltip text="Desvincular documento" placement="right">
                        <Button
                          variant="danger"
                          className="flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors duration-300"
                          onClick={() => handleRemoveDocument("contrato_social", "cedente")}
                        >
                          {isUnlinkingDoc.contrato_social ? (
                            <AiOutlineLoading className="animate-spin text-xl text-snow" />
                          ) : (
                            <BiTrash className="text-xl text-snow" />
                          )}
                        </Button>
                      </CRMTooltip>
                    </div>
                  )}
                </div>
                {cedenteInfo?.properties["Doc. Contrato Social Status"]?.select
                  ?.name && (
                    <CRMTooltip text="Status do documento" placement="left">
                      <div
                        style={{
                          background: `${notionColorResolver(cedenteInfo?.properties["Doc. Contrato Social Status"].select?.color || "")}`,
                        }}
                        className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                      >
                        {cedenteInfo?.properties["Doc. Contrato Social Status"]
                          .select?.name || ""}
                      </div>
                    </CRMTooltip>
                  )}
              </div>
            )}
          </div>
        </fieldset>
        {/* ====> fim da área do cedente <==== */}

        {/* ====> área do representante legal <==== */}
        <fieldset className='col-span-2 border border-stroke dark:border-form-strokedark rounded-md p-3 grid gap-10'>
          <legend className='px-2 bg-white dark:bg-boxdark ml-3 text-black-2 dark:text-white'>
            Documentação do Representante
          </legend>

          {representanteState.data === null && !representanteState.isFetching ? (
            <p className='text-center text-sm'>Não há representante vinculado a esse cedente.</p>
          ) : (
            <>
              {(tipoDoOficio === "PRECATÓRIO" || tipoDoOficio === "RPV") && (
                <>
                  {/* ====> ofício requisitório <==== */}
                  <div className="flex flex-col gap-3">
                    <div className="col-span-2 flex flex-col 2xsm:gap-6 md:gap-3">
                      <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
                        <label className="min-w-[211px]" htmlFor="oficio_requisitorio">
                          Ofício Requisitório:
                        </label>
                        <input
                          type="text"
                          placeholder={
                            representanteState.isFetching ? "Carregando..." : "Nenhum documento vinculado"
                          }
                          disabled={true}
                          {...register("oficio_requisitorio", { required: true })}
                          className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
                        />
                      </div>
                      {representanteState.isFetching ? (
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
                                  {representanteState.data?.properties["Doc. Ofício Requisitório"]
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
                                    handleDocument(e, "oficio_requisitorio", "representante")
                                  }
                                />
                              </form>
                            </Button>
                            {isFetchingDoc.oficio_requisitorio && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full">
                                <AiOutlineLoading className="animate-spin" />
                              </div>
                            )}
                            {representanteState.data?.properties["Doc. Ofício Requisitório"]
                              .url && (
                                <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                                  <CRMTooltip
                                    text="Baixar Ofício Requisitório"
                                    placement="right"
                                  >
                                    <Link
                                      href={
                                        representanteState.data.properties["Doc. Ofício Requisitório"]
                                          .url || ""
                                      }
                                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                                    >
                                      <FaFileDownload className="text-xl" />
                                    </Link>
                                  </CRMTooltip>

                                  {!representanteState.data.properties["Doc. Ofício Requisitório"].url.toLowerCase().includes(".pdf") && (
                                    <CRMTooltip text="Visualizar Documento" placement="right">
                                      <Button
                                        variant='ghost'
                                        className='w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'
                                        onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Ofício Requisitório"].url || "")}
                                      >
                                        <FaImage className='text-xl' />
                                      </Button>
                                    </CRMTooltip>
                                  )}


                                  <CRMTooltip
                                    text="Desvincular documento"
                                    placement="right"
                                  >
                                    <Button
                                      variant="ghost"
                                      className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                                      onClick={() =>
                                        handleRemoveDocument("oficio_requisitorio", "representante")
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
                          {representanteState.data?.properties["Doc. Ofício Requisitório Status"]
                            ?.select?.name && (
                              <CRMTooltip text="Status do documento" placement="right">
                                <div
                                  style={{
                                    background: `${notionColorResolver(representanteState.data?.properties["Doc. Ofício Requisitório Status"].select?.color || "")}`,
                                  }}
                                  className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                                >
                                  {representanteState.data?.properties[
                                    "Doc. Ofício Requisitório Status"
                                  ].select?.name || ""}
                                </div>
                              </CRMTooltip>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ====> rg <==== */}
              <div className="flex flex-col 2xsm:gap-6 md:gap-3">
                <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
                  <label className="min-w-[211px]" htmlFor="rg">
                    Identidade (RG):
                  </label>
                  <input
                    type="text"
                    placeholder={
                      representanteState.isFetching ? "Carregando..." : "Nenhum documento vinculado"
                    }
                    disabled={true}
                    {...register("rg", { required: true })}
                    className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
                  />
                </div>
                {representanteState.isFetching ? (
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
                            {representanteState.data?.properties["Doc. RG"].url
                              ? "Alterar Documento"
                              : "Selecionar Documento"}
                          </label>
                          <input
                            type="file"
                            id="rg"
                            accept=".jpg, .jpeg, .png, .pdf"
                            className="sr-only"
                            onChange={(e) => handleDocument(e, "rg", "representante")}
                          />
                        </form>
                      </Button>
                      {isFetchingDoc.rg && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <AiOutlineLoading className="animate-spin" />
                        </div>
                      )}
                      {representanteState.data?.properties["Doc. RG"].url && (
                        <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                          <CRMTooltip text="Baixar RG" placement="right">
                            <Link
                              href={representanteState.data?.properties["Doc. RG"].url || ""}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                            >
                              <FaFileDownload className="text-xl" />
                            </Link>
                          </CRMTooltip>

                          {!representanteState.data?.properties["Doc. RG"].url.toLowerCase().includes(".pdf") && (
                            <CRMTooltip text="Visualizar Documento" placement="right">
                              <Button
                                variant='ghost'
                                className='w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'
                                onClick={() => handleShowDoc(representanteState.data?.properties["Doc. RG"].url || "")}
                              >
                                <FaImage className='text-xl' />
                              </Button>
                            </CRMTooltip>
                          )}


                          <CRMTooltip text="Desvincular documento" placement="right">
                            <Button
                              variant="ghost"
                              className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                              onClick={() => handleRemoveDocument("rg", "representante")}
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
                    {representanteState.data?.properties["Doc. RG Status"]?.select?.name && (
                      <CRMTooltip text="Status do documento" placement="right">
                        <div
                          style={{
                            background: `${notionColorResolver(representanteState.data?.properties["Doc. RG Status"].select?.color || "")}`,
                          }}
                          className="mx-auto rounded-md px-3 py-1 text-sm font-medium text-black-2"
                        >
                          {representanteState.data?.properties["Doc. RG Status"].select?.name ||
                            ""}
                        </div>
                      </CRMTooltip>
                    )}
                  </div>
                )}
              </div>

              {/* ====> doc certidão <===== */}
              <div className="flex flex-col 2xsm:gap-6 md:gap-3">
                <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
                  <label className="min-w-[211px]" htmlFor="rg">
                    Certidão Nasc/Casamento:
                  </label>
                  <input
                    type="text"
                    placeholder={
                      representanteState.isFetching ? "Carregando..." : "Nenhum documento vinculado"
                    }
                    disabled={true}
                    {...register("certidao_nasc_cas", { required: true })}
                    className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
                  />
                </div>
                {representanteState.isFetching ? (
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
                            {representanteState.data?.properties[
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
                            onChange={(e) => handleDocument(e, "certidao_nasc_cas", "representante")}
                          />
                        </form>
                      </Button>
                      {isFetchingDoc.certidao_nasc_cas && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <AiOutlineLoading className="animate-spin" />
                        </div>
                      )}
                      {representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"]
                        .url && (
                          <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                            <CRMTooltip text="Baixar Certidão" placement="right">
                              <Link
                                href={
                                  representanteState.data.properties[
                                    "Doc. Certidão Nascimento/Casamento"
                                  ].url || ""
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                              >
                                <FaFileDownload className="text-xl" />
                              </Link>
                            </CRMTooltip>

                            {!representanteState.data.properties["Doc. Certidão Nascimento/Casamento"].url.toLowerCase().includes(".pdf") && (
                              <CRMTooltip text="Visualizar Documento" placement="right">
                                <Button
                                  variant='ghost'
                                  className='w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'
                                  onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url || "")}
                                >
                                  <FaImage className='text-xl' />
                                </Button>
                              </CRMTooltip>
                            )}


                            <CRMTooltip text="Desvincular documento" placement="right">
                              <Button
                                variant="ghost"
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                                onClick={() =>
                                  handleRemoveDocument("certidao_nasc_cas", "representante")
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
                    {representanteState.data?.properties[
                      "Doc. Certidão Nascimento/Casamento Status"
                    ].select?.name && (
                        <CRMTooltip text="Status do documento" placement="right">
                          <div
                            style={{
                              background: `${notionColorResolver(representanteState.data?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.color || "")}`,
                            }}
                            className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                          >
                            {representanteState.data?.properties[
                              "Doc. Certidão Nascimento/Casamento Status"
                            ].select?.name || ""}
                          </div>
                        </CRMTooltip>
                      )}
                  </div>
                )}
              </div>

              {/* ====> doc comprovante <==== */}
              <div className="flex flex-col 2xsm:gap-6 md:gap-3">
                <div className="flex justify-center 2xsm:flex-col 2xsm:items-start 2xsm:gap-1 lg:flex-row lg:items-center lg:gap-3">
                  <label className="min-w-[211px]" htmlFor="rg">
                    Comprovante de Residência:
                  </label>
                  <input
                    type="text"
                    placeholder={
                      representanteState.isFetching ? "Carregando..." : "Nenhum documento vinculado"
                    }
                    disabled={true}
                    {...register("comprovante_de_residencia", { required: true })}
                    className="w-full flex-1 border-b border-l-0 border-r-0 border-t-0 bg-transparent py-1 outline-none placeholder:italic focus:border-primary focus-visible:shadow-none focus-visible:!ring-0"
                  />
                </div>
                {representanteState.isFetching ? (
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
                            {representanteState.data?.properties["Doc. Comprovante de Residência"]
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
                              handleDocument(e, "comprovante_de_residencia", "representante")
                            }
                          />
                        </form>
                      </Button>
                      {isFetchingDoc.comprovante_de_residencia && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <AiOutlineLoading className="animate-spin" />
                        </div>
                      )}
                      {representanteState.data?.properties["Doc. Comprovante de Residência"]
                        .url && (
                          <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                            <CRMTooltip text="Baixar Comprovante" placement="right">
                              <Link
                                href={
                                  representanteState.data.properties[
                                    "Doc. Comprovante de Residência"
                                  ].url || ""
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-200 transition-colors duration-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                              >
                                <FaFileDownload className="text-xl" />
                              </Link>
                            </CRMTooltip>

                            {!representanteState.data.properties["Doc. Comprovante de Residência"].url.toLowerCase().includes(".pdf") && (
                              <CRMTooltip text="Visualizar Documento" placement="right">
                                <Button
                                  variant='ghost'
                                  className='w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'
                                  onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Comprovante de Residência"].url || "")}
                                >
                                  <FaImage className='text-xl' />
                                </Button>
                              </CRMTooltip>
                            )}


                            <CRMTooltip text="Desvincular documento" placement="right">
                              <Button
                                variant="ghost"
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                                onClick={() =>
                                  handleRemoveDocument("comprovante_de_residencia", "representante")
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
                    {representanteState.data?.properties["Doc. Comprovante de Residência Status"]
                      .select?.name && (
                        <CRMTooltip text="Status do documento" placement="right">
                          <div
                            style={{
                              background: `${notionColorResolver(representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.color || "")}`,
                            }}
                            className="rounded-md px-3 py-1 text-sm font-medium text-black-2"
                          >
                            {representanteState.data?.properties[
                              "Doc. Comprovante de Residência Status"
                            ].select?.name || ""}
                          </div>
                        </CRMTooltip>
                      )}
                  </div>
                )}
              </div>
            </>
          )}
        </fieldset>
        {/* ====> fim da área do representante legal <==== */}


        <Button
          onClick={() => setDocModalInfo(null)}
          className="bg-green-500 hover:bg-green-600 col-span-2 mx-auto"
        >
          OK
        </Button>

      </div>

      {showDoc &&
        <DocVisualizer
          isOpen={showDoc}
          onClose={handleCloseDoc}
          src={docUrl}
        />
      }

    </div>
  );
}

export default PJdocs;
