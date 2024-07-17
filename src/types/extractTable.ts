import { PaginatedResponse } from "@/components/TaskElements";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";

export type ExtractTableProps = {
    className?: string;
    data: PaginatedResponse<CVLDResultProps>;
    setData: React.Dispatch<React.SetStateAction<any>>;
    showModalMessage: boolean;
    loading: boolean;
    setModalOptions: React.Dispatch<React.SetStateAction<{
        open: boolean,
        extractId: string
    }>>;
    fetchDelete: (id: string) => void;
    setOpenDetailsDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenTaskDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setExtractId: React.Dispatch<React.SetStateAction<string>>;
    fetchDataById: (id: string) => void;
}