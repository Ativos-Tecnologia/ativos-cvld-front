export type ExtractTableProps = {
    className?: string;
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    showModalMessage: boolean;
    loading: boolean;
    setModalOptions: React.Dispatch<React.SetStateAction<{
        open: boolean,
        extractId: string
    }>>;
    fetchDelete: (id: string) => void;
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    fetchDataById: (id: string) => void;
}