
import numberFormat from "@/functions/formaters/numberFormat";
import api from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, CustomFlowbiteTheme, Flowbite, Badge } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import UseMySwal from "@/hooks/useMySwal";
import dateFormater from "@/functions/formaters/dateFormater";
import { BsFillTrashFill } from "react-icons/bs";
import { AwesomeDrawer } from "../Drawer/Drawer";
import DeleteExtractAlert from "../Modals/DeleteExtract";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import { BiTask } from "react-icons/bi";
import Loader from "../common/Loader";

const customTheme: CustomFlowbiteTheme = {
  table: {
    root: {
      base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
      shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-white drop-shadow-md dark:bg-black",
      wrapper: "relative"
    },
    body: {
      base: "group/body",
      cell: {
        base: "px-4 py-3 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg dark:bg-boxdark dark:text-white border-b border-gray dark:border-gray"
      }
    },
    head: {
      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "bg-stone-300 text-black px-4 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-boxdark dark:text-white dark:border-b dark:border-gray"
      }
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped: "odd:bg-white even:bg-green-300 odd:dark:bg-gray-800 even:dark:bg-gray-700"
    }
  }
}

type LocalValueProps = {
  key: string;
  active: boolean;
}

type ExtratosTableProps = {
  newItem: CVLDResultProps[];
}

