import Broker from "@/components/Dashboard/Broker";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CelerApp | Broker",
  description:
    "Ecossistema de amostragem e manipulação dos precatórios por parte dos brokers.",
};

const BrokerPage = () => {
  return (
    <DefaultLayout>
      <Broker/>
    </DefaultLayout>
  )
}

export default BrokerPage;