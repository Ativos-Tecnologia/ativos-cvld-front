/* eslint-disable @typescript-eslint/no-explicit-any */

import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import { IEditableLabels } from "./ExtratosTableContext";
import { toast } from "sonner";
import numberFormat from "@/functions/formaters/numberFormat";
import { ENUM_OFICIOS_LIST } from "@/constants/constants";
import { UserInfoAPIContext } from "./UserInfoContext";

/* ===================> Iterfaces & Types <================== */
export interface ITableNotion {
  data: any;
  userData: any;
  isFetching: boolean;
  editLock: boolean;
  updateState: string | null;
  selectedUser: string | null;
  archiveStatus: boolean;
  statusSelectValue: statusOficio | null;
  oficioSelectValue: tipoOficio | null;
  setListQuery: React.Dispatch<React.SetStateAction<object | null>>;
  editableLabel: IEditableLabels;
  setEditableLabel: React.Dispatch<React.SetStateAction<IEditableLabels>>;
  usersList: string[];
  setUsersList: React.Dispatch<React.SetStateAction<string[]>>;
  filteredUsersList: string[];
  setFilteredUsersList: React.Dispatch<React.SetStateAction<string[]>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  checkedList: NotionPage[];
  setCheckedList: React.Dispatch<React.SetStateAction<NotionPage[]>>;
  setSaveInfoToNotion: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectRow: (row: NotionPage) => void;
  handleSelectAllRows: (list: NotionPage[]) => void;
  handleCopyValue: (index: number) => void;
  handleEditInput: (index: number, refList: HTMLDivElement[] | null) => void;
  handleArchiveExtrato: (queryKeyList: any[]) => Promise<void>;
  handleEditStatus: (
    page_id: string,
    status: statusOficio,
    queryKeyList: any[],
  ) => Promise<void>;
  handleEditTipoOficio: (
    page_id: string,
    oficio: tipoOficio,
    queryKeyList: any[],
  ) => Promise<void>;
  handleChangeCreditorName: (
    value: string,
    page_id: string,
    queryKeyList: any[],
  ) => Promise<void>;
  handleChangePhoneNumber: (
    page_id: string,
    type: string,
    value: string,
    queryKeyList: any[],
  ) => Promise<void>;
  handleChangeEmail: (
    page_id: string,
    value: string,
    queryKeyList: any[],
  ) => Promise<void>;
  handleChangeProposalPrice: (
    page_id: string,
    value: string,
    queryKeyList: any[],
  ) => Promise<void>;
  handleChangeFupDate: (
    page_id: string,
    value: string,
    type: string,
    queryKeyList: any[],
  ) => Promise<void>;
  handleFilterByTipoOficio: (oficio: tipoOficio) => void;
  handleFilterByUser: (user: string) => void;
  handleCleanAllFilters: () => void;
  handleFilterByStatus: (status: statusOficio) => void;
  searchStatus: (value: string) => void;
  searchUser: (value: string) => void;
}

/* ===================> Context <================== */
export const TableNotionContext = createContext<ITableNotion>({
  /*  ====> states <===== */
  data: {},
  userData: null,
  selectedUser: null,
  editLock: false,
  archiveStatus: false,
  isFetching: false,
  updateState: null,
  statusSelectValue: null,
  oficioSelectValue: null,
  editableLabel: {
    id: "",
    nameCredor: false,
    phone: {
      one: false,
      two: false,
      three: false,
    },
    email: false,
    proposalPrice: false,
    fup: {
      first: false,
      second: false,
      third: false,
      fourth: false,
      fifth: false,
    },
    identification: false,
    npuOrig: false,
    npuPrec: false,
    court: false,
  },
  setListQuery: () => {},
  setEditableLabel: () => {},
  usersList: [],
  setUsersList: () => {},
  filteredUsersList: [],
  setFilteredUsersList: () => {},
  isEditing: false,
  setIsEditing: () => {},
  checkedList: [],
  setCheckedList: () => {},
  handleSelectRow: () => {},
  handleSelectAllRows: () => {},
  handleCopyValue: () => {},
  handleEditInput: () => {},
  handleArchiveExtrato: async () => {},
  handleEditStatus: async () => {},
  handleEditTipoOficio: async () => {},
  handleChangeCreditorName: async () => {},
  handleChangePhoneNumber: async () => {},
  handleChangeEmail: async () => {},
  handleChangeProposalPrice: async () => {},
  handleChangeFupDate: async () => {},
  handleFilterByTipoOficio: () => {},
  handleFilterByUser: () => {},
  handleCleanAllFilters: () => {},
  handleFilterByStatus: () => {},
  searchStatus: () => {},
  searchUser: () => {},
  setSaveInfoToNotion: () => {},
});

