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

const PJdocs = ({ cedenteId, idPrecatorio }: { cedenteId: string | null, idPrecatorio: string }) => {

  const {
    register,
    handleSubmit,
    setValue,
    control
  } = useForm();

  const { fetchDetailCardData, setIsFetchAllowed } = useContext(BrokersContext)

  const [cedenteInfo, setCedenteInfo] = useState<NotionPage | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isFetchingDoc, setIsFetchingDoc] = useState<Record<string, boolean>>({
    contrato_social: false
  });
  const [isUnlinkingDoc, setIsUnlinkingDoc] = useState<Record<string, boolean>>({
    contrato_social: false,
    todos: false
  });

  // função para cadastrar o documento rg
  async function setDocument(id: string, data: FormData, documentType: string) {

    setIsFetchingDoc((old) => ({
      ...old,
      [documentType]: true
    }));
    setIsFetchAllowed(false);

    try {

      const req = await api.patch(`/api/cedente/link/doc/pj/${id}/${documentType}/`, data, {
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
  const handleRemoveDocument = async (documentType: string) => {

    setIsUnlinkingDoc((old) => ({
      ...old,
      [documentType]: true
    }));

    setIsFetchAllowed(false);

    try {

      const req = await api.delete(`/api/cedente/unlink/doc/pj/${cedenteInfo?.id}/${documentType}/`);
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
  }, [cedenteInfo]);

  return (
    <div className="overflow-y-auto overflow-x-hidden px-3 2xsm:max-h-[380px] xl:max-h-[480px]">
      <h2 className="mb-10 text-center text-2xl font-medium">
        Gestão de documentos
      </h2>
      <div className="grid w-full grid-cols-2 gap-10">
        {/* doc div rg */}
        <div className="col-span-2 flex flex-col gap-3">
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
                      onChange={(e) => handleDocument(e, "contrato_social")}
                    />
                  </form>
                </Button>
                {isFetchingDoc.contrato_social && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full">
                    <AiOutlineLoading className="animate-spin" />
                  </div>
                )}
                {cedenteInfo?.properties["Doc. Contrato Social"].url && (
                  <div className="flex 2xsm:flex-row 2xsm:gap-4 md:flex-none">
                    <CRMTooltip text="Baixar RG" placement="right">
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

                    <CRMTooltip text="Desvincular documento" placement="right">
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 p-0 transition-colors duration-300 hover:bg-red-600"
                        onClick={() => handleRemoveDocument("contrato_social")}
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
                <CRMTooltip text="Status do documento" placement="right">
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
      </div>
    </div>
  );
}

export default PJdocs;
