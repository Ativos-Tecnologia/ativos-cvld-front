import { PaginatedResponse } from "@/components/TaskElements";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import React, { Dispatch } from "react";

export type ExtractTableProps = {
    className?: string;
    data: PaginatedResponse<CVLDResultProps> | any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    showModalMessage: boolean;
    loading: boolean;
    setModalOptions: React.Dispatch<React.SetStateAction<{
        open: boolean,
        items: CVLDResultProps[] | never[]
    }>>;
    fetchDelete: (ids: string[]) => void;
    setOpenDetailsDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenTaskDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setExtractId: React.Dispatch<React.SetStateAction<string>>;
    fetchDataById: (id: string) => void;
    count: number;
    onPageChange: (page: number) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    callScrollTop: () => void;
    checkedList: CVLDResultProps[] | never[];
    setCheckedList: React.Dispatch<React.SetStateAction<CVLDResultProps[] | never[]>>;
    handleSelectRow: (item: CVLDResultProps) => void;
    handleSelectAllRows: () => void;
    handleDeleteExtrato: () => void;
    editableLabel?: string | null;
    setEditableLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}