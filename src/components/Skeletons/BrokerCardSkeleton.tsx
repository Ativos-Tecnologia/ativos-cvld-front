import CustomSkeleton from "../CrmUi/CustomSkeleton";

const BrokerCardSkeleton = () => {
    return (
        <div className="bg-gray-200 dark:bg-slate-800/70 p-6 rounded-lg w-full max-w-2xl grid grid-cols-12 gap-2">
            {/* Lado Esquerdo */}
            <div className="col-span-6 grid gap-3">
                {/* Nome do Credor */}
                <div>
                    <CustomSkeleton
                        type="title"
                        className="h-4 w-32 rounded mb-2"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-5 w-24 rounded mb-2"
                    />
                </div>

                {/* CPF/CNPJ */}
                <div>
                    <CustomSkeleton
                        type="title"
                        className="h-4 w-24 rounded mb-2"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-5 w-32 rounded mb-2" />
                </div>

                {/* Tribunal */}
                <div>
                    <CustomSkeleton
                        type="title"
                        className="h-4 w-20 rounded mb-2"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-5 w-16 rounded" />
                </div>

                {/* Esfera */}
                <div>
                    <CustomSkeleton
                        type="title"
                        className="h-4 w-20 rounded mb-2"
                    />
                    <CustomSkeleton
                        type='content'
                        className="h-5 w-28 rounded"
                    />
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-2 mt-4">
                    <CustomSkeleton
                        type="content"
                        className="h-10 w-48 rounded"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-10 w-48 rounded"
                    />
                </div>

                {/* Status Circles */}
                <div className="flex gap-2 mt-2">
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-4 rounded"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-4 rounded"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-4 rounded"
                    />
                </div>

                {/* Tag Precatório */}
                <CustomSkeleton
                    type="content"
                    className="h-6 w-24 rounded mb-2"
                />
            </div>

            {/* Lado Direito */}
            <div className="col-span-6 grid gap-5">
                {/* Checkbox Proposta */}
                <div className="flex items-center gap-2 mb-6">
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-4 rounded"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-32 rounded"
                    />
                </div>

                {/* Proposta Atual */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <CustomSkeleton
                            type="content"
                            className="h-4 w-28 rounded"
                        />
                        <CustomSkeleton
                            type="content"
                            className="h-4 w-32 rounded"
                        />
                    </div>
                    <CustomSkeleton
                        type="content"
                        className="h-2 w-full rounded-full"
                    />
                </div>

                {/* Comissão Atual */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <CustomSkeleton
                            type="content"
                            className="h-4 w-28 rounded"
                        />
                        <CustomSkeleton
                            type="content"
                            className="h-4 w-32 rounded"
                        />
                    </div>
                    <CustomSkeleton
                        type="content"
                        className="h-2 w-full rounded-full"
                    />
                </div>

                {/* Botão Salvar */}
                <CustomSkeleton
                    type="content"
                    className="h-10 w-full rounded mb-6"
                />

                {/* Observações */}
                <div>
                    <CustomSkeleton
                        type="content"
                        className="h-4 w-28 rounded mb-2"
                    />
                    <CustomSkeleton
                        type="content"
                        className="h-24 w-full rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default BrokerCardSkeleton;