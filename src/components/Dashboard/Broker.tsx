"use client";
import DashbrokersCard from "../Cards/DashbrokersCard";
import { useContext, useEffect, useState } from "react";
import BrokerCardSkeleton from "../Skeletons/BrokerCardSkeleton";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";
import { BrokersContext } from "@/context/BrokersContext";
import BrokerModal from "../Modals/BrokersCedente";
import DocForm from "../Modals/BrokersDocs";

const Broker: React.FC = () => {

  const {
    editModalId, setEditModalId,
    cedenteModal, cardsData,
    docModalInfo
  } = useContext(BrokersContext);

  // estado para verificar se é o primeiro carregamento da view
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    if (isFirstLoad && cardsData) {
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, cardsData]);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 items-center w-full mt-15">
        {isFirstLoad ? (
          <Fade cascade damping={0.1} triggerOnce>
            {[...Array(4)].map((_, index: number) =>
              <BrokerCardSkeleton key={index} />
            )}
          </Fade>
        ) : (
          <>
            {(cardsData && cardsData?.results.length > 0) ? (
              <Fade cascade damping={0.1} triggerOnce>
                {cardsData?.results.map((oficio: any, index: number) => (
                  <DashbrokersCard
                    oficio={oficio}
                    key={index}
                    setEditModalId={setEditModalId}
                    editModalId={editModalId}
                  />
                ))}
              </Fade>
            ) : (
              <div className="my-10 flex flex-col items-center justify-center gap-5 col-span-2">
                <Image
                  src="/images/documents.svg"
                  alt="documentos com botão de adicionar"
                  width={210}
                  height={210}
                />
                <p className="text-center font-medium tracking-wider">
                  Sem registros de ofício para exibir.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {cedenteModal !== null && (
        <BrokerModal />
      )}
      {docModalInfo !== null && (
        <DocForm />
      )}
    </>
  );
};
export default Broker;
