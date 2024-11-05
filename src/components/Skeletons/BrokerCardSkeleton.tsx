import CustomSkeleton from "../CrmUi/CustomSkeleton";

const BrokerCardSkeleton = () => {
    return (
        <div className="bg-gray-200 dark:bg-slate-800/70 p-6 rounded-lg w-full max-w-2xl grid grid-cols-12 gap-2">
            {/* Lado Esquerdo */}
            <div className="col-span-6 grid gap-3">
                {/* Nome do Credor */}
                <div>
                    <CustomSkeleton className="h-4 w-32 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 rounded mb-2" />
                    <CustomSkeleton className="h-5 w-24 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded mb-2" />
                </div>

                {/* CPF/CNPJ */}
                <div>
                    <CustomSkeleton className="h-4 w-24 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 rounded mb-2" />
                    <CustomSkeleton className="h-5 w-32 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded mb-2" />
                </div>

                {/* Tribunal */}
                <div>
                    <CustomSkeleton className="h-4 w-20 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 rounded mb-2" />
                    <CustomSkeleton className="h-5 w-16 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                </div>

                {/* Esfera */}
                <div>
                    <CustomSkeleton className="h-4 w-20 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-200/20 rounded mb-2" />
                    <CustomSkeleton className="h-5 w-28 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-2 mt-4">
                    <CustomSkeleton className="h-10 w-48 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                    <CustomSkeleton className="h-10 w-48 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                </div>

                {/* Status Circles */}
                <div className="flex gap-2 mt-2">
                    <CustomSkeleton className="h-4 w-4 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                    <CustomSkeleton className="h-4 w-4 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                    <CustomSkeleton className="h-4 w-4 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                </div>

                {/* Tag Precatório */}
                <CustomSkeleton className="h-6 w-24 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded mb-2" />
            </div>

            {/* Lado Direito */}
            <div className="col-span-6 grid gap-5">
                {/* Checkbox Proposta */}
                <div className="flex items-center gap-2 mb-6">
                    <CustomSkeleton className="h-4 w-4 bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                    <CustomSkeleton className="h-4 w-32 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded" />
                </div>

                {/* Proposta Atual */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <CustomSkeleton className="h-4 w-28 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded" />
                        <CustomSkeleton className="h-4 w-32 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded" />
                    </div>
                    <CustomSkeleton className="h-2 w-full bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded-full" />
                </div>

                {/* Comissão Atual */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <CustomSkeleton className="h-4 w-28 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded" />
                        <CustomSkeleton className="h-4 w-32 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded" />
                    </div>
                    <CustomSkeleton className="h-2 w-full bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded-full" />
                </div>

                {/* Botão Salvar */}
                <CustomSkeleton className="h-10 w-full bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded mb-6" />

                {/* Observações */}
                <div>
                    <CustomSkeleton className="h-4 w-28 bg-gray-400/30 dark:bg-slate-600/70 dark:before:bg-slate-400/40 rounded mb-2" />
                    <CustomSkeleton className="h-24 w-full bg-gray-400/70 dark:bg-slate-700 dark:before:bg-slate-400/40 rounded" />
                </div>
            </div>
        </div>
    );
};

export default BrokerCardSkeleton;