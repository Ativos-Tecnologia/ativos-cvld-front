import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EspacoGerencial from "@/components/Features/Comercial/EspacoGerencial";

export const metadata: Metadata = {
  title: "CelerApp | Espaço Gerencial",
  description:
    "Ecossistema de gestão da esteira comercial de ofícios da Ativos.",
    category: "Dashboard",
    openGraph: {
        title: "CelerApp | Espaço Gerencial",
        description:
            "Ecossistema de gestão da esteira comercial de ofícios da Ativos.",
        },
    applicationName: "CelerApp",
    robots: "noindex",
};

const EspacoGerencialWrapperPage = () => {
  return (
    <DefaultLayout>
        <EspacoGerencial />
    </DefaultLayout>
  );
};

export default EspacoGerencialWrapperPage;
