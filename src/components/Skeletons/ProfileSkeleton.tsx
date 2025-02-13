import CustomSkeleton from '../CrmUi/CustomSkeleton';

export function ProfileSkeleton() {
    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark md:flex-row md:justify-start">
                <CustomSkeleton type="content" className="size-20 rounded-full" />
                <div className="flex flex-col items-center gap-2">
                    <CustomSkeleton type="title" className="h-5 w-35" />
                    <CustomSkeleton type="title" className="h-5 w-30" />
                </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark md:flex-row">
                <p className="mb-5 text-lg font-semibold">Informações Pessoais</p>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                            <div>
                                <p className="mb-2 text-xs font-semibold leading-normal">
                                    Primeiro Nome
                                </p>
                                <CustomSkeleton type="title" className="h-5 w-40" />
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold leading-normal">
                                    Sobrenome
                                </p>
                                <CustomSkeleton type="title" className="h-5 w-40" />
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold leading-normal">Título</p>
                            <CustomSkeleton type="title" className="h-5 w-40" />
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold leading-normal">Bio</p>
                            <div className="flex flex-col gap-1">
                                <CustomSkeleton type="title" className="h-5 w-45" />
                                <CustomSkeleton type="title" className="h-5 w-44" />
                                <CustomSkeleton type="title" className="h-5 w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <p className="mb-5 text-lg font-semibold">Informações de Usuário</p>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="mb-2 text-xs font-semibold leading-normal">Email</p>
                            <CustomSkeleton type="title" className="h-5 w-40" />
                        </div>
                        <div>
                            <p className="mb-2 text-xs font-semibold leading-normal">Telefone</p>
                            <CustomSkeleton type="title" className="h-5 w-40" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
