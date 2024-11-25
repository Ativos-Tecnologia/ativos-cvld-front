import { Button } from '@/components/Button';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import PFdocsSkeleton from '@/components/Skeletons/PFdocsSkeleton';
import { BrokersContext } from '@/context/BrokersContext';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
    <div className='max-h-[480px] px-3 overflow-y-auto overflow-x-hidden'>
      <h2 className='text-center text-2xl font-medium mb-10'>Gestão de documentos</h2>
      <div className='grid grid-cols-2 gap-10 w-full'>
        {/* doc div rg */}
        {(tipoDoOficio?.properties["Tipo"].select?.name === "PRECATÓRIO" || tipoDoOficio?.properties["Tipo"].select?.name === "RPV") && (
          <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Ofício Requisitório:</label>
            <input
              type="text"
              placeholder={isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"}
              disabled={true}
              {...register("rg", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className='flex items-center justify-between'>
              <div className='flex gap-3 items-center justify-start'>
                <Button variant='outlined' className='flex items-center justify-center py-1 px-3'>
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label htmlFor='rg' className='cursor-pointer font-medium text-sm'>
                      {cedenteInfo?.properties["Doc. Ofício Requisitório"].url ? "Alterar Documento" : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id='rg'
                      accept='.jpg, .jpeg, .png, .pdf'
                      className='sr-only'
                      onChange={(e) => handleDocument(e, "rg")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.oficio_requisitorio && (
                  <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                    <AiOutlineLoading className='animate-spin' />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Ofício Requisitório"].url && (
                  <>
                    <CRMTooltip text='Baixar Ofício Requisitório' placement='right'>
                      <Link
                        href={cedenteInfo.properties["Doc. Ofício Requisitório"].url || ""}
                        className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                        <FaFileDownload className='text-xl' />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant='ghost'
                        className='w-8 h-8 p-0 rounded-md flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors duration-300'
                        onClick={() => handleRemoveDocument("Ofício Requisitório")}
                      >
                        {isUnlinkingDoc.o ? <AiOutlineLoading className='text-xl text-snow animate-spin' /> : <BiTrash className='text-xl text-snow' />}
                      </Button>
                    </CRMTooltip>
                  </>
                )}
              </div>
              {cedenteInfo?.properties["Doc. Ofício Requisitório Status"]?.select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. Ofício Requisitório Status"].select?.color || "")}`
                    }}
                    className='py-1 px-3 text-black-2 rounded-md text-sm font-medium'>
                    {cedenteInfo?.properties["Doc. Ofício Requisitório Status"].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>
        )}
        {/* doc div rg */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Identidade (RG):</label>
            <input
              type="text"
              placeholder={isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"}
              disabled={true}
              {...register("rg", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className='flex items-center justify-between'>
              <div className='flex gap-3 items-center justify-start'>
                <Button variant='outlined' className='flex items-center justify-center py-1 px-3'>
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label htmlFor='rg' className='cursor-pointer font-medium text-sm'>
                      {cedenteInfo?.properties["Doc. RG"].url ? "Alterar Documento" : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id='rg'
                      accept='.jpg, .jpeg, .png, .pdf'
                      className='sr-only'
                      onChange={(e) => handleDocument(e, "rg")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.rg && (
                  <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                    <AiOutlineLoading className='animate-spin' />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. RG"].url && (
                  <>
                    <CRMTooltip text='Baixar RG' placement='right'>
                      <Link
                        href={cedenteInfo.properties["Doc. RG"].url || ""}
                        className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                        <FaFileDownload className='text-xl' />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant='ghost'
                        className='w-8 h-8 p-0 rounded-md flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors duration-300'
                        onClick={() => handleRemoveDocument("rg")}
                      >
                        {isUnlinkingDoc.rg ? <AiOutlineLoading className='text-xl text-snow animate-spin' /> : <BiTrash className='text-xl text-snow' />}
                      </Button>
                    </CRMTooltip>
                  </>
                )}
              </div>
              {cedenteInfo?.properties["Doc. RG Status"]?.select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. RG Status"].select?.color || "")}`
                    }}
                    className='py-1 px-3 text-black-2 rounded-md text-sm font-medium'>
                    {cedenteInfo?.properties["Doc. RG Status"].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* doc div certidao */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Certidão Nasc/Casamento:</label>
            <input
              type="text"
              placeholder={isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"}
              disabled={true}
              {...register("certidao_nasc_cas", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className='flex items-center justify-between'>
              <div className='flex gap-3 items-center justify-start'>
                <Button variant='outlined' className='flex items-center justify-center py-1 px-3'>
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label htmlFor='certidao_nasc_cas' className='cursor-pointer font-medium text-sm'>
                      {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url ? "Alterar Documento" : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id='certidao_nasc_cas'
                      accept='.jpg, .jpeg, .png, .pdf'
                      className='sr-only'
                      onChange={(e) => handleDocument(e, "certidao_nasc_cas")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.certidao_nasc_cas && (
                  <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                    <AiOutlineLoading className='animate-spin' />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url && (
                  <>
                    <CRMTooltip text='Baixar Certidão' placement='right'>
                      <Link
                        href={cedenteInfo.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                        className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                        <FaFileDownload className='text-xl' />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant='ghost'
                        className='w-8 h-8 p-0 rounded-md flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors duration-300'
                        onClick={() => handleRemoveDocument("certidao_nasc_cas")}
                      >
                        {isUnlinkingDoc.certidao_nasc_cas ? <AiOutlineLoading className='text-xl text-snow animate-spin' /> : <BiTrash className='text-xl text-snow' />}
                      </Button>
                    </CRMTooltip>
                  </>
                )}
              </div>
              {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.color || "")}`
                    }}
                    className='py-1 px-3 text-black-2 rounded-md text-sm font-medium'>
                    {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento Status"].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* doc div comprovante */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Comprovante de Residência:</label>
            <input
              type="text"
              placeholder={isFirstLoad ? "Carregando..." : "Nenhum documento vinculado"}
              disabled={true}
              {...register("comprovante_de_residencia", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
          {isFirstLoad ? (
            <PFdocsSkeleton />
          ) : (
            <div className='flex items-center justify-between'>
              <div className='flex gap-3 items-center justify-start'>
                <Button variant='outlined' className='flex items-center justify-center py-1 px-3'>
                  <form onSubmit={handleSubmit(submitDocument)}>
                    <label htmlFor='comprovante_de_residencia' className='cursor-pointer font-medium text-sm'>
                      {cedenteInfo?.properties["Doc. Comprovante de Residência"].url ? "Alterar Documento" : "Selecionar Documento"}
                    </label>
                    <input
                      type="file"
                      id='comprovante_de_residencia'
                      accept='.jpg, .jpeg, .png, .pdf'
                      className='sr-only'
                      onChange={(e) => handleDocument(e, "comprovante_de_residencia")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.comprovante_de_residencia && (
                  <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                    <AiOutlineLoading className='animate-spin' />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Comprovante de Residência"].url && (
                  <>
                    <CRMTooltip text='Baixar Comprovante' placement='right'>
                      <Link
                        href={cedenteInfo.properties["Doc. Comprovante de Residência"].url || ""}
                        className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                        <FaFileDownload className='text-xl' />
                      </Link>
                    </CRMTooltip>

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant='ghost'
                        className='w-8 h-8 p-0 rounded-md flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors duration-300'
                        onClick={() => handleRemoveDocument("comprovante_de_residencia")}
                      >
                        {isUnlinkingDoc.comprovante_de_residencia ? <AiOutlineLoading className='text-xl text-snow animate-spin' /> : <BiTrash className='text-xl text-snow' />}
                      </Button>
                    </CRMTooltip>
                  </>
                )}
              </div>
              {cedenteInfo?.properties["Doc. Comprovante de Residência Status"].select?.name && (
                <CRMTooltip text="Status do documento" placement="right">
                  <div
                    style={{
                      background: `${notionColorResolver(cedenteInfo?.properties["Doc. Comprovante de Residência Status"].select?.color || "")}`
                    }}
                    className='py-1 px-3 text-black-2 rounded-md text-sm font-medium'>
                    {cedenteInfo?.properties["Doc. Comprovante de Residência Status"].select?.name || ""}
                  </div>
                </CRMTooltip>
              )}
            </div>
          )}
        </div>

        {/* botão que desvincula todos os documentos */}
        {(cedenteInfo?.properties["Doc. Ofício Requisitório"].url || cedenteInfo?.properties["Doc. RG"].url || cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url || cedenteInfo?.properties["Doc. Comprovante de Residência"].url) && (
          <fieldset className='col-span-2 border-t border-stroke dark:border-form-strokedark flex items-center gap-5 justify-center py-3'>
            <legend className='text-xs px-2 uppercase'>Outras opções</legend>

            <Button
              onClick={() => setDocModalInfo(null)}
              className='bg-green-500 hover:bg-green-600'
            >
              OK
            </Button>

            <Button
              variant='outlined'
              onClick={() => handleRemoveDocument("todos")}
            >
              {isUnlinkingDoc.todos ? "Desvinculando documentos..." : "Desvincular todos os documentos"}
            </Button>
          </fieldset>
        )}
      </div>
    </div >
  )
}

export default PFdocs
