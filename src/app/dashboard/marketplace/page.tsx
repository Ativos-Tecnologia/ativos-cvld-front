import Wallet from "@/components/Dashboard/Wallet";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "CelerApp | MarketPlace",
  description:
    "Marketplace com oportunidades de investimento em precatórios, RPV's e outros ativos do mercado de crédito.",
};

const WalletPage = () => {
  return (
    <DefaultLayout>
      <Wallet />
    </DefaultLayout>
  );
};

export default WalletPage;
