import Wallet from "@/components/Dashboard/Wallet";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "CelerApp | Wallet",
  description:
    "Carteira de ativos digitais, com informações sobre o saldo, valorização e desvalorização dos ativos.",
};

const ComercialResumoPageWrapper = () => {
  return (
    <DefaultLayout>
      <Wallet />
    </DefaultLayout>
  );
};

export default ComercialResumoPageWrapper;
