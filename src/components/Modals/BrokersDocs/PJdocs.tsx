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
import { AiOutlineLoading, AiOutlineSwap } from 'react-icons/ai';
import { BiCheck, BiLink, BiTrash, BiUnlink, BiX } from 'react-icons/bi';
import { FaFileDownload } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa6';
import { toast } from 'sonner';
import DocVisualizer from './ShowDocs';
import CardDocs from '@/components/CrmUi/Cards/CardDocs';
import Badge from '@/components/CrmUi/ui/Badge/Badge';
import { LuClipboardCheck, LuCopy } from 'react-icons/lu';
import CardDocsSkeleton from '@/components/Skeletons/CardDocsSkeleton';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import { CelerInputField } from '@/components/CrmUi/InputFactory';
import { InputFieldVariant } from '@/enums/inputFieldVariants.enum';
import { SelectItem } from '@/components/ui/select';
import { Item } from '@radix-ui/react-select';
import { DocStatus } from '@/enums/docStatus.enum';
import { useMutation } from '@tanstack/react-query';
import UseMySwal from '@/hooks/useMySwal';

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

  const {
      data: { role },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

  console.log(role);

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [showDoc, setShowDoc] = useState<boolean>(false);
  const [docUrl, setDocUrl] = useState<string>("");
  const [linkCopied, setLinkCopied] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isFetchingDoc, setIsFetchingDoc] = useState<Record<string, boolean>>({
    contrato_social: false,
    oficio_requisitorio: false,
    rg: false,
    certidao_nasc_cas: false,
    comprovante_de_residencia: false,
  });

  const [loadingUpdateState, setLoadingUpdateState] = useState({
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

  const [editLock, setEditLock] = useState<boolean>(false);
  const swal = UseMySwal()
  
  

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

  const DocStatusMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Doc. Contrato Social Status": {
          "select": {
            "name": paramsObj.value
          }
            
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, contrato_social: true }));
    },
    onError: () => {
      swal.fire({
        title: 'Erro',
        text: 'Houve um erro ao atualizar o status do Contrato social',
        icon: 'error',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      swal.fire({
        title: 'Sucesso',
        text: 'Status do Contrato social atualizado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right',
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, contrato_social: true }));
    }
  });


  const docRepOficioRequisitorioMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Doc. Ofício Requisitório Status": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, oficio_requisitorio: true }));
    },
    onError: () => {
      swal.fire({
        title: 'Erro',
        text: 'Houve um erro ao atualizar o status do Ofício Requisitório',
        icon: 'error',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      swal.fire({
        title: 'Sucesso',
        text: 'Status do Ofício Requisitório atualizado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right',
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, oficio_requisitorio: true }));
    }
  });

  const docRepRgMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Doc. RG Status": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, rg: true }));
    },
    onError: () => {
      swal.fire({
        title: 'Erro',
        text: 'Houve um erro ao atualizar o status do RG',
        icon: 'error',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      swal.fire({
        title: 'Sucesso',
        text: 'Status do RG atualizado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right',
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, rg: true }));
    }
  });

  const docRepCertidaoMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Doc. Certidão Nascimento/Casamento Status": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, certidao_nasc_cas: true }));
    },
    onError: () => {
      swal.fire({
        title: 'Erro',
        text: 'Houve um erro ao atualizar o status da Certidão de Nascimento/Casamento',
        icon: 'error',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      swal.fire({
        title: 'Sucesso',
        text: 'Status da Certidão de Nascimento/Casamento atualizado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right',
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, certidao_nasc_cas: true }));
    }
  });

  const docRepComprovanteResidenciaMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Doc. Comprovante de Residência Status": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, comprovante_de_residencia: true }));
    },
    onError: () => {
      swal.fire({
        title: 'Erro',
        text: 'Houve um erro ao atualizar o status do Comprovante de Residência',
        icon: 'error',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      swal.fire({
        title: 'Sucesso',
        text: 'Status do Comprovante de Residência atualizado com sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-right',
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, comprovante_de_residencia: true }));
    }
  });



  const handleChangeDocStatus = async (page_id: string, value: string) => {
    await DocStatusMutation.mutateAsync({ page_id, value });
  }

  const handleChangeDocStatusOficioRequisitorio = async (page_id: string, value: string) => {
    await docRepOficioRequisitorioMutation.mutateAsync({ page_id, value });
  }

  const handleChangeDocStatusRg = async (page_id: string, value: string) => {
    await docRepRgMutation.mutateAsync({ page_id, value });
  }

  const handleChangeDocStatusCertidao = async (page_id: string, value: string) => {
    await docRepCertidaoMutation.mutateAsync({ page_id, value });
  }

  const handleChangeDocStatusComprovanteResidencia = async (page_id: string, value: string) => {
    await docRepComprovanteResidenciaMutation.mutateAsync({ page_id, value });
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
    <div className="overflow-y-auto overflow-x-hidden 2xsm:max-h-[85vh] xl:max-h-[480px] 3xl:max-h-[750px] pr-3">
      <h2 className="mb-10 text-center text-2xl font-medium">
        Gestão de documentos
      </h2>
      <div className="grid w-full grid-cols-2 3xl:grid-cols-3 gap-10">
        {/* ====> área do cedente <==== */}
        <fieldset className='col-span-2 grid grid-cols-2 gap-5 lg:border lg:border-gray-200 lg:dark:border-form-strokedark rounded-md p-3 3xl:col-span-3 3xl:grid-cols-3'>
          <legend className='lg:px-2 lg:ml-3 text-black-2 dark:text-white'>
            Documentação do cedente
          </legend>

          {isFirstLoad ? (
            <CardDocsSkeleton />
          ) : (
            <>
              {/* doc div contrato social */}
              <CardDocs>
                <CardDocs.Header>Contrato Social</CardDocs.Header>
                <CardDocs.Body>
                  <CardDocs.DocPreviewWrapper>

                    <CardDocs.Preview
                      onClick={() => handleShowDoc(cedenteInfo?.properties["Doc. Contrato Social"].url || "")}
                      url={cedenteInfo?.properties["Doc. Contrato Social"].url || ""}
                    />

                    {cedenteInfo?.properties["Doc. Contrato Social"].url ? (
                      <div className='pr-5'>
                      <CelerInputField
                      fieldType={InputFieldVariant.SELECT}
                      name='status_doc'
                      className='mr-4'
                      disabled={role !== "ativos" && role !== "juridico"}
                      defaultValue={cedenteInfo?.properties["Doc. Contrato Social Status"].select?.name || ""}
                      onValueChange={(_, value) => handleChangeDocStatus(cedenteInfo.id, value)}
                      >
                        <SelectItem value={cedenteInfo?.properties["Doc. Contrato Social Status"].select?.name || ""}>
                          {
                            cedenteInfo?.properties["Doc. Contrato Social Status"].select?.name || ""
                          }
                          </SelectItem>
                          {
                            Object.values(DocStatus).filter(item => item !== cedenteInfo?.properties["Doc. Contrato Social Status"].select?.name).map((item, index) => (
                              <SelectItem className='shad-select-item' key={index} value={item}>{item}</SelectItem>
                            ))
                          }
                      </CelerInputField>
                      </div>
                    ) : (
                      <p className='text-sm text-center'>Nenhum documento vinculado</p>
                    )}
                  </CardDocs.DocPreviewWrapper>
                  <CardDocs.Actions>
                    {/* Select / Change document */}
                    <Button
                      isLoading={isFetchingDoc.contrato_social}
                      className="w-full md:max-w-44 lg:max-w-48 xl:w-full px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                      <form onSubmit={handleSubmit(submitDocument)}>
                        <label
                          htmlFor="contrato_social"
                          className="cursor-pointer text-sm flex items-center gap-2"
                        >
                          {cedenteInfo?.properties["Doc. Contrato Social"].url ? (
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
                          id="contrato_social"
                          accept=".jpg, .jpeg, .png, .pdf"
                          className="sr-only"
                          onChange={(e) =>
                            handleDocument(e, "contrato_social", "cedente")
                          }
                        />
                      </form>
                    </Button>

                    {cedenteInfo?.properties["Doc. Contrato Social"].url && (
                      <>
                        {/* download button */}
                        < Link
                          href={
                            cedenteInfo.properties["Doc. Contrato Social"].url || ""}
                          className="w-full md:max-w-44 lg:max-w-48 xl:w-full flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                        >
                          <FaFileDownload />
                          <span>Baixar Documento</span>
                        </Link>

                        {/* copy link button */}
                        <Button
                          onClick={() => handleCopyLink(cedenteInfo?.properties["Doc. Contrato Social"].url || "", "contrato_social")}
                          className={`w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "contrato_social" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
                          {linkCopied === "contrato_social" ? (
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
                          isLoading={isUnlinkingDoc.contrato_social}
                          variant='danger'
                          className='w-full md:max-w-44 lg:max-w-48 xl:w-full text-sm px-3 h-7'
                          onClick={() => handleRemoveDocument("contrato_social", "cedente")}
                        >
                          <BiUnlink className="text-snow" />
                          <span>Desvincular</span>
                        </Button>
                      </>
                    )}

                  </CardDocs.Actions>
                </CardDocs.Body>
              </CardDocs>
            </>
          )}
        </fieldset>
        {/* ====> fim da área do cedente <==== */}

        {/* ====> área do representante legal <==== */}
        <fieldset className='col-span-2 grid grid-cols-2 gap-5 lg:border lg:border-gray-200 lg:dark:border-form-strokedark rounded-md p-3 3xl:grid-cols-3 3xl:col-span-3'>
          <legend className='lg:px-2 lg:ml-3 text-black-2 dark:text-white'>
            Documentação do Representante
          </legend>

          {representanteState.isFetching && (
            <>
              {[...Array(4)].map((_, index) => (
                <CardDocsSkeleton key={index} />
              ))}
            </>
          )}

          {(representanteState.data === null && !representanteState.isFetching) && (
            <p className='text-center text-sm'>Não há representante vinculado a esse cedente.</p>
          )} 
          
          {representanteState.data && (
            <>
              {(tipoDoOficio === "PRECATÓRIO" || tipoDoOficio === "RPV") && (
                <>
                  {/* ====> ofício requisitório <==== */}

                  <CardDocs>
                    <CardDocs.Header>Ofício Requisitório</CardDocs.Header>
                    <CardDocs.Body>
                      <CardDocs.DocPreviewWrapper>

                        <CardDocs.Preview
                          onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Ofício Requisitório"].url || "")}
                          url={representanteState.data?.properties["Doc. Ofício Requisitório"].url || ""}
                        />

                        {representanteState.data?.properties["Doc. Ofício Requisitório"].url ? (
                          <div className='pr-5'>
                          <CelerInputField
                          fieldType={InputFieldVariant.SELECT}
                          name='status_doc'
                          className='mr-4'
                          disabled={role !== "ativos" && role !== "juridico"}
                          defaultValue={representanteState.data?.properties["Doc. Ofício Requisitório Status"].select?.name || ""}
                          onValueChange={(_, value) => {
                            if (representanteState.data) {
                              handleChangeDocStatusOficioRequisitorio(representanteState.data.id, value);
                            }
                          }}
                          >
                            <SelectItem value={representanteState.data?.properties["Doc. Ofício Requisitório Status"].select?.name || ""}>
                              {
                                representanteState.data?.properties["Doc. Ofício Requisitório Status"].select?.name || ""
                              }
                              </SelectItem>
                              {
                                Object.values(DocStatus).filter(item => item !== representanteState.data?.properties["Doc. Ofício Requisitório Status"].select?.name).map((item, index) => (
                                  <SelectItem className='shad-select-item' key={index} value={item}>{item}</SelectItem>
                                ))
                              }
                          </CelerInputField>
                          </div>
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
                              {representanteState.data?.properties["Doc. Ofício Requisitório"].url ? (
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
                                handleDocument(e, "oficio_requisitorio", "representante")
                              }
                            />
                          </form>
                        </Button>

                        {representanteState.data?.properties["Doc. Ofício Requisitório"].url && (
                          <>
                            {/* download button */}
                            < Link
                              href={
                                representanteState.data.properties["Doc. Ofício Requisitório"].url || ""}
                              className="w-full md:max-w-44 lg:max-w-48 flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                            >
                              <FaFileDownload />
                              <span>Baixar Documento</span>
                            </Link>

                            {/* copy link button */}
                            <Button
                              onClick={() => handleCopyLink(representanteState.data?.properties["Doc. Ofício Requisitório"].url || "", "oficio_requisitorio")}
                              className={`w-full md:max-w-44 lg:max-w-48 text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "oficio_requisitorio" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
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
                              className='w-full md:max-w-44 lg:max-w-48 text-sm px-3 h-7'
                              onClick={() => handleRemoveDocument("oficio_requisitorio", "representante")}
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

              {/* ====> rg <==== */}
              <CardDocs>
                <CardDocs.Header>Identidade (RG)</CardDocs.Header>
                <CardDocs.Body>
                  <CardDocs.DocPreviewWrapper>

                    <CardDocs.Preview
                      onClick={() => handleShowDoc(representanteState.data?.properties["Doc. RG"].url || "")}
                      url={representanteState.data?.properties["Doc. RG"].url || ""}
                    />

                    {representanteState.data?.properties["Doc. RG"].url ? (
                      <div className='pr-5'>
                      <CelerInputField
                      fieldType={InputFieldVariant.SELECT}
                      name='status_doc'
                      className='mr-4'
                      disabled={role !== "ativos" && role !== "juridico"}
                      defaultValue={representanteState.data?.properties["Doc. RG Status"].select?.name || ""}
                      onValueChange={(_, value) => {
                        if (representanteState.data) {
                          handleChangeDocStatusRg(representanteState.data.id, value);
                        }
                      }}
                      >
                        <SelectItem value={representanteState.data?.properties["Doc. RG Status"].select?.name || ""}>
                          {
                            representanteState.data?.properties["Doc. RG Status"].select?.name || ""
                          }
                          </SelectItem>
                          {
                            Object.values(DocStatus).filter(item => item !== representanteState.data?.properties["Doc. RG Status"].select?.name).map((item, index) => (
                              <SelectItem className='shad-select-item' key={index} value={item}>{item}</SelectItem>
                            ))
                          }
                      </CelerInputField>
                      </div>
                    ) : (
                      <p className='text-sm text-center'>Nenhum documento vinculado</p>
                    )}
                  </CardDocs.DocPreviewWrapper>
                  <CardDocs.Actions>
                    {/* Select / Change document */}
                    <Button
                      isLoading={isFetchingDoc.rg}
                      className="w-full md:max-w-44 lg:max-w-48 px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                      <form onSubmit={handleSubmit(submitDocument)}>
                        <label
                          htmlFor="rg"
                          className="cursor-pointer text-sm flex items-center gap-2"
                        >
                          {representanteState.data?.properties["Doc. RG"].url ? (
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
                            handleDocument(e, "rg", "representante")
                          }
                        />
                      </form>
                    </Button>

                    {representanteState.data?.properties["Doc. RG"].url && (
                      <>
                        {/* download button */}
                        < Link
                          href={
                            representanteState.data.properties["Doc. RG"].url || ""}
                          className="w-full md:max-w-44 lg:max-w-48 flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                        >
                          <FaFileDownload />
                          <span>Baixar Documento</span>
                        </Link>

                        {/* copy link button */}
                        <Button
                          onClick={() => handleCopyLink(representanteState.data?.properties["Doc. RG"].url || "", "rg")}
                          className={`w-full md:max-w-44 lg:max-w-48 text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "rg" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
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
                          variant='danger'
                          className='w-full md:max-w-44 lg:max-w-48 text-sm px-3 h-7'
                          onClick={() => handleRemoveDocument("rg", "representante")}
                        >
                          <BiUnlink className="text-xl text-snow" />
                          <span>Desvincular</span>
                        </Button>
                      </>
                    )}

                  </CardDocs.Actions>
                </CardDocs.Body>
              </CardDocs>

              {/* ====> doc certidão <===== */}
              <CardDocs>
                <CardDocs.Header>Certidão Nasc/Casamento</CardDocs.Header>
                <CardDocs.Body>
                  <CardDocs.DocPreviewWrapper>

                    <CardDocs.Preview
                      onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url || "")}
                      url={representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                    />

                    {representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url ? (
                      <div className='pr-5'>
                      <CelerInputField
                      fieldType={InputFieldVariant.SELECT}
                      name='status_doc'
                      className='mr-4'
                      disabled={role !== "ativos" && role !== "juridico"}
                      defaultValue={representanteState.data?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name || ""}
                      onValueChange={(_, value) => {
                        if (representanteState.data) {
                          handleChangeDocStatusCertidao(representanteState.data.id, value);
                        }
                      }}
                      >
                        <SelectItem value={representanteState.data?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name || ""}>
                          {
                            representanteState.data?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name || ""
                          }
                          </SelectItem>
                          {
                            Object.values(DocStatus).filter(item => item !== representanteState.data?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name).map((item, index) => (
                              <SelectItem className='shad-select-item' key={index} value={item}>{item}</SelectItem>
                            ))
                          }
                      </CelerInputField>
                      </div>
                    ) : (
                      <p className='text-sm text-center'>Nenhum documento vinculado</p>
                    )}
                  </CardDocs.DocPreviewWrapper>
                  <CardDocs.Actions>
                    {/* Select / Change document */}
                    <Button
                      isLoading={isFetchingDoc.certidao_nasc_cas}
                      className="w-full md:max-w-44 lg:max-w-48 px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                      <form onSubmit={handleSubmit(submitDocument)}>
                        <label
                          htmlFor="certidao_nasc_cas"
                          className="cursor-pointer text-sm flex items-center gap-2"
                        >
                          {representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url ? (
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
                            handleDocument(e, "certidao_nasc_cas", "representante")
                          }
                        />
                      </form>
                    </Button>

                    {representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url && (
                      <>
                        {/* download button */}
                        < Link
                          href={
                            representanteState.data.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                          className="w-full md:max-w-44 lg:max-w-48 flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                        >
                          <FaFileDownload />
                          <span>Baixar Documento</span>
                        </Link>

                        {/* copy link button */}
                        <Button
                          onClick={() => handleCopyLink(representanteState.data?.properties["Doc. Certidão Nascimento/Casamento"].url || "", "certidao_nasc_cas")}
                          className={`w-full md:max-w-44 lg:max-w-48 text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "certidao_nasc_cas" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
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
                          variant='danger'
                          className='w-full md:max-w-44 lg:max-w-48 text-sm px-3 h-7'
                          onClick={() => handleRemoveDocument("certidao_nasc_cas", "representante")}
                        >
                          <BiUnlink className="text-xl text-snow" />
                          <span>Desvincular</span>
                        </Button>
                      </>
                    )}

                  </CardDocs.Actions>
                </CardDocs.Body>
              </CardDocs>

              {/* ====> doc comprovante <==== */}
              <CardDocs>
                <CardDocs.Header>Comprovante de Residência</CardDocs.Header>
                <CardDocs.Body>
                  <CardDocs.DocPreviewWrapper>

                    <CardDocs.Preview
                      onClick={() => handleShowDoc(representanteState.data?.properties["Doc. Comprovante de Residência"].url || "")}
                      url={representanteState.data?.properties["Doc. Comprovante de Residência"].url || ""}
                    />

                    {representanteState.data?.properties["Doc. Comprovante de Residência"].url ? (
                      // <Badge
                      //   color={representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.color || ""}
                      //   isANotionPage={true}
                      //   className='w-[165px] mx-auto text-sm capitalize'
                      // >
                      //   {representanteState.data?.properties[
                      //     "Doc. Comprovante de Residência Status"
                      //   ].select?.name || ""}
                      // </Badge>
                      <div className='pr-5'>
                      <CelerInputField
                      fieldType={InputFieldVariant.SELECT}
                      name='status_doc'
                      className='mr-4'
                      disabled={role !== "ativos" && role !== "juridico"}
                      defaultValue={representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.name || ""}
                      onValueChange={(_, value) => {
                        if (representanteState.data) {
                          handleChangeDocStatusComprovanteResidencia(representanteState.data.id, value);
                        }
                      }}
                      >
                        <SelectItem value={representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.name || ""}>
                          {
                            representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.name || ""
                          }
                          </SelectItem>
                          {
                            Object.values(DocStatus).filter(item => item !== representanteState.data?.properties["Doc. Comprovante de Residência Status"].select?.name).map((item, index) => (
                              <SelectItem className='shad-select-item' key={index} value={item}>{item}</SelectItem>
                            ))
                          }
                      </CelerInputField>
                      </div>
                    ) : (
                      <p className='text-sm text-center'>Nenhum documento vinculado</p>
                    )}
                  </CardDocs.DocPreviewWrapper>
                  <CardDocs.Actions>
                    {/* Select / Change document */}
                    <Button
                      isLoading={isFetchingDoc.comprovante_de_residencia}
                      className="w-full md:max-w-44 lg:max-w-48 px-3 h-7 text-body dark:text-bodydark bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700"
                    >
                      <form onSubmit={handleSubmit(submitDocument)}>
                        <label
                          htmlFor="comprovante_de_residencia"
                          className="cursor-pointer text-sm flex items-center gap-2"
                        >
                          {representanteState.data?.properties["Doc. Comprovante de Residência"].url ? (
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
                            handleDocument(e, "comprovante_de_residencia", "representante")
                          }
                        />
                      </form>
                    </Button>

                    {representanteState.data?.properties["Doc. Comprovante de Residência"].url && (
                      <>
                        {/* download button */}
                        < Link
                          href={
                            representanteState.data.properties["Doc. Comprovante de Residência"].url || ""}
                          className="w-full md:max-w-44 lg:max-w-48 flex items-center text-body dark:text-bodydark justify-center text-sm gap-2 px-3 h-7 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300"
                        >
                          <FaFileDownload />
                          <span>Baixar Documento</span>
                        </Link>

                        {/* copy link button */}
                        <Button
                          onClick={() => handleCopyLink(representanteState.data?.properties["Doc. Comprovante de Residência"].url || "", "comprovante_de_residencia")}
                          className={`w-full md:max-w-44 lg:max-w-48 text-sm text-body dark:text-bodydark px-3 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 ${linkCopied === "comprovante_de_residencia" && "!text-snow !bg-green-500 hover:!bg-green-600"}`}>
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
                          variant='danger'
                          className='w-full md:max-w-44 lg:max-w-48 text-sm px-3 h-7'
                          onClick={() => handleRemoveDocument("comprovante_de_residencia", "representante")}
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
        </fieldset>
        {/* ====> fim da área do representante legal <==== */}


        <Button
          onClick={() => setDocModalInfo(null)}
          className="col-span-2 2xsm:w-full md:w-fit 3xl:col-span-3 mx-auto uppercase font-medium"
        >
          fechar
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