export function ExtratosTable({ newItem }: ExtratosTableProps) {

  const mySwal = UseMySwal();

  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState<any>({});
  const [loading, setLoading] =  useState<boolean>(false);
  const [responseStaus, setResponseStatus] = useState<string>('');
  const [localValue, setLocalValue] = useState<LocalValueProps[]>([]);
  const [showModalMessage, setShowModalMessage] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState({
    open: false,
    extractId: ''
  });

  const fetchData = async () => {
    const response = await api.get("api/extratos/");
    setData(response.data);
  }

  const fetchDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`api/extrato/delete/${id}/`);
      if (showModalMessage) {
        setResponseStatus('ok');
      } else {
        mySwal.fire({
          toast: true,
          text: "Extrato excluído com sucesso!",
          icon: "success",
          position: "bottom-right",
          timer: 2000,
          showConfirmButton: false
        })
      }

      setData(data.filter((item) => item.id !== id));
      return response;
    } catch (error) {
      if (showModalMessage) {
        setResponseStatus('error');
      } else {
        mySwal.fire({
          toast: true,
          text: "Houve um erro ao excluir o extrato",
          icon: "error",
          position: "bottom-right",
          timer: 2000,
          showConfirmButton: false
        })
      }
    } finally {
      setLoading(false);
    }
  }

  const fetchDataById = async (id: string) => {
    setLoading(true);
    if (lastId === id) {
      setOpenDrawer(!openDrawer);
      setLoading(false);
      return;
    }
    const response = await api.get(`api/extrato/${id}/`);
    setItem(response.data);
    setLastId(id);
    setLoading(false);
  }

  const fetchStateFromLocalStorage = () => {
    const configs = localStorage.getItem("dont_show_again_configs");
    if (configs !== null) {
      const parsedValue = JSON.parse(configs);
      setLocalValue(parsedValue);
      localValue.forEach(element => {
        if (element.key === "show_delete_extract_alert") {
          setShowModalMessage(!element.active)
        }
      });
    }
  }

  useEffect(() => {
    fetchData();
    fetchStateFromLocalStorage();
  }, []);


  useEffect(() => {
    if (localValue.length <= 0) return;

    localValue.forEach(element => {
      if (element.key === "show_delete_extract_alert") {
        setShowModalMessage(!element.active)
      }
    });
  }, [localValue]);

    useEffect(() => {
        setData([...newItem, ...data])
    }, [newItem])

  const setDontShowAgainDeleteExtractAlert = (key: string): void => {

    if (!localStorage.getItem("dont_show_again_configs")) {
      const config = {
        key: key,
        active: true
      }
      localStorage.setItem("dont_show_again_configs", JSON.stringify([config]));
      const configs = localStorage.getItem("dont_show_again_configs");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        setLocalValue(parsedValue);
      }
    } else {
      const configs = localStorage.getItem("dont_show_again_configs");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        for (const item of parsedValue) {
          if (item.key === key) {
            item.active = item.active ? false : true;
          }
        }
        localStorage.setItem("dont_show_again_configs", JSON.stringify(parsedValue));
        setLocalValue(parsedValue);
      }
    }
  }

  return (
    <div className="overflow-x-auto">
      <Flowbite theme={{ theme: customTheme }}>
        <Table hoverable className="">
          <TableHead>
            <TableHeadCell className="text-center w-[120px]">Oficio</TableHeadCell>
            <TableHeadCell className="text-center">Nome do Credor</TableHeadCell>
            <TableHeadCell className="text-center w-[180px]">Valor Líquido</TableHeadCell>
            <TableHeadCell className="text-center w-[140px]">Status</TableHeadCell>
            <TableHeadCell className="text-center w-[120px]">
              <span className="sr-only text-center">Tarefas</span>
            </TableHeadCell>
            <TableHeadCell className="text-center w-[40px]">
              <span className="sr-only text-center">Detalhes</span>
            </TableHeadCell>
            <TableHeadCell className="text-center w-[40px]">
              <span className="sr-only text-center ">Detalhes</span>
            </TableHeadCell>
          </TableHead>
          <TableBody>
            {data?.map((item: CVLDResultProps) => (

              <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                    {item.tipo_do_oficio.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold text-[12px]">{item?.credor.toUpperCase() || ""}</TableCell>
                <TableCell className="text-center font-semibold text-[12px]">{numberFormat(item.valor_liquido_disponivel)}</TableCell>
                <TableCell className="text-center items-center">
                  <Badge color="teal" size="sm" className="max-w-max text-center text-[12px]">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{
                  <Badge aria-disabled size="sm" color="yellow" className="cursor-not-allowed hover:bg-yellow-200 dark:hover:bg-yellow-400 transition-all duration-300 justify-center">
                    <div className="flex flex-row w-full justify-between items-baseline align-middle gap-1">
                    <span className="text-[12px] font-medium text-gray-900 dark:text-prussianBlue">
                      TAREFA
                    </span>
                <BiTask className="text-green-700 hover:text-green-950 dark:text-prussianBlue dark:hover:text-stone-300 h-4 w-4 self-center transition-all duration-300" />
                  </div>
                </Badge>}
                </TableCell>
                <TableCell className="text-center">
                  {showModalMessage ? (
                    <button onClick={() => setModalOptions({
                      open: true,
                      extractId: item.id
                    })} className="bg-transparent border-none flex transition-all duration-300 hover:bg-red-500 text-red-500 hover:text-white dark:hover:text-white dark:text-red-500 dark:hover:bg-red-500">
                      <BsFillTrashFill className="text-meta-1 hover:text-meta-7 dark:text-white dark:hover:text-stone-300 h-4 w-4 self-center" style={{ cursor: loading ? 'wait' : 'pointer' }}/>
                    </button>
                  ) : (
                    <button onClick={() => fetchDelete(item.id)} className="bg-transparent border-none flex transition-all duration-300 hover:bg-red-500 text-red-500 hover:text-white dark:hover:text-white dark:text-red-500 dark:hover:bg-red-500" style={{ cursor: loading ? 'wait' : 'pointer' }}>
                      <BsFillTrashFill className="text-meta-1 hover:text-meta-7 dark:text-white dark:hover:text-stone-300 h-4 w-4 self-center" />
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <button onClick={() => {
                    setOpenDrawer(true);
                    fetchDataById(item.id);
                  }} className="bg-transparent border-none transition-all duration-300 text-primary font-medium hover:text-blue-500 dark:hover:text-white dark:text-blue-500 border border-blue-500 hover:border-transparent">
                    <span className="text-[12px]">
                      DETALHES
                    </span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flowbite>
      <Suspense fallback={<Loader />}>
        <AwesomeDrawer data={item} loading={loading} setData={setItem} open={openDrawer} setOpen={setOpenDrawer} />
      </Suspense>
      {showModalMessage && (
        <DeleteExtractAlert
          response={responseStaus}
          setResponse={setResponseStatus}
          state={modalOptions}
          setState={setModalOptions}
          setDontShowState={setDontShowAgainDeleteExtractAlert}
          deleteExtract={fetchDelete}
        />
      )}
    </div>
  );
}
