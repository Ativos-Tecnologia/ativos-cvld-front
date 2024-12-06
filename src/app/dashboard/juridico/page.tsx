import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Juridico from "@/components/Dashboard/Juridico";
import { UserInfoProvider } from "@/context/UserInfoContext";

export const metadata: Metadata = {
  title: "CelerApp | Jurídico",
  description:
    "Ecossistema de amostragem e manipulação dos precatórios por parte do time jurídico da Ativos.",
    category: "Dashboard Jurídico",
    openGraph: {
        title: "CelerApp | Jurídico",
        description:
            "Ecossistema de amostragem e manipulação dos precatórios por parte do time jurídico da Ativos.",
        },
    applicationName: "CelerApp",
    robots: "noindex",
};

const JuridicoWrapperPage = () => {
  return (
    <DefaultLayout>
        <UserInfoProvider>
            <Juridico />
        </UserInfoProvider>
    </DefaultLayout>
  );
};

export default JuridicoWrapperPage;
