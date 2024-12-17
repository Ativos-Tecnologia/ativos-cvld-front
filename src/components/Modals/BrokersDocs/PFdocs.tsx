import { Button } from '@/components/Button';
import CardDocs from '@/components/CrmUi/Cards/CardDocs';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import Badge from '@/components/CrmUi/ui/Badge/Badge';
import PFdocsSkeleton from '@/components/Skeletons/PFdocsSkeleton';
import { BrokersContext } from '@/context/BrokersContext';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading, AiOutlineSwap } from 'react-icons/ai';
import { BiCheck, BiLink, BiTrash, BiUnlink, BiX } from 'react-icons/bi';
import { FaFileDownload } from 'react-icons/fa';
import { LuClipboardCheck, LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';
import DocVisualizer from './ShowDocs';
import CardDocsSkeleton from '@/components/Skeletons/CardDocsSkeleton';

/*
  OBS: a prop que o componente recebe é somente usada para a requisição
  onde é fetcheado os dados do cedente cadastrado no ofício em questão
*/

const PFdocs = ({ cedenteId, idPrecatorio, tipoDoOficio }: { cedenteId: string | null, idPrecatorio: string, tipoDoOficio: string }) => {

  const {
    register,
    handleSubmit,
    setValue,
    control
  } = useForm();

  const { fetchDetailCardData, setDocModalInfo, setIsFetchAllowed } = useContext(BrokersContext)

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [showDoc, setShowDoc] = useState<boolean>(false);
  const [docUrl, setDocUrl] = useState<string>("");
  const [linkCopied, setLinkCopied] = useState<string>("");
  const [isFetchingDoc, setIsFetchingDoc] = useState<Record<string, boolean>>({
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false
  });
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

  /**
   * função que seta a url que irá ser usada no modal
   * de exibição do documento
   * 
   * @param {string} url - caminho do documento
   * @returns {void}
   */
  const handleShowDoc = (url: string): void => {
    setShowDoc(true);
    setDocUrl(url)
  }

  /**
   * Função que fecha o modal de exibição do documento
   * 
   * @returns {void}
   */
  const handleCloseDoc = (): void => {
    setShowDoc(false);
    setDocUrl("");
  }

  /**
   * Copia o link do documento
   * 
   * @param {string} link - O link a ser copiado
   * @returns {void} - retorno da função 
   */
  const handleCopyLink = (link: string, docType: string): void => {
    navigator.clipboard.writeText(link);
    setLinkCopied(docType);

    setTimeout(() => setLinkCopied(""), 2000);
  };

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



  // preenche o estado do cedente com os dados do cadastrado no oficio
  useEffect(() => {
    fetchCedenteData();
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
    <div className="overflow-y-auto overflow-x-hidden px-3 2xsm:max-h-[85vh] xl:max-h-[480px] 3xl:max-h-[750px]">
      <h2 className="mb-10 text-center text-2xl font-medium">
        Gestão de Documentos
      </h2>
      <div className="grid w-full grid-cols-2 3xl:grid-cols-3 gap-5 mb-5">

        {isFirstLoad ? (
          <>
            {[...Array(4)].map((_, index: number) => (
              <CardDocsSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {/* doc div oficio requisitório */}
            {(tipoDoOficio === "PRECATÓRIO" ||
              tipoDoOficio === "RPV") && (
                <CardDocs>
                  <CardDocs.Header>Ofício Requisitório</CardDocs.Header>
                  <CardDocs.Body>
                    <CardDocs.DocPreviewWrapper>

                      <CardDocs.Preview
                        onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. Ofício Requisitório"].url || "")}
                        url={cedenteInfo?.properties["Doc. Ofício Requisitório"].url || ""}
                      />

                      {cedenteInfo?.properties["Doc. Ofício Requisitório"].url ? (
                        <Badge
                          color={cedenteInfo?.properties["Doc. Ofício Requisitório Status"].select?.color || ""}
                          isANotionPage={true}
                          className='w-[165px] mx-auto text-sm capitalize'
                        >
                          {cedenteInfo?.properties[
                            "Doc. Ofício Requisitório Status"
                          ].select?.name || ""}
                        </Badge>
                      ) : (
                        <p className='text-sm text-center'>Nenhum documento vinculado</p>
                      )}
                    </CardDocs.DocPreviewWrapper>
                    <CardDocs.Actions>
                      {/* Select / Change document */}
                      <Button
                        isLoading={isFetchingDoc.oficio_requisitorio}
                        className="w-full md:max-w-44 lg:max-w-48 xl:w-full px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                      >
                        <form onSubmit={handleSubmit(submitDocument)}>
                          <label
                            htmlFor="oficio_requisitorio"
                            className="cursor-pointer text-sm flex items-center gap-2"
                          >
                            {cedenteInfo?.properties["Doc. Ofício Requisitório"].url ? (
                              <>
                                <AiOutlineSwap />
                                <span>Alterar Documento</span>
                              </>
                            ) : (
                              <>
                                <BiLink />
                                <span>Selecionar Doc.</span>
                              </>
                            )}
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

                      {cedenteInfo?.properties["Doc. Ofício Requisitório"].url && (
                        <>
                          {/* download button */}
                          < Link
                            href={
                              cedenteInfo.properties["Doc. Ofício Requisitório"].url || ""}
                            className="w-full md:max-w-44 lg:max-w-48 xl:w-full flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                          >
                            <FaFileDownload />
                            <span>Baixar Documento</span>
                          </Link>

                          {/* copy link button */}
                          <Button
                            onClick={() => handleCopyLink(cedenteInfo?.properties["Doc. Ofício Requisitório"].url || "", "oficio_requisitorio")}
                            className={`w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "oficio_requisitorio" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
                            {linkCopied === "oficio_requisitorio" ? (
                              <>
                                <LuClipboardCheck />
                                <p>Link Copiado!</p>
                              </>
                            ) : (
                              <>
                                <LuCopy />
                                <p>Copiar Link</p>
                              </>
                            )}
                          </Button>

                          {/* unlink button */}
                          <Button
                            isLoading={isUnlinkingDoc.oficio_requisitorio}
                            variant='danger'
                            className='w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm px-3 h-7'
                            onClick={() => handleRemoveDocument("oficio_requisitorio")}
                          >
                            <BiUnlink className="text-xl text-snow" />
                            <span>Desvincular</span>
                          </Button>
                        </>
                      )}

                    </CardDocs.Actions>
                  </CardDocs.Body>
                </CardDocs>
              )}

            {/* doc div rg */}
            <CardDocs>
              <CardDocs.Header>Identidade (RG)</CardDocs.Header>
              <CardDocs.Body>
                <CardDocs.DocPreviewWrapper>
                  <CardDocs.Preview
                    onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. RG"].url || "")}
                    url={cedenteInfo?.properties["Doc. RG"].url || ""}
                  />

                  {cedenteInfo?.properties["Doc. RG"].url ? (
                    <Badge
                      color={cedenteInfo?.properties["Doc. RG Status"].select?.color || ""}
                      isANotionPage={true}
                      className='w-[165px] mx-auto text-sm capitalize'
                    >
                      {cedenteInfo?.properties[
                        "Doc. RG Status"
                      ].select?.name || ""}
                    </Badge>
                  ) : (
                    <p className='text-sm text-center'>Nenhum documento vinculado</p>
                  )}
                </CardDocs.DocPreviewWrapper>
                <CardDocs.Actions>
                  {/* Select / Change document */}
                  <Button
                    isLoading={isFetchingDoc.rg}
                    className="w-full md:max-w-44 lg:max-w-48 xl:w-full px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                  >
                    <form onSubmit={handleSubmit(submitDocument)}>
                      <label
                        htmlFor="rg"
                        className="cursor-pointer text-sm flex items-center gap-2"
                      >
                        {cedenteInfo?.properties["Doc. RG"].url ? (
                          <>
                            <AiOutlineSwap />
                            <span>Alterar Documento</span>
                          </>
                        ) : (
                          <>
                            <BiLink />
                            <span>Selecionar Doc.</span>
                          </>
                        )}
                      </label>
                      <input
                        type="file"
                        id="rg"
                        accept=".jpg, .jpeg, .png, .pdf"
                        className="sr-only"
                        onChange={(e) =>
                          handleDocument(e, "rg")
                        }
                      />
                    </form>
                  </Button>

                  {cedenteInfo?.properties["Doc. RG"].url && (
                    <>
                      {/* download button */}
                      < Link
                        href={
                          cedenteInfo.properties["Doc. RG"].url || ""}
                        className="w-full md:max-w-44 lg:max-w-48 xl:w-full flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                      >
                        <FaFileDownload />
                        <span>Baixar Documento</span>
                      </Link>

                      {/* copy link button */}
                      <Button
                        onClick={() => handleCopyLink(cedenteInfo?.properties["Doc. RG"].url || "", "rg")}
                        className={`w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "rg" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
                        {linkCopied === "rg" ? (
                          <>
                            <LuClipboardCheck />
                            <p>Link Copiado!</p>
                          </>
                        ) : (
                          <>
                            <LuCopy />
                            <p>Copiar Link</p>
                          </>
                        )}
                      </Button>

                      {/* unlink button */}
                      <Button
                        isLoading={isUnlinkingDoc.rg}
                        variant="danger"
                        className='w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm px-3 h-7'
                        onClick={() => handleRemoveDocument("rg")}
                      >
                        <BiUnlink className="text-xl text-snow" />
                        <span>Desvincular</span>
                      </Button>
                    </>
                  )}
                </CardDocs.Actions>
              </CardDocs.Body>
            </CardDocs>

            {/* doc div certidao */}
            <CardDocs>
              <CardDocs.Header>Certidão Nasc/Casamento</CardDocs.Header>
              <CardDocs.Body>
                <CardDocs.DocPreviewWrapper>
                  <CardDocs.Preview
                    onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url || "")}
                    url={cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                  />

                  {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url ? (
                    <Badge
                      color={cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.color || ""}
                      isANotionPage={true}
                      className='w-[165px] mx-auto text-sm capitalize'
                    >
                      {cedenteInfo?.properties[
                        "Doc. Certidão Nascimento/Casamento Status"
                      ].select?.name || ""}
                    </Badge>
                  ) : (
                    <p className='text-sm text-center'>Nenhum documento vinculado</p>
                  )}
                </CardDocs.DocPreviewWrapper>
                <CardDocs.Actions>
                  {/* Select / Change document */}
                  <Button
                    isLoading={isFetchingDoc.certidao_nasc_cas}
                    className="w-full md:max-w-44 lg:max-w-48 xl:w-full px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                  >
                    <form onSubmit={handleSubmit(submitDocument)}>
                      <label
                        htmlFor="certidao_nasc_cas"
                        className="cursor-pointer text-sm flex items-center gap-2"
                      >
                        {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url ? (
                          <>
                            <AiOutlineSwap />
                            <span>Alterar Documento</span>
                          </>
                        ) : (
                          <>
                            <BiLink />
                            <span>Selecionar Doc.</span>
                          </>
                        )}
                      </label>
                      <input
                        type="file"
                        id="certidao_nasc_cas"
                        accept=".jpg, .jpeg, .png, .pdf"
                        className="sr-only"
                        onChange={(e) =>
                          handleDocument(e, "certidao_nasc_cas")
                        }
                      />
                    </form>
                  </Button>

                  {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url && (
                    <>
                      {/* download button */}
                      < Link
                        href={
                          cedenteInfo.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                        className="w-full md:max-w-44 lg:max-w-48 xl:w-full flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                      >
                        <FaFileDownload />
                        <span>Baixar Documento</span>
                      </Link>

                      {/* copy link button */}
                      <Button
                        onClick={() => handleCopyLink(cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url || "", "certidao_nasc_cas")}
                        className={`w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "certidao_nasc_cas" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
                        {linkCopied === "certidao_nasc_cas" ? (
                          <>
                            <LuClipboardCheck />
                            <p>Link Copiado!</p>
                          </>
                        ) : (
                          <>
                            <LuCopy />
                            <p>Copiar Link</p>
                          </>
                        )}
                      </Button>

                      {/* unlink button */}
                      <Button
                        isLoading={isUnlinkingDoc.certidao_nasc_cas}
                        className='w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm px-3 h-7'
                        variant="danger"
                        onClick={() => handleRemoveDocument("certidao_nasc_cas")}
                      >
                        <BiUnlink className="text-xl text-snow" />
                        <span>Desvincular</span>
                      </Button>
                    </>
                  )}
                </CardDocs.Actions>
              </CardDocs.Body>
            </CardDocs>

            {/* doc div comprovante */}
            <CardDocs>
              <CardDocs.Header>Comprovante de Residência</CardDocs.Header>
              <CardDocs.Body>
                <CardDocs.DocPreviewWrapper>
                  <CardDocs.Preview
                    onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. Comprovante de Residência"].url || "")}
                    url={cedenteInfo?.properties["Doc. Comprovante de Residência"].url || ""}
                  />

                  {cedenteInfo?.properties["Doc. Comprovante de Residência"].url ? (
                    <Badge
                      color={cedenteInfo?.properties["Doc. Comprovante de Residência Status"].select?.color || ""}
                      isANotionPage={true}
                      className='w-[165px] mx-auto text-sm capitalize'
                    >
                      {cedenteInfo?.properties[
                        "Doc. Comprovante de Residência Status"
                      ].select?.name || ""}
                    </Badge>
                  ) : (
                    <p className='text-sm text-center'>Nenhum documento vinculado</p>
                  )}
                </CardDocs.DocPreviewWrapper>
                <CardDocs.Actions>
                  {/* Select / Change document */}
                  <Button
                    isLoading={isFetchingDoc.comprovante_de_residencia}
                    className="w-full md:max-w-44 lg:max-w-48 xl:w-full px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                  >
                    <form onSubmit={handleSubmit(submitDocument)}>
                      <label
                        htmlFor="comprovante_de_residencia"
                        className="cursor-pointer text-sm flex items-center gap-2"
                      >
                        {cedenteInfo?.properties["Doc. Comprovante de Residência"].url ? (
                          <>
                            <AiOutlineSwap />
                            <span>Alterar Documento</span>
                          </>
                        ) : (
                          <>
                            <BiLink />
                            <span>Selecionar Doc.</span>
                          </>
                        )}
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

                  {cedenteInfo?.properties["Doc. Comprovante de Residência"].url && (
                    <>
                      {/* download button */}
                      < Link
                        href={
                          cedenteInfo.properties["Doc. Comprovante de Residência"].url || ""}
                        className="w-full md:max-w-44 lg:max-w-48 xl:w-full flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                      >
                        <FaFileDownload />
                        <span>Baixar Documento</span>
                      </Link>

                      {/* copy link button */}
                      <Button
                        onClick={() => handleCopyLink(cedenteInfo?.properties["Doc. Comprovante de Residência"].url || "", "comprovante_de_residencia")}
                        className={`w-full md:max-w-44 lg:max-w-48 xl:w-full text-body dark:text-bodydark text-sm px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "comprovante_de_residencia" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
                        {linkCopied === "comprovante_de_residencia" ? (
                          <>
                            <LuClipboardCheck />
                            <p>Link Copiado!</p>
                          </>
                        ) : (
                          <>
                            <LuCopy />
                            <p>Copiar Link</p>
                          </>
                        )}
                      </Button>

                      {/* unlink button */}
                      <Button
                        isLoading={isUnlinkingDoc.comprovante_de_residencia}
                        className='w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm px-3 h-7'
                        variant='danger'
                        onClick={() => handleRemoveDocument("comprovante_de_residencia")}
                      >
                        <BiUnlink className="text-xl text-snow" />
                        <span>Desvincular</span>
                      </Button>
                    </>
                  )}
                </CardDocs.Actions>
              </CardDocs.Body>
            </CardDocs>
          </>
        )}

      </div>

      {/* botão que desvincula todos os documentos */}
      {(cedenteInfo?.properties["Doc. Ofício Requisitório"].url ||
        cedenteInfo?.properties["Doc. RG"].url ||
        cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url ||
        cedenteInfo?.properties["Doc. Comprovante de Residência"].url) && (
          <div className='col-span-2 bg-white dark:bg-boxdark-2 p-3 shadow-6 rounded-md'>
            <fieldset className="flex items-center justify-center gap-5 border-t border-stroke py-3 dark:border-form-strokedark 2xsm:flex-col 2xsm:gap-3 md:flex-row">
              <legend className="px-2 text-xs uppercase">Outras opções</legend>

              <Button
                className='2xsm:w-full md:w-fit'
                onClick={() => setDocModalInfo(null)}
              >
                Fechar
              </Button>

              <Button
                variant="outlined"
                onClick={() => handleRemoveDocument("todos")}
                className='2xsm:text-[15px] 2xsm:p-2 2xsm:w-full md:w-fit md:text-base md:px-4'
              >
                {isUnlinkingDoc.todos
                  ? "Desvinculando documentos..."
                  : "Desvincular todos os documentos"}
              </Button>
            </fieldset>
          </div>
        )}

      {showDoc &&
        <DocVisualizer
          isOpen={showDoc}
          onClose={handleCloseDoc}
          src={docUrl}
        />
      }

    </div >
  );
}

export default PFdocs
