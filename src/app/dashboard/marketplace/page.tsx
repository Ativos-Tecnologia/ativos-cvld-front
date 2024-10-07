import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Marketplace from "@/components/Dashboard/Marketplace";

export const metadata: Metadata = {
  title: "CelerApp | MarketPlace",
  description:
    "Marketplace com oportunidades de investimento em precatórios, RPV's e outros ativos do mercado de crédito.",
};

const WalletPage = () => {
  return (
    <DefaultLayout>
      <Marketplace />
    </DefaultLayout>
  );
};

export default WalletPage;
