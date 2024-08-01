
import api from "@/utils/api";
import { Suspense, useEffect, useRef, useState } from "react";
import UseMySwal from "@/hooks/useMySwal";
import { AwesomeDrawer } from "../Drawer/Drawer";
import DeleteExtractAlert from "../Modals/DeleteExtract";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import Loader from "../common/Loader";
import TableView from "./TableView";
import CardView from "./CardView";
import { PaginatedResponse, TaskDrawer } from "../TaskElements";
import { PiGridFour, PiTable } from "react-icons/pi";
import statusOficio from "@/enums/statusOficio.enum";
import Filters from "../Filters";
import { useFilter } from "@/hooks/useFilter";

export type LocalShowOptionsProps = {
  key: string;
  active: boolean;
}

export type LocalExtractViewProps = {
  type: string;
}

type ExtratosTableProps = {
  newItem: CVLDResultProps[];
}

export function ExtratosTable({ newItem }: ExtratosTableProps) {

  const mySwal = UseMySwal();

  // states
  const [data, setData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
  const [auxData, setAuxData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
  const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
  const [oficioSelectValue, setOficioSelectValue] = useState<string | null>(null);
  const [item, setItem] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [viewOption, setViewOption] = useState<LocalExtractViewProps>({
    type: 'table'
  });
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);
  const [showModalMessage, setShowModalMessage] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [extratoId, setExtractId] = useState<string>("");
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false);
  const [openTaskDrawer, setOpenTaskDrawer] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalOptions, setModalOptions] = useState({
    open: false,
    extractId: ''
  });
  const { filterData, resetFilters } = useFilter(data, setData, setStatusSelectValue, setOficioSelectValue, auxData, statusSelectValue, oficioSelectValue);

  // refs
  const viewModeRef = useRef<HTMLSelectElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const response = await api.get("api/extratos/");
    setData(response.data);
    setLoading(false);
  }

  const onPageChange = async (page: number) => {
    if (page === currentPage) return;
    setLoading(true);
    const response = await api.get(`api/extratos/?page=${page}`);
    setData(response.data);
    setLoading(false);
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

      setData({ results: data.results.filter((item) => item.id !== id), count: data.count, next: data.next, previous: data.previous });
      setCheckedList([]);
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
      setOpenDetailsDrawer(!openDetailsDrawer);
      setLoading(false);
      return;
    }

    setItem((await api.get(`api/extrato/${id}/`)).data);
    setLastId(id);


    setLoading(false);

  }

  const fetchStateFromLocalStorage = () => {
    const configs = localStorage.getItem("dont_show_again_configs");
    if (configs !== null) {
      const parsedValue = JSON.parse(configs);
      setLocalShowOptions(parsedValue);
      localShowOptions.forEach(element => {
        if (element.key === "show_delete_extract_alert") {
          setShowModalMessage(!element.active)
        }
      });
    }

    // fetching the view mode configs
    const viewMode = localStorage.getItem("extract_list_view_mode");
    if (viewMode !== null) {
      const parsedValue = JSON.parse(viewMode);
      setViewOption(parsedValue);
      if (viewModeRef.current) {
        viewModeRef.current.value = parsedValue.type;
      }
    }
  }

  const setDontShowAgainDeleteExtractAlert = (key: string): void => {
    /* setting key on localStorage if don't exist.
      if exist, update localOptions w/ preferences value
    */
    if (!localStorage.getItem("dont_show_again_configs")) {
      const config = {
        key: key,
        active: true
      }
      localStorage.setItem("dont_show_again_configs", JSON.stringify([config]));
      const configs = localStorage.getItem("dont_show_again_configs");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        setLocalShowOptions(parsedValue);
      }
    } else {
      const configs = localStorage.getItem("dont_show_again_configs");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        parsedValue.forEach((item: LocalShowOptionsProps) => {
          if (item.key === key) {
            item.active = item.active ? false : true;
          }
        })
        localStorage.setItem("dont_show_again_configs", JSON.stringify(parsedValue));
        setLocalShowOptions(parsedValue);
      }
    }
  }

  const setExtractListView = (type: string): void => {
    if (!localStorage.getItem("extract_list_view_mode")) {

      const config: LocalExtractViewProps = {
        type: type
      }
      localStorage.setItem("extract_list_view_mode", JSON.stringify(config));
      const configs = localStorage.getItem("extract_list_view_mode");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        setViewOption(parsedValue);
      }

    } else {

      const configs = localStorage.getItem("extract_list_view_mode");
      if (configs !== null) {
        const parsedValue = JSON.parse(configs);
        parsedValue.type = type;
        localStorage.setItem("extract_list_view_mode", JSON.stringify(parsedValue));
        setViewOption(parsedValue);
      }

    }
  }

  const callScrollTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    fetchData();
    fetchStateFromLocalStorage();
  }, []);


  useEffect(() => {
    if (localShowOptions.length <= 0) return;

    localShowOptions.forEach(element => {
      if (element.key === "show_delete_extract_alert") {
        setShowModalMessage(!element.active)
      }
    });
  }, [localShowOptions]);

  useEffect(() => {
    if (auxData.results.length === 0 && data.results.length > 0) {
      setAuxData(data)
    }
  }, [data]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      results: [...newItem, ...prevData.results]
    }));
  }, [newItem]);


  return (
    <div
      ref={mainRef}
      className="overflow-x-auto">
      {window.innerWidth >= 435 ? (
        <>
          {/* desktop view */}
          <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full h-full items-center justify-between">

                {/* filters */}
                <Filters
                  resetFilters={resetFilters}
                  filterData={filterData}
                  statusSelectValue={statusSelectValue}
                  oficioSelectValue={oficioSelectValue}
                  setStatusSelectValue={setStatusSelectValue}
                  setOficioSelectValue= {setOficioSelectValue}
                />
                {/* end filters */}

                {/* alternate between view extract mode */}
                <div className="flex items-center gap-1">
                  <div
                    title="Mudar para visualização tabela"
                    onClick={() => setExtractListView("table")}
                    className={`flex w-7 h-7 items-center justify-center rounded-full ${viewOption.type === "table" && "bg-slate-200 dark:bg-slate-600"} hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 cursor-pointer group`}>
                    <PiTable className="text-xl group-hover:text-black-2 dark:group-hover:text-white" />
                  </div>

                  {/* separator */}
                  <div className="w-px mx-1 h-5 bg-zinc-300 dark:bg-form-strokedark"></div>
                  {/* separator */}

                  <div
                    title="Mudar para visualização cards"
                    onClick={() => setExtractListView("cards")}
                    className={`flex w-7 h-7 items-center justify-center rounded-full ${viewOption.type === "cards" && "bg-slate-200 dark:bg-slate-600"} hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 cursor-pointer group`}>
                    <PiGridFour className="text-xl group-hover:text-black-2 dark:group-hover:text-white" />
                  </div>
                </div>
                {/* end alternate between view extract mode */}
              </div>
            </div>
            {viewOption.type === "table" &&
              <TableView
                data={data}
                setData={setData}
                showModalMessage={showModalMessage}
                loading={loading}
                setModalOptions={setModalOptions}
                fetchDelete={fetchDelete}
                setOpenDetailsDrawer={setOpenDetailsDrawer}
                setOpenTaskDrawer={setOpenTaskDrawer}
                setExtractId={setExtractId}
                fetchDataById={fetchDataById}
                count={data.count}
                onPageChange={(page) => onPageChange(page)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                callScrollTop={callScrollTop}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
              />
            }
            {viewOption.type === "cards" &&
              <CardView
                data={data}
                setData={setData}
                showModalMessage={showModalMessage}
                loading={loading}
                setModalOptions={setModalOptions}
                fetchDelete={fetchDelete}
                setOpenDetailsDrawer={setOpenDetailsDrawer}
                setOpenTaskDrawer={setOpenTaskDrawer}
                setExtractId={setExtractId}
                fetchDataById={fetchDataById}
                count={data.count}
                onPageChange={(page) => onPageChange(page)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                callScrollTop={callScrollTop}
              />
            }
          </div>
          {/* end desktop view */}
        </>
      ) : (
        /* mobile view */
        <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">
          <h3 className="text-center text-2xl font-bold dark:text-white pb-1 mb-6 border-b border-stroke dark:border-strokedark">
            EXTRATOS
          </h3>
          <CardView
            className="grid gap-4"
            data={data}
            setData={setData}
            showModalMessage={showModalMessage}
            loading={loading}
            setModalOptions={setModalOptions}
            fetchDelete={fetchDelete}
            setOpenDetailsDrawer={setOpenDetailsDrawer}
            setOpenTaskDrawer={setOpenTaskDrawer}
            setExtractId={setExtractId}
            fetchDataById={fetchDataById}
            count={data.count}
            onPageChange={(page) => onPageChange(page)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            callScrollTop={callScrollTop}
          />
        </div>
        /* end mobile view */
      )}
      <Suspense fallback={<Loader />}>
        <AwesomeDrawer data={item} loading={loading} setData={setItem} open={openDetailsDrawer} setOpen={setOpenDetailsDrawer} />
        <TaskDrawer id={extratoId} open={openTaskDrawer} setOpen={setOpenTaskDrawer} />
      </Suspense>
      {showModalMessage && (
        <DeleteExtractAlert
          response={responseStatus}
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