export const TableNotionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  /*  ====> states <===== */
  const [statusSelectValue, setStatusSelectValue] =
    useState<statusOficio | null>(null);
  const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(
    null,
  );
  const [checkedList, setCheckedList] = useState<NotionPage[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<string[]>([]);
  const [saveInfoToNotion, setSaveInfoToNotion] = useState<boolean>(false);
  const [listQuery, setListQuery] = useState<object | null>(null);
  const [editableLabel, setEditableLabel] = useState<IEditableLabels>({
    id: "",
    nameCredor: false,
    phone: {
      one: false,
      two: false,
      three: false,
    },
    email: false,
    proposalPrice: false,
    fup: {
      first: false,
      second: false,
      third: false,
      fourth: false,
      fifth: false,
    },
    identification: false,
    npuOrig: false,
    npuPrec: false,
    court: false,
  });
  const [archivedOficios, setArchivedOficios] = useState<NotionPage[]>([]);
  const [updateState, setUpdateState] = useState<string | null>(null);
  const [editLock, setEditLock] = useState<boolean>(false);
  const [archiveStatus, setArchiveStatus] = useState<boolean>(false);
  const [filteredUsersList, setFilteredUsersList] = useState<string[]>([]);
  const [, setFilteredStatusValues] =
    useState<statusOficio[]>(ENUM_OFICIOS_LIST);

  const {
    data: { product },
  } = useContext(UserInfoAPIContext) as {
    data: { product: "crm" | "wallet" | "global" };
  };

  /*  ====> query <==== */
  // query for user
  const queryClient = useQueryClient();
  const fetchUser = async () => {
    const t = await api.get("/api/profile/");
    return t.data;
  };
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  // query for oficios
  const fetchNotionData = async () => {
    if (userData.user && listQuery !== null && product === "global") {
      const t = await api.post(`api/notion-api/list/`, listQuery);
      return t.data;
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: ["notion_list"],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    staleTime: 100,
    queryFn: fetchNotionData,
    enabled: false, // only fetch if user is defined after context is loaded and is not editing any table label
  });

  /* ====> constants <==== */
  // const { data: userData } = useContext(UserInfoAPIContext);
  const secondaryDefaultFilterObject = useMemo(() => {
    return {
      and: [
        {
          property: "Status",
          status: {
            does_not_equal: "Já vendido",
          },
        },
        {
          property: "Status",
          status: {
            does_not_equal: "Considerou Preço Baixo",
          },
        },
        {
          property: "Status",
          status: {
            does_not_equal: "Contato inexiste",
          },
        },
        {
          property: "Status",
          status: {
            does_not_equal: "Ausência de resposta",
          },
        },
        {
          property: "Status",
          status: {
            does_not_equal: "Transação Concluída",
          },
        },
        {
          property: "Status",
          status: {
            does_not_equal: "Ausência de resposta",
          },
        },
      ],
    };
  }, []);
  const defaultFilterObject = {
    and: [
      {
        property:
          userData?.sub_role === "coordenador" ? "Coordenadores" : "Usuário",
        multi_select: {
          contains: userData?.user,
        },
      },
      secondaryDefaultFilterObject,
    ],
  };

  /*  ====> mutations <==== */

  /*AVISO: essa área de mutations sofreu uma alteração de queries dinâmicas para uma query
    estática. Qualquer problema causado por essa mudança, favor, alterar somente o conteúdo referente
    a queryKey de ['notion_list'] para paramsObj.queryKeyList, para que esta volte a ser dinâmica. */

  const deleteMutation = useMutation({
    mutationFn: async (paramsObj: {
      pageIds: string[];
      queryKeyList: string[];
    }) => {
      const response = await api.patch(
        "api/notion-api/page/bulk-action/visibility/",
        {
          page_ids: paramsObj.pageIds,
          archived: true,
        },
      );

      if (response.status !== 202) {
        throw new Error("Houve um erro ao tentar arquivar os dados");
      }
      return response.data;
    },
    onMutate: async (paramsObj: { pageIds: string[]; queryKeyList: any[] }) => {
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      queryClient.setQueryData(["notion_list"], (old: any) => {
        return {
          ...old,
          results: old.results.filter(
            (item: any) => !paramsObj.pageIds.includes(item.id),
          ),
        };
      });
      setArchivedOficios(
        previousData?.results.filter((item: any) =>
          paramsObj.pageIds.includes(item.id),
        ),
      );
      return { previousData };
    },
    onError: (err, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao arquivar os dados");
    },
    onSuccess: (data, paramsObj) => {
      toast(
        `${paramsObj.pageIds.length > 1 ? `${paramsObj.pageIds.length} extratos arquivados!` : "Extrato arquivado!"}`,
        {
          classNames: {
            toast: "dark:bg-form-strokedark",
            title: "dark:text-snow",
            description: "dark:text-snow",
            actionButton: "!bg-slate-100 dark:bg-form-strokedark",
          },
          action: {
            label: "Desfazer",
            onClick: () => {
              handleUnarchiveExtrato(["notion_list"]);
            },
          },
        },
      );
      setCheckedList([]);
    },
  });

  const undeleteMutation = useMutation({
    mutationFn: async (paramsObj: {
      pageIds: string[];
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        "api/notion-api/page/bulk-action/visibility/",
        {
          page_ids: paramsObj.pageIds,
          archived: false,
        },
      );

      if (response.status !== 202) {
        throw new Error("Houve um erro ao tentar arquivar os dados");
      }
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      queryClient.setQueryData(["notion_list"], (old: any) => {
        return { ...old, results: [...archivedOficios, ...old.results] };
      });
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao desarquivar os dados");
    },
    onSuccess: (data, paramsObj) => {
      toast(
        `${paramsObj.pageIds.length > 1 ? `${paramsObj.pageIds.length} extratos desarquivados!` : "Extrato desarquivado!"}`,
        {
          classNames: {
            toast: "dark:bg-form-strokedark",
            title: "dark:text-snow",
            description: "dark:text-snow",
            actionButton: "!bg-slate-100 dark:bg-form-strokedark",
          },
          action: {
            label: "Fechar",
            onClick: () => {
              toast.dismiss();
            },
          },
        },
      );
      setArchivedOficios([]);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      status: statusOficio;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          Status: {
            status: {
              name: `${paramsObj.status}`,
            },
          },
        },
      );
      if (response.status !== 202) {
        throw new Error("Houve um erro ao alterar o status");
      }
      return response.data;
    },
    onMutate: async (paramsObj: {
      page_id: string;
      status: statusOficio;
      queryKeyList: any[];
    }) => {
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      queryClient.setQueryData(["notion_list"], (old: any) => {
        return {
          ...old,
          results: old.results.map((item: any) => {
            if (item.id === paramsObj.page_id) {
              item.properties.Status.status.name = paramsObj.status;
            }
            return item;
          }),
        };
      });
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o status do ofício");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notion_list"] });
    },
  });

  const tipoMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      oficio: tipoOficio;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          Tipo: {
            select: {
              name: `${paramsObj.oficio}`,
            },
          },
        },
      );

      if (response.status !== 202) {
        throw new Error("houve um erro ao salvar os dados no notion");
      }
      return response.data;
    },
    onMutate: async (paramsObj: {
      page_id: string;
      oficio: tipoOficio;
      queryKeyList: any[];
    }) => {
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      queryClient.setQueryData(["notion_list"], (old: any) => {
        return {
          ...old,
          results: old.results.map((item: any) => {
            if (item.id === paramsObj.page_id) {
              item.properties.Tipo.select = {
                name: paramsObj.oficio,
              };
            }
            return item;
          }),
        };
      });
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o tipo do ofício");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notion_list"] });
    },
  });

  const creditorNameMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      value: string;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          Credor: {
            title: [
              {
                text: {
                  content: paramsObj.value,
                },
              },
            ],
          },
        },
      );
      if (response.status !== 202) {
        throw new Error("houve um erro ao salvar os dados no notion");
      }
      return response.data;
    },
    onMutate: async (paramsObj) => {
      setUpdateState("pending");
      setEditLock(true);
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      queryClient.setQueryData(["notion_list"], (old: any) => {
        return {
          ...old,
          results: old?.results?.map((item: any) => {
            if (item.id === paramsObj.page_id) {
              item.properties.Credor.title[0].text.content = paramsObj.value;
            }
            return item;
          }),
        };
      });
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o nome do credor");
      setUpdateState("error");
    },
    onSuccess: () => {
      setUpdateState("success");
      queryClient.invalidateQueries({ queryKey: ["notion_list"] });
    },
    onSettled: () => {
      const timeOut = setTimeout(() => {
        setEditableLabel((prevObj) => {
          return {
            ...prevObj,
            id: "",
            nameCredor: false,
          };
        });
        setUpdateState(null);
        setEditLock(false);
      }, 1500);
      return () => clearTimeout(timeOut);
    },
  });

  const phoneNumberMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      type: string;
      value: string;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          [paramsObj.type]: {
            phone_number: paramsObj.value,
          },
        },
      );
      if (response.status !== 202) {
        console.error("houve um erro ao salvar os dados no notion");
      }
      return response.data;
    },
    onMutate: async () => {
      setUpdateState("pending");
      setEditLock(true);
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o contato");
      setUpdateState("error");
    },
    onSuccess: () => {
      setUpdateState("success");
    },
    onSettled: () => {
      const timeOut = setTimeout(() => {
        setEditableLabel((prevObj) => {
          return {
            ...prevObj,
            id: "",
            phone: {
              one: false,
              two: false,
              three: false,
            },
          };
        });
        setUpdateState(null);
        setEditLock(false);
      }, 1500);
      return () => clearTimeout(timeOut);
    },
  });

  const emailMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      value: string;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          "Contato de E-mail": {
            email: paramsObj.value,
          },
        },
      );
      if (response.status !== 202) {
        console.error("houve um erro ao salvar os dados no notion");
      }
      return response.data;
    },
    onMutate: async () => {
      setEditLock(true);
      setUpdateState("pending");
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      setUpdateState("error");
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o email");
    },
    onSuccess: () => {
      setUpdateState("success");
    },
    onSettled: () => {
      const timeOut = setTimeout(() => {
        setEditableLabel((prevObj) => {
          return {
            ...prevObj,
            id: "",
            email: false,
          };
        });
        setUpdateState(null);
        setEditLock(false);
      }, 1500);
      return () => clearTimeout(timeOut);
    },
  });

  const proposalPriceMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      value: number;
      queryKeyList: any[];
    }) => {
      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          "Preço Proposto": {
            number: paramsObj.value,
          },
        },
      );
      if (response.status !== 202) {
        throw new Error("houve um erro ao salvar os dados no notion");
      }
      return response.data;
    },
    onMutate: async () => {
      setUpdateState("pending");
      setEditLock(true);
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      setUpdateState("error");
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar o preço proposto");
    },
    onSuccess: () => {
      setUpdateState("success");
      queryClient.invalidateQueries({ queryKey: ["notion_list"] });
    },
    onSettled: () => {
      const timeOut = setTimeout(() => {
        setEditableLabel((prevObj) => {
          return {
            ...prevObj,
            id: "",
            proposalPrice: false,
          };
        });
        setUpdateState(null);
        setEditLock(false);
      }, 1500);
      return () => clearTimeout(timeOut);
    },
  });

  const fupDateMutation = useMutation({
    mutationFn: async (paramsObj: {
      page_id: string;
      value: string;
      type: string;
      queryKeyList: any[];
    }) => {
      const dateObject = {
        end: null,
        start: paramsObj.value,
        time_zone: null,
      };

      const response = await api.patch(
        `api/notion-api/update/${paramsObj.page_id}/`,
        {
          [paramsObj.type]: {
            date: dateObject,
          },
        },
      );

      if (response.status !== 202) {
        throw new Error("houve um erro ao salvar os dados no notion");
      }

      return response.data;
    },
    onMutate: async () => {
      setUpdateState("pending");
      setEditLock(true);
      await queryClient.cancelQueries({ queryKey: ["notion_list"] });
      const previousData: any = queryClient.getQueryData(["notion_list"]);
      return { previousData };
    },
    onError: (error, paramsObj, context) => {
      setUpdateState("error");
      queryClient.setQueryData(["notion_list"], context?.previousData);
      toast.error("Erro ao alterar a data de follow up");
    },
    onSuccess: () => {
      setUpdateState("success");
    },
    onSettled: () => {
      const timeOut = setTimeout(() => {
        setEditableLabel((prevObj) => {
          return {
            ...prevObj,
            id: "",
            fup: {
              first: false,
              second: false,
              third: false,
              fourth: false,
              fifth: false,
            },
          };
        });
        setUpdateState(null);
        setEditLock(false);
      }, 1500);
      return () => clearTimeout(timeOut);
    },
  });

  /*  ====> Functions <==== */


  const handleSelectRow = (item: NotionPage) => {
    if (checkedList.length === 0) {
      setCheckedList([item]);
      return;
    }

    const alreadySelected = checkedList.some((target) => target.id === item.id);

    if (alreadySelected) {
      setCheckedList(checkedList.filter((target) => target.id !== item.id));
    } else {
      setCheckedList([...checkedList, item]);
    }
  };

  const handleSelectAllRows = (list: NotionPage[]) => {
    setCheckedList(list.map((item: NotionPage) => item));
  };

  const handleUnarchiveExtrato = async (queryKeyList: string[]) => {
    const pageIds = archivedOficios.map((notionPage) => notionPage.id);
    await undeleteMutation.mutateAsync({
      pageIds,
      queryKeyList,
    });
  };

  const handleCopyValue = (index: number) => {
    navigator.clipboard.writeText(
      numberFormat(
        data.results[index].properties["Valor Líquido"].formula?.number || 0,
      ),
    );

    toast("Valor copiado para área de transferência.", {
      classNames: {
        toast: "dark:bg-form-strokedark",
        title: "dark:text-snow",
        description: "dark:text-snow",
        actionButton: "!bg-slate-100 dark:bg-form-strokedark",
      },
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  const handleEditInput = (index: number, refList: HTMLDivElement[] | null) => {
    if (refList) {
      refList[index].focus();
    }
  };

  const handleArchiveExtrato = async (queryKeyList: any[]) => {
    setArchiveStatus(true);
    const pageIds = checkedList.map((notionPage) => notionPage.id);
    await deleteMutation.mutateAsync({
      pageIds,
      queryKeyList,
    });
    setArchiveStatus(false);
  };

  const handleEditStatus = async (
    page_id: string,
    status: statusOficio,
    queryKeyList: any[],
  ) => {
    await statusMutation.mutateAsync({
      page_id,
      status,
      queryKeyList,
    });
  };

  const handleEditTipoOficio = async (
    page_id: string,
    oficio: tipoOficio,
    queryKeyList: any[],
  ) => {
    await tipoMutation.mutateAsync({
      page_id,
      oficio,
      queryKeyList,
    });
  };

  const handleChangeCreditorName = async (
    value: string,
    page_id: string,
    queryKeyList: any[],
  ) => {
    await creditorNameMutation.mutateAsync({
      page_id,
      value,
      queryKeyList,
    });
  };

  const handleChangePhoneNumber = async (
    page_id: string,
    type: string,
    value: string,
    queryKeyList: any[],
  ) => {
    await phoneNumberMutation.mutateAsync({
      page_id,
      type,
      value,
      queryKeyList,
    });
  };

  const handleChangeEmail = async (
    page_id: string,
    value: string,
    queryKeyList: any[],
  ) => {
    await emailMutation.mutateAsync({
      page_id,
      value,
      queryKeyList,
    });
  };

  const handleChangeProposalPrice = async (
    page_id: string,
    value: string,
    queryKeyList: any[],
  ) => {
    const formatedValue = value.replace(/[^0-9,]/g, "");
    const valueToNumber = parseFloat(formatedValue);
    await proposalPriceMutation.mutateAsync({
      page_id,
      value: valueToNumber,
      queryKeyList,
    });
  };

  const handleChangeFupDate = async (
    page_id: string,
    value: string,
    type: string,
    queryKeyList: any[],
  ) => {
    if (/^[0-9/]{10}$/.test(value)) {
      const parsedValue = value.split("/").reverse().join("-");
      await fupDateMutation.mutateAsync({
        page_id,
        value: parsedValue,
        type,
        queryKeyList,
      });
    } else {
      console.error("um campo de data precisa de 8 caracteres");
    }
  };

  const handleFilterByTipoOficio = (oficio: tipoOficio) => {
    setOficioSelectValue(oficio);
    setListQuery(
      userData?.sub_role === "coordenador"
        ? {
            and: [
              {
                property: "Coordenadores",
                multi_select: {
                  contains: userData?.user,
                },
              },
              {
                property: "Usuário",
                multi_select: {
                  contains: selectedUser || "",
                },
              },
              {
                property: "Status",
                status: {
                  equals: statusSelectValue || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficio,
                },
              },
              secondaryDefaultFilterObject,
            ],
          }
        : {
            and: [
              {
                property: "Usuário",
                multi_select: {
                  contains: selectedUser || userData?.user,
                },
              },
              {
                property: "Status",
                status: {
                  equals: statusSelectValue || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficio || "",
                },
              },
              secondaryDefaultFilterObject,
            ],
          },
    );
  };

  const handleFilterByStatus = (status: statusOficio) => {
    setFilteredStatusValues(ENUM_OFICIOS_LIST);
    setStatusSelectValue(status);
    setListQuery(
      userData?.sub_role === "coordenador"
        ? {
            and: [
              {
                property: "Coordenadores",
                multi_select: {
                  contains: userData?.user,
                },
              },
              {
                property: "Usuário",
                multi_select: {
                  contains: selectedUser || "",
                },
              },
              {
                property: "Status",
                status: {
                  equals: status || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficioSelectValue || "",
                },
              },
              secondaryDefaultFilterObject,
            ],
          }
        : {
            and: [
              {
                property: "Usuário",
                multi_select: {
                  contains: selectedUser || userData?.user,
                },
              },
              {
                property: "Status",
                status: {
                  equals: status || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficioSelectValue || "",
                },
              },
              secondaryDefaultFilterObject,
            ],
          },
    );
  };

  const handleFilterByUser = (user: string) => {
    setSelectedUser(user);
    setFilteredUsersList(usersList);
    setListQuery(
      userData?.sub_role === "coordenador"
        ? {
            and: [
              {
                property: "Coordenadores",
                multi_select: {
                  contains: userData?.user,
                },
              },
              {
                property: "Usuário",
                multi_select: {
                  contains: user,
                },
              },
              {
                property: "Status",
                status: {
                  equals: statusSelectValue || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficioSelectValue || "",
                },
              },
              secondaryDefaultFilterObject,
            ],
          }
        : {
            and: [
              {
                property: "Usuário",
                multi_select: {
                  contains: user,
                },
              },
              {
                property: "Status",
                status: {
                  equals: statusSelectValue || "",
                },
              },
              {
                property: "Tipo",
                select: {
                  equals: oficioSelectValue || "",
                },
              },
              secondaryDefaultFilterObject,
            ],
          },
    );
  };

  const handleCleanAllFilters = () => {
    setStatusSelectValue(null);
    setOficioSelectValue(null);
    setSelectedUser(null);
    setListQuery(defaultFilterObject);
  };

  // estou repetindo essa função em outro componente. apagar depois
  const searchStatus = (value: string) => {
    if (!value) {
      setFilteredStatusValues(ENUM_OFICIOS_LIST);
      return;
    }
    setFilteredStatusValues(
      ENUM_OFICIOS_LIST.filter((status) =>
        status.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  // estou repetindo essa função em outro componente. apagar depois
  const searchUser = (value: string) => {
    if (!value) {
      setFilteredUsersList(usersList);
      return;
    }
    setFilteredUsersList(
      usersList.filter((user) =>
        user.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  /*  ====> Effects <==== */
  // atualiza a queryList
  // useEffect(() => {
  //   if (userData) {
  //     const updatedQuery =
  //       userData?.sub_role === "coordenador"
  //         ? buildQueryForCoordinatorOnly()
  //         : buildQueryForUserOnly();
  //     setListQuery(updatedQuery);

  //     if (Object.keys(updatedQuery).length > 0) {
  //       refetch();
  //     }
  //   }
  // }, [userData?.user, statusSelectValue, oficioSelectValue, selectedUser]);

  // atualiza o state do listQuery quando renderiza o contexto
  // useEffect(() => {
  //   if (userData && listQuery === null) {
  //     const defaultQuery = buildQueryForUserOnly();
  //     setListQuery(defaultQuery);

  //     if (Object.keys(defaultQuery).length > 0) {
  //       refetch();
  //     }
  //   }
  // }, []);

  // seta a lista de usuários se a role do usuário for ativos
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching users list");
      if (userData?.role === "ativos" && saveInfoToNotion && usersList.length === 0) {
        const [usersList] = await Promise.all([
          api.get("/api/notion-api/list/users/"),
        ]);
        if (usersList.status === 200) {
          setUsersList(usersList.data);
          setFilteredUsersList(usersList.data);
        }
      }
    };

    fetchData();
  }, [saveInfoToNotion, userData?.role, usersList.length]);

  return (
    <TableNotionContext.Provider
      value={{
        data,
        userData,
        isFetching,
        statusSelectValue,
        oficioSelectValue,
        editableLabel,
        setEditableLabel,
        usersList,
        checkedList,
        setUsersList,
        filteredUsersList,
        setFilteredUsersList,
        isEditing,
        setIsEditing,
        handleSelectRow,
        handleSelectAllRows,
        handleCopyValue,
        handleEditInput,
        handleArchiveExtrato,
        handleEditStatus,
        setListQuery,
        handleEditTipoOficio,
        handleChangeCreditorName,
        handleChangePhoneNumber,
        handleChangeEmail,
        handleChangeProposalPrice,
        handleChangeFupDate,
        handleFilterByTipoOficio,
        handleFilterByUser,
        handleCleanAllFilters,
        searchStatus,
        searchUser,
        handleFilterByStatus,
        selectedUser,
        setCheckedList,
        updateState,
        archiveStatus,
        editLock,
        setSaveInfoToNotion
      }}
    >
      {children}
    </TableNotionContext.Provider>
  );
};
