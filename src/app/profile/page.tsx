"use client";

import { ImageCropper } from "@/components/ImageCropper/imageCropper";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import UseMySwal from "@/hooks/useMySwal";
import api from "@/utils/api";
import { CustomFlowbiteTheme, Flowbite, Popover } from "flowbite-react";
import Image from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  BiCheck,
  BiDotsVerticalRounded,
  BiPencil,
  BiTrashAlt,
  BiX
} from "react-icons/bi";
import { BsExclamation } from "react-icons/bs";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";
import ReactInputMask from "react-input-mask";

const customTheme: CustomFlowbiteTheme = {
  popover: {
    base: "absolute z-20 text-sm inline-block w-max max-w-[100vw] bg-white outline-none border border-stroke rounded-lg shadow-sm dark:border-strokedark dark:bg-boxdark",
    content: "z-10 overflow-hidden rounded-[7px]",
    arrow: {
      base: "absolute h-2 w-2 z-0 rotate-45 mix-blend-lighten bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:mix-blend-color",
      placement: "-4px",
    },
  },
};

/**
 * @description - Essa interface faz um "preview" do arquivo selecionado pelo usuário.
 * @type {FileWithPreview} - Interface que faz um preview do arquivo selecionado pelo usuário.
 * @property {FileWithPath} - Arquivo com caminho
 */
export type FileWithPreview = FileWithPath & {
  preview: string
}

/**
 * @description - Constante com os tipos de arquivos aceitos pelo dropzone
 * @property {string} - Tipos de arquivos aceitos das imagens
 */
const accept = {
  "image/jpg, image/jpeg, image/png": [],
}

