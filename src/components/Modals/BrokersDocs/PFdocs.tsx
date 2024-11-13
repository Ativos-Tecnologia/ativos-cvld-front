import { Button } from '@/components/Button';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { NotionPage } from '@/interfaces/INotion';
import api from '@/utils/api';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai';
import { BiCheck, BiX } from 'react-icons/bi';
import { FaFileDownload } from 'react-icons/fa';
import { RiImageFill } from 'react-icons/ri';
import { toast } from 'sonner';

/*
  OBS: a prop que o componente recebe é somente usada para a requisição
  onde é fetcheado os dados do cedente cadastrado no ofício em questão
*/

const PFdocs = ({ cedenteId }: { cedenteId: string | null }) => {

  const {
    register,
    handleSubmit,
    setValue,
    control
  } = useForm();

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [isFetchingDoc, setIsFetchingDoc] = useState<{
    rg: boolean;
    certidao: boolean;
    comprovante: boolean;
  }>({
    rg: false,
    certidao: false,
    comprovante: false
  });

  console.log(cedenteInfo)

  // função para cadastrar o documento rg
  async function setRgDocument(id: string, data: FormData) {

    setIsFetchingDoc((old) => ({
      ...old,
      rg: true
    }))

    try {

      const req = await api.patch(`/api/cedente/link/doc/pf/${id}/rg/`, data, {
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
        rg: false
      }));

    }

  }

  // função para cadastrar o documento certidão
  async function setCertidaoDocument(id: string, data: FormData) {

    setIsFetchingDoc((old) => ({
      ...old,
      certidao: true
    }))

    try {

      const req = await api.patch(`/api/cedente/link/doc/pf/${id}/certidao_nasc_cas/`, data, {
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
        certidao: false
      }));

    }

  }

  // função para cadastrar o documento certidão
  async function setComprovanteDocument(id: string, data: FormData) {

    setIsFetchingDoc((old) => ({
      ...old,
      comprovante: true
    }))

    try {

      const req = await api.patch(`/api/cedente/link/doc/pf/${id}/comp_res/`, data, {
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
        comprovante: false
      }));

    }

  }

  // função para setar o documento rg por meio do file input
  const handleRgDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && cedenteInfo?.id !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append("rg", file);
        await setRgDocument(cedenteInfo?.id as string, formData);
      };

      reader.readAsDataURL(file)
    }
  }

  // função para setar o documento rg por meio do file input
  const handleCertidaoDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && cedenteInfo?.id !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append("certidao_nasc_cas", file);
        await setCertidaoDocument(cedenteInfo?.id as string, formData);
      };

      reader.readAsDataURL(file)
    }
  }

  // função para setar o documento rg por meio do file input
  const handleComprovanteDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && cedenteInfo?.id !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append("comprovante_de_residencia", file);
        await setComprovanteDocument(cedenteInfo?.id as string, formData);
      };

      reader.readAsDataURL(file)
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
  }, [cedenteInfo])

  return (
    <div className='max-h-[480px] px-3'>
      <h2 className='text-center text-2xl font-medium mb-10'>Junção de Documentos</h2>
      <div className='grid grid-cols-2 gap-10 w-full'>
        {/* doc div rg */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Identidade (RG):</label>
            <input
              type="text"
              placeholder='Nenhum documento vinculado'
              disabled={true}
              {...register("rg", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
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
                    onChange={(e) => handleRgDocument(e)}
                  />
                </form>
              </Button>
              {isFetchingDoc.rg && (
                <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                  <AiOutlineLoading className='animate-spin' />
                </div>
              )}
              {cedenteInfo?.properties["Doc. RG"].url && (
                <CRMTooltip text='Baixar documento' placement='right'>
                  <Link
                    href={cedenteInfo.properties["Doc. RG"].url || ""}
                    className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                    <FaFileDownload className='text-xl' />
                  </Link>
                </CRMTooltip>
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
        </div>

        {/* doc div certidao */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Certidão Nasc/Casamento:</label>
            <input
              type="text"
              placeholder='Nenhum documento vinculado'
              disabled={true}
              {...register("certidao_nasc_cas", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
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
                    onChange={(e) => handleCertidaoDocument(e)}
                  />
                </form>
              </Button>
              {isFetchingDoc.certidao && (
                <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                  <AiOutlineLoading className='animate-spin' />
                </div>
              )}
              {cedenteInfo?.properties["Doc. Certidão Nascimento/Casamento"].url && (
                <CRMTooltip text='Baixar documento' placement='right'>
                  <Link
                    href={cedenteInfo.properties["Doc. Certidão Nascimento/Casamento"].url || ""}
                    className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                    <FaFileDownload className='text-xl' />
                  </Link>
                </CRMTooltip>
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
        </div>

        {/* doc div comprovante */}
        <div className='flex flex-col gap-3 col-span-2'>
          <div className='flex gap-3 items-center justify-center'>
            <label className='min-w-[211px]' htmlFor="rg">Comprovante de Residência:</label>
            <input
              type="text"
              placeholder='Nenhum documento vinculado'
              disabled={true}
              {...register("comprovante_de_residencia", { required: true })}
              className='flex-1 w-full border-b border-l-0 border-t-0 border-r-0 bg-transparent py-1 outline-none focus:border-primary focus-visible:shadow-none focus-visible:!ring-0 placeholder:italic'
            />
          </div>
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
                    onChange={(e) => handleComprovanteDocument(e)}
                  />
                </form>
              </Button>
              {isFetchingDoc.comprovante && (
                <div className='flex items-center justify-center w-8 h-8 rounded-full'>
                  <AiOutlineLoading className='animate-spin' />
                </div>
              )}
              {cedenteInfo?.properties["Doc. Comprovante de Residência"].url && (
                <CRMTooltip text='Baixar documento' placement='right'>
                  <Link
                    href={cedenteInfo.properties["Doc. Comprovante de Residência"].url || ""}
                    className='flex items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 transition-colors duration-300'>
                    <FaFileDownload className='text-xl' />
                  </Link>
                </CRMTooltip>
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
        </div>
      </div>
    </div >
  )
}

export default PFdocs
