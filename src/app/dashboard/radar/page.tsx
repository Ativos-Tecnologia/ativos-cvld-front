import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PrecatoriosEspeciais from "@/components/Dashboard/PrecatoriosEspeciais";

export const metadata: Metadata = {
  title: "CelerApp | Precatórios Especiais",
  description:
    "Ecossistema de amostragem de precatórios do tipo Especial.",
    category: "Dashboard Precatórios Especiais",
    openGraph: {
        title: "CelerApp | Precatórios Especiais",
        description:
            "Ecossistema de amostragem de precatórios do tipo Especial.",
        },
    applicationName: "CelerApp",
    robots: "noindex",
};

const JuridicoWrapperPage = () => {
  return (
    <DefaultLayout>
        <PrecatoriosEspeciais />
    </DefaultLayout>
  );
};

export default JuridicoWrapperPage;