const Profile = () => {
  const {
    data,
    loading,
    error,
    updateProfile,
    firstLogin,
    setFirstLogin,
    updateProfilePicture,
    removeProfilePicture,
    updateUserInfo,
  } = useContext(UserInfoAPIContext);
  const auxData = data;
  const [editModeProfile, setEditModeProfile] = useState<boolean>(false);
  const [editModeUser, setEditModeUser] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState("");
  const [usernameExists, setUsernameExists] = useState<boolean | undefined>(
    undefined,
  );
  const [emailExists, setEmailExists] = useState<string>("undefined");
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const emailRegex =
    /^[a-z0-9.\-_]{1,64}@[a-z0-9]{3,128}\.[a-z]{3,15}?(\.[a-z]{2,15})?$/;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  /**
   * @description - Estado que armazena o arquivo selecionado pelo usuário
   * @type {FileWithPreview | null}
   */
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  /**
   * @description - Função que é chamada quando o usuário solta a imagem no dropzone
   * @param acceptedFiles Arquivo aceito pelo dropzone
   * @returns {void}
   */
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {

      const file = acceptedFiles[0]
      
      if (!file) {
        UseMySwal().fire({
        title: "Erro ao carregar imagem",
        text: "A imagem selecionada está fora do tamanho permitido",
        icon: "error",
        confirmButtonText: "OK",
      });
        return
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    
    setSelectedFile(fileWithPreview)
    setDialogOpen(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

   /**
   * @description - Função que atualiza a foto de perfil do usuário
   * @param file - Arquivo de imagem
   * @returns {Promise<void>}
   */
  async function updatePhoto(file: File) {
        try {
          const formData = new FormData();
          formData.append('profile_picture', file!);
          await updateProfilePicture(`${data.id}`, formData);

        } catch (error) {
          console.error('Erro ao atualizar foto de perfil:', error);
        }
    }

  /**
   * @description - Hook do react-dropzone que retorna as propriedades necessárias para o dropzone
   * @type {object} Esse objeto é importante para que o formato do arquivo seja aceito e enviado para o componente "imageCropper".
   */
  const { getInputProps } = useDropzone({
    onDrop,
    accept,
  })

  useEffect(() => {
    if (firstLogin) {
      setEditModeProfile(true);
      UseMySwal().fire({
        title: "Bem-vindo ao CVLD Simulator",
        text: "Por favor, preencha o formulário de perfil para utilizar a plataforma",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }, [firstLogin]);

  useEffect(() => {
    setImageUrl(data?.profile_picture);
  }, [data]);

  useEffect(() => {
    if (
      watch("username") &&
      watch("username")?.length >= 4 &&
      watch("username")?.length <= 30
    ) {
      if (watch("username") !== data?.user) {
        try {
          api
            .get(`api/user/check-availability/${watch("username")}/`)
            .then((res) => {
              setUsernameExists(res.data.available);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        setUsernameExists(undefined);
      }
    }

    setUsernameExists(undefined);
  }, [watch("username")]);

  useEffect(() => {
    if (!watch("email")) return;

    if (
      watch("email") &&
      watch("email")?.length > 4 &&
      emailRegex.test(watch("email"))
    ) {
      if (watch("email") !== data?.email) {
        try {
          api
            .get(`api/user/check-availability/${watch("email")}/`)
            .then((res) => {
              res.data.available
                ? setEmailExists("available")
                : setEmailExists("unavailable");
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        setEmailExists("undefined");
      }
    } else {
      setEmailExists("invalid");
    }
  }, [watch("email")]);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       const formData = new FormData();
  //       formData.append("profile_picture", file);
  //       await updateProfilePicture(`${auxData.id}`, formData);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleCancelProfileEdit = () => {
  //   setEditModeUser(!editModeUser);
  //   setUsernameExists(undefined);
  //   setEmailExists("undefined");
  //   setValue("email", data?.email);
  //   setValue("username", data?.user);
  // };

  const updateProfileDataSubmit: SubmitHandler<Record<string, any>> = async (
    data,
  ) => {
    setEditModeProfile(false);
    try {
      const response = await updateProfile(`${auxData.id}`, data);
      
      if (response.status === 200) {
        setFirstLogin(false);
        // const firstUserResponse = await api.patch(`api/user/update-first-login/${auxData.id}/`);
        // if (firstUserResponse.status !== 200) {
        //   UseMySwal().fire({
        //     title: "Um erro inesperado ocorreu",
        //     icon: "error",
        //     timer: 3000,
        //     timerProgressBar: true,
        //   });
        // }
        UseMySwal().fire({
          title: "Perfil atualizado",
          icon: "success",
        });
      } else {
        UseMySwal().fire({
          title: "Perfil não atualizado. Verifique os campos e tente novamente",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDataSubmit: SubmitHandler<Record<string, any>> = async (
    data,
  ) => {
    try {
      const response = await updateUserInfo(`${auxData.id}`, data);

      if (response.status === 200) {
        UseMySwal().fire({
          title: "Informações de usuário atualizadas",
          icon: "success",
        });

        setEditModeUser(false);
        setUsernameExists(undefined);
        setEmailExists("undefined");
      } else {
        UseMySwal().fire({
          title:
            "Informações de usuário não atualizadas. Verifique os campos e tente novamente",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditEmail = () => {
    setEditEmail(!editEmail)
  }

  const handleUpdateEmail = async (data: any) => {
    try {
      const request = await api.put(`api/reset-email/`, data);
      if (request.status === 200) {
        UseMySwal().fire({
          title: "Email enviado, verifique na sua caixa de entrada para ativação do e-mail no sistema",
          icon: "success",
        });
        return request;
      }
    } catch (error: any) {
      UseMySwal().fire({
        title: `Erro ao Alterar Email: ${error.response.data.error}`,
        icon: "error",
      });
    }
  }

  const handleEditMode = () => {
    setEditModeProfile(!editModeProfile);
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-[8] h-35 md:h-65">
            <Image
              src={"/images/cover/cover-01.png"}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={970}
              height={260}
              style={{
                width: "auto",
                height: "100%",
              }}
            />
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            {loading ? (
              <div className="relative z-[8] mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="animate-pulse">
                  <div className="sm:max-w-42 sm:max-h-42 max-h-38 aspect-square max-h-44 rounded-full bg-slate-200 object-cover object-center dark:bg-slate-300"></div>
                </div>
              </div>
            ) : (
              <div className="relative z-[8] mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="relative drop-shadow-2">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      width={160}
                      height={160}
                      className="sm:max-w-42 sm:max-h-42 max-h-38 aspect-square max-h-44 rounded-full object-cover object-center"
                      alt={`Imagem de perfil de ${data?.first_name} ${data?.last_name}`}
                      title={`Imagem de perfil de ${data?.first_name} ${data?.last_name}`}
                    />
                  ) : (
                    <div className="sm:max-w-42 sm:max-h-42 max-h-38 flex aspect-square max-h-44 items-center justify-center rounded-full object-cover object-center text-6xl text-strokedark dark:text-white">
                      <span>{data?.first_name}</span>
                      <span>{data?.last_name}</span>
                    </div>
                  )}
                  <Flowbite theme={{ theme: customTheme }}>
                    <Popover
                      aria-labelledby="default-popover"
                      placement="right"
                      arrow={false}
                      content={
                        <div>
                          <button className="flex relative w-full items-center border-b border-stroke p-2 hover:bg-black/10 dark:border-strokedark dark:hover:bg-white/10">
                               {selectedFile ? (
                                    <ImageCropper
                                      dialogOpen={isDialogOpen}
                                      setDialogOpen={setDialogOpen}
                                      selectedFile={selectedFile}
                                      setSelectedFile={setSelectedFile}
                                      handleUpdatePhoto={updatePhoto}
                                    />
                                  ) : (
                                    <label
                                      htmlFor="profile"
                                      className="flex cursor-pointer items-center "
                                        >
                                      <BiPencil className="mr-2 h-4 w-4" />
                                      Mudar foto
                                    <input
                                      id="profile"
                                      {...getInputProps()}
                                    />
                                    </label>
                                  )}
                          </button>
                          <button
                            onClick={() =>
                              removeProfilePicture(data?.id as string)
                            }
                            className="flex w-full items-center p-2 hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            <BiTrashAlt className="mr-2 h-4 w-4" />
                            <span>Remover foto</span>
                          </button>
                        </div>
                      }
                    >
                      <button className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-blue-700 text-white transition duration-200 hover:bg-blue-600">
                        <BiDotsVerticalRounded
                          style={{
                            width: "18px",
                            height: "18px",
                          }}
                        />
                      </button>
                    </Popover>
                  </Flowbite>
                </div>
              </div>
            )}
            <div className="mt-4">
              <>
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="mx-auto h-[24px] w-[170px] rounded-full bg-slate-200 dark:bg-slate-300"></div>
                    </div>
                  ) : (
                    `${data?.first_name} ${data?.last_name}`
                  )}
                </h3>
                <div className="font-medium">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="mx-auto h-[18px] w-[280px] rounded-full bg-slate-200 dark:bg-slate-300"></div>
                    </div>
                  ) : (
                    data?.title
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Informações de Perfil
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit(updateProfileDataSubmit)}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="first_name"
                      >
                        Nome
                      </label>
                      <div className="relative">
                        <input
                          disabled={!editModeProfile}
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          id="first_name"
                          defaultValue={data?.first_name}
                          {...register("first_name")}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="last_name"
                      >
                        Sobrenome
                      </label>
                      <input
                        disabled={!editModeProfile}
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="last_name"
                        defaultValue={data?.last_name}
                        {...register("last_name")}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="title"
                    >
                      Título
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        disabled={!editModeProfile}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="title"
                        defaultValue={data?.title}
                        maxLength={50}
                        {...register("title")}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Bio
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_88_10224">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        disabled={!editModeProfile}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        id="bio"
                        rows={6}
                        placeholder="Escreva algo sobre você..."
                        defaultValue={data?.bio}
                        {...register("bio", {
                          maxLength: 512,
                        })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke bg-gray-100 px-4 py-2 font-medium text-black transition-all duration-200 hover:bg-gray-300 hover:shadow-1 dark:border-strokedark dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                      type="button"
                      onClick={handleEditMode}
                    >
                      {editModeProfile ? "Cancelar" : "Editar"}
                    </button>
                    <button
                      disabled={!editModeProfile}
                      className="disabled:!hover-blue-700 flex justify-center rounded bg-blue-700 px-4 py-2 font-medium text-gray transition-all duration-300 hover:!bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:text-white dark:hover:!bg-blue-800"
                      type="submit"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Informações de Usuário
                </h3>
              </div>
              <div className="flex">
                <form className="flex p-7 flex-row gap-2  w-full">
                  <div className="relative w-full">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      id="emailAddress"
                      disabled={!editEmail}
                      placeholder="ada@lovelace.com"
                      defaultValue={data?.email}
                      {...register("email")}
                    />
                    {emailExists !== "undefined" && (
                      <span className="absolute -bottom-5 flex items-center gap-1 text-xs">
                        {emailExists === "available" ? (
                          <>
                            <BiCheck className="h-5 w-5 text-green-500" />
                            <span>E-mail disponível</span>
                          </>
                        ) : emailExists === "unavailable" ? (
                          <>
                            <BiX className="h-5 w-5 text-meta-1" />
                            <span>E-mail indisponível</span>
                          </>
                        ) : (
                          <>
                            <BsExclamation className="h-5 w-5 text-yellow-300" />
                            <span>Formato de e-mail-inválido</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex mt-8">
                    <button type="button" className="justify-center items-center" onClick={handleEditEmail} >
                    {
                      editEmail ? (
                      <button
                        className="disabled:!hover-blue-700 flex justify-center rounded bg-blue-700 px-4 py-3 font-medium text-gray transition-all duration-300 hover:!bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:text-white dark:hover:!bg-blue-800"
                        onClick={handleSubmit(handleUpdateEmail)}
                      >
                        Alterar
                      </button>
                        )
                          :
                        (
                          <FaEnvelopeCircleCheck className="h-6 w-6 fill-current" />
                        )
                    }
                    </button>
                  </div>
                </form>
              </div>
                <form className="relative mb-8 p-7" onSubmit={handleSubmit(updateProfileDataSubmit)}>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phone"
                    >
                      Telefone
                    </label>
                    <ReactInputMask
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      disabled={!editModeProfile}
                      id="phone"
                      {...register("phone")}
                      mask="99 99999-9999"
                      placeholder="00 00000-0000"
                      defaultValue={data?.phone}
                    />
                  </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
