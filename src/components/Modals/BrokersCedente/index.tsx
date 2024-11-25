import { BrokersContext } from '@/context/BrokersContext';
import { NotionPage } from '@/interfaces/INotion';
import { useContext, useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { TiWarning } from "react-icons/ti";
import PFform from './PFform';
import PJform from './PJform';

export type BrokerModalProps = {
    cardInfo: NotionPage;
};

export type IdentificationType = "CPF" | "CNPJ" | null

const BrokerModal = () => {

    const { cedenteModal, setCedenteModal } = useContext(BrokersContext);

    /*
    
        estado que verifica o tipo do modal que vai ser aberto
        os estados podem ser CPF/CNPJ/NULL
    
    */
    const [credorIdentificationType, setCredorIdentificationType] = useState<IdentificationType>(null);

    /*
    
        estado que verifica o modo que o modal que será aberto irá se comportar
        o estado poder ser de criação ou edição, onde em edição, o usuário
        poderá desvincular o cedente criado para aquele ofício

    */
    const [openingModalMode, setOpeningModalMode] = useState<"create" | "edit">("create");

    const modalRef = useRef<HTMLDivElement | null>(null);

    // close on click outside
    // useEffect(() => {
    //     const clickHandler = ({ target }: MouseEvent) => {
    //         if (!modalRef.current) return;
    //         if (modalRef?.current?.contains(target as Node | null)) return;
    //         setCedenteModal(null);
    //     };
    //     document.addEventListener("click", clickHandler);
    //     return () => document.removeEventListener("click", clickHandler);
    // });

    // useEffect que dispara o conteúdo do modal (formulário)
    // a depender do dado de identificação do credor do ofício
    // CPF/CNPJ
    useEffect(() => {
        if (cedenteModal === null) return;

        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent = cedenteModal.properties["CPF/CNPJ"].rich_text![0].text.content.replace(/\D/g, '');

        setCredorIdentificationType(credorIdent.length === 11 ? "CPF" : credorIdent.length === 14 ? "CNPJ" : null);
    }, [cedenteModal]);

    // seta o modo do modal que será aberto mediante verificação
    // da existência de cedente já cadastrado
    useEffect(() => {
        if (cedenteModal === null || credorIdentificationType === null) return;

        // verifica se existe cedente já cadastrado no ofício passado. Se sim vai definir que o modal
        // aberto será de edição
        let cedenteAlreadyRegistered;
        if (credorIdentificationType === "CPF") {
            cedenteAlreadyRegistered = cedenteModal.properties["Cedente PF"].relation?.[0] ? true : false
        } else {
            cedenteAlreadyRegistered = cedenteModal.properties["Cedente PJ"].relation?.[0] ? true : false
        }

        setOpeningModalMode(cedenteAlreadyRegistered ? "edit" : "create");

    }, [credorIdentificationType])

    return (
        <div
            role="dialog"
            className="animate-fade fixed left-0 top-0 z-999 flex h-screen w-screen items-center justify-center bg-black-2/50 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter transition-all duration-300"
        >
            <div
                ref={modalRef}
                className="relative h-fit w-1/2 rounded-lg border border-stroke bg-white p-10 dark:border-strokedark dark:bg-boxdark"
            >

                {(credorIdentificationType === "CPF" && cedenteModal) ? (
                    <PFform
                        id={cedenteModal.id}
                        mode={openingModalMode}
                        cedenteId={cedenteModal!.properties["Cedente PF"].relation?.[0]?.id || null}
                    />
                ) : (
                    <>
                        {credorIdentificationType === "CNPJ" ? (
                            <PJform
                                id={cedenteModal!.id}
                                mode={openingModalMode}
                                cedenteId={cedenteModal!.properties["Cedente PJ"].relation?.[0]?.id || null}
                            />
                        ) : (
                            <Fade duration={700} triggerOnce>
                                <div className='flex flex-col gap-4 items-center justify-center'>
                                    <TiWarning className='text-amber-300 text-5xl' />
                                    <p className='text-center'>Para juntar cedente, é necessário ter o CPF/CNPJ informado no ofício.</p>
                                </div>
                            </Fade>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default BrokerModal