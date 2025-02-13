'use client';

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import UseMySwal from '@/hooks/useMySwal';
import Image from 'next/image';
import { ImageCropper } from '@/components/ImageCropper/imageCropper';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { CustomFlowbiteTheme, Flowbite, Popover } from 'flowbite-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { BiDotsVerticalRounded, BiPencil, BiTrashAlt } from 'react-icons/bi';
import { UpdatePersonalDataModal } from '@/components/Modals/UpdatePersonalDataModal';
import { UpdateUserDataModal } from '@/components/Modals/UpdateUserDataModal';
import { ProfileSkeleton } from '@/components/Skeletons/ProfileSkeleton';

const customTheme: CustomFlowbiteTheme = {
    popover: {
        base: 'absolute z-20 text-sm inline-block w-max max-w-[100vw] bg-white outline-none border border-stroke rounded-xl shadow-sm dark:border-strokedark dark:bg-boxdark',
        content: 'z-10 overflow-hidden rounded-[7px]',
        arrow: {
            base: 'absolute h-2 w-2 z-0 rotate-45 mix-blend-lighten bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:mix-blend-color',
            placement: '-4px',
        },
    },
};

/**
 * @description - Essa interface faz um "preview" do arquivo selecionado pelo usuário.
 * @type {FileWithPreview} - Interface que faz um preview do arquivo selecionado pelo usuário.
 * @property {FileWithPath} - Arquivo com caminho
 */
export type FileWithPreview = FileWithPath & {
    preview: string;
};

/**
 * @description - Constante com os tipos de arquivos aceitos pelo dropzone
 * @property {string} - Tipos de arquivos aceitos das imagens
 */
const accept = {
    'image/jpg, image/jpeg, image/png': [],
};

const Profile = () => {
    const { data, loading, firstLogin, updateProfilePicture, removeProfilePicture } =
        useContext(UserInfoAPIContext);

    /**
     * @description - Estado que armazena o arquivo selecionado pelo usuário
     * @type {FileWithPreview | null}
     */
    const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    /**
     * @description - Função que é chamada quando o usuário solta a imagem no dropzone
     * @param acceptedFiles Arquivo aceito pelo dropzone
     * @returns {void}
     */
    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            const file = acceptedFiles[0];

            if (!file) {
                UseMySwal().fire({
                    title: 'Erro ao carregar imagem',
                    text: 'A imagem selecionada está fora do tamanho permitido',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                return;
            }

            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            setSelectedFile(fileWithPreview);
            setDialogOpen(true);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * @description - Função que atualiza a foto de perfil do usuário
     * @param file - Arquivo de imagem
     * @returns {Promise<void>}
     */
    async function updatePhoto(file: File) {
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);
            console.log(data.id, formData.get('profile_picture'));
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
    });

    useEffect(() => {
        if (firstLogin) {
            UseMySwal().fire({
                title: 'Bem-vindo ao CVLD Simulator',
                text: 'Por favor, preencha suas informações para utilizar a plataforma',
                icon: 'info',
                confirmButtonText: 'OK',
            });
        }
    }, [firstLogin]);

    return (
        <DefaultLayout>
            <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-5">
                    <h1 className="mb-5 text-xl font-bold">Perfil</h1>
                    {loading ? (
                        <ProfileSkeleton />
                    ) : (
                        <section className="flex flex-col gap-6">
                            <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark md:flex-row md:justify-start">
                                <div className="relative">
                                    <div className="flex size-20 items-center justify-center rounded-full bg-muted-foreground/20">
                                        {data.profile_picture ? (
                                            <Image
                                                src={data.profile_picture}
                                                width={80}
                                                height={80}
                                                className="rounded-full"
                                                alt={`Imagem de perfil de ${data?.first_name} ${data?.last_name}`}
                                                title={`Imagem de perfil de ${data?.first_name} ${data?.last_name}`}
                                            />
                                        ) : (
                                            <p className="text-2xl font-semibold">
                                                {data.first_name.charAt(0).toUpperCase()}
                                                {data.last_name.charAt(0).toUpperCase()}
                                            </p>
                                        )}
                                    </div>

                                    <Flowbite theme={{ theme: customTheme }}>
                                        <Popover
                                            aria-labelledby="default-popover"
                                            placement="right"
                                            arrow={false}
                                            content={
                                                <div>
                                                    <button className="relative flex w-full items-center border-b border-stroke p-2 hover:bg-black/10 dark:border-strokedark dark:hover:bg-white/10">
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
                                            <button className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-blue-600 text-white transition duration-300 hover:bg-blue-700">
                                                <BiDotsVerticalRounded
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                    }}
                                                />
                                            </button>
                                        </Popover>
                                    </Flowbite>
                                </div>

                                <div className="flex flex-col items-center md:items-start">
                                    <p className="text-lg font-semibold">
                                        {data.first_name} {data.last_name}
                                    </p>
                                    <p className="text-center">{data.title || ''}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-stroke bg-white p-5  dark:border-strokedark dark:bg-boxdark md:flex-row">
                                <p className="mb-5 text-lg font-semibold">Informações Pessoais</p>
                                <div className="flex flex-col md:flex-row md:justify-between">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                                            <div>
                                                <p className="mb-2 text-xs font-semibold leading-normal">
                                                    Primeiro Nome
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {data.first_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-2 text-xs font-semibold leading-normal">
                                                    Sobrenome
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {data.last_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs font-semibold leading-normal">
                                                Título
                                            </p>
                                            <p className="text-sm font-medium">
                                                {data.title || 'Não Cadastrado'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs font-semibold leading-normal">
                                                Bio
                                            </p>
                                            <p className="text-sm font-medium">
                                                {data.bio || 'Não Cadastrada'}
                                            </p>
                                        </div>
                                    </div>

                                    <UpdatePersonalDataModal />
                                </div>
                            </div>

                            <div className="rounded-xl border border-stroke bg-white p-5  dark:border-strokedark dark:bg-boxdark">
                                <p className="mb-5 text-lg font-semibold">Informações de Usuário</p>
                                <div className="flex flex-col md:flex-row md:justify-between">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="mb-2 text-xs font-semibold leading-normal">
                                                Email
                                            </p>
                                            <p className="text-sm font-medium">{data.email}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-xs font-semibold leading-normal">
                                                Telefone
                                            </p>
                                            <p className="text-sm font-medium">
                                                {data.phone || 'Não Cadastrado'}
                                            </p>
                                        </div>
                                    </div>

                                    <UpdateUserDataModal />
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Profile;
