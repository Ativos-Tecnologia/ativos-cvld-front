import api from "@/utils/api";
import { Suspense, useEffect, useRef, useState } from "react";
import UseMySwal from "@/hooks/useMySwal";
import { AwesomeDrawer } from "../Drawer/Drawer";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import Loader from "../common/Loader";
import TableView from "./TableView";
import CardView from "./CardView";
import { PaginatedResponse, TaskDrawer } from "../TaskElements";
import { PiGridFour, PiTable } from "react-icons/pi";
import statusOficio from "@/enums/statusOficio.enum";
import Filters, { ActiveState } from "../Filters";
import { useFilter } from "@/hooks/useFilter";
import DeleteExtractAlert from "../Modals/DeleteExtract";
import { toast } from "sonner";
import { MiniMenu } from "./MiniMenu";
import { TableTabs } from "../TableTabs";

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

export type Tabs = 'GERAL' | 'ARQUIVADOS';

export function ExtratosTable({ newItem }: ExtratosTableProps) {

  const mySwal = UseMySwal();

  // states
  const [data, setData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
  const [auxData, setAuxData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
  const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
  const [oficioSelectValue, setOficioSelectValue] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ActiveState>('ALL');
  const [activedTab, setActivedTab] = useState<Tabs>('GERAL');
  const [item, setItem] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [viewOption, setViewOption] = useState<LocalExtractViewProps>({
    type: 'table'
  });
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [checkedList, setCheckedList] = useState<CVLDResultProps[] | never[]>([]);
  const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);
  const [showModalMessage, setShowModalMessage] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [extratoId, setExtractId] = useState<string>("");
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false);
  const [openTaskDrawer, setOpenTaskDrawer] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalOptions, setModalOptions] = useState<{ open: boolean, items: CVLDResultProps[] | never[] }>({
    open: false,
    items: []
  });
  const { filterData, resetFilters } = useFilter(data, setData, setStatusSelectValue, setOficioSelectValue, auxData, statusSelectValue, oficioSelectValue);

  // refs
  const viewModeRef = useRef<HTMLSelectElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (query: string) => {
    setLoading(true);
    const response = await api.get(`api/extratos/${query}`);
    setData(response.data);
    setAuxData(response.data);
    setLoading(false);
  }

  const onPageChange = async (page: number) => {
    if (page === currentPage) return;
    setLoading(true);
    const response = await api.get(`api/extratos/?page=${page}`);
    setData(response.data);
    setLoading(false);
  }

  const fetchDelete = async (ids: string[]) => {
    try {
      setLoading(true);
      const response = await api.post(`api/extrato/bulk-action/?action=delete`, {
        ids: ids
      });

      if (showModalMessage) {
        setResponseStatus('ok');
      } else {
        toast(`${ids.length > 1 ? 'Extratos deletados com sucesso!' : 'Extrato deletado com sucesso!'}`, {
          classNames: {
            toast: "dark:bg-form-strokedark",
            title: "dark:text-snow",
            description: "dark:text-snow",
            actionButton: "!bg-slate-100 dark:bg-form-strokedark"
          },
          action: {
            label: "Desfazer",
            onClick: () => handleRestoreData()
          }
        })
      }

      fetchData('');
      setCheckedList([]);

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

  const handleRestoreData = async () => {
    const response = await api.post(`api/extrato/bulk-action/?action=restore-delete`, {
      ids: checkedList.map(item => item.id)
    });

    if (response.status !== 200) {
      console.log('houve um erro ao tentar restaurar os dados');
      return;
    }

    fetchData('');

    if (showModalMessage) {
      setModalOptions({
        open: false,
        items: []
      });
      setResponseStatus('');
      setCheckedList([]);
    }
  }

  const handleUnarchiveExtrato = async () => {
    const response = await api.post(`api/extrato/bulk-action/?action=restore-archive`, {
      ids: checkedList.map(item => item.id)
    });

    if (response.status !== 200) {
      console.log('houve um erro ao tentar desarquivar os dados');
      return;
    }

    if (activedTab === "GERAL") {
      fetchData('');
    } else {

      toast(`${checkedList.length > 1 ? 'Extratos desarquivados!' : 'Extrato desarquivado!'}`, {
        classNames: {
          toast: "dark:bg-form-strokedark",
          title: "dark:text-snow",
          description: "dark:text-snow",
          actionButton: "!bg-slate-100 dark:bg-form-strokedark"
        },
        description: `${checkedList.length > 1 ? 'Os extratos retornaram para a aba GERAL.' : 'O extrato retornou para a aba GERAL.'}`,
        action: {
          label: "Desfazer",
          onClick: () => handleUnarchiveExtrato()
        }
      })

      fetchData('?showMode=archived');
    }
    setCheckedList([]);
  }

  const fetchDataById = async (id: string) => {
    setLoading(true);
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

  const handleSelectAllRows = () => {
    setCheckedList(data.results.map((item: CVLDResultProps) => item))
  }

  const handleDeleteExtrato = () => {
    if (showModalMessage) {
      if (checkedList && checkedList.length >= 1) {
        setModalOptions({
          open: true,
          items: checkedList
        });
      }
    } else {
      if (checkedList && checkedList.length >= 1) {
        fetchDelete(checkedList.map(item => item.id))
      }
    }
  }

  const handleArchieveExtrato = async (ids: string[]) => {
    try {

      const response = await api.post('api/extrato/bulk-action/?action=archive', {
        ids: ids
      });

      toast(`${ids.length > 1 ? 'Extratos movidos para guia arquivados!' : 'Extrato movido para guia arquivados!'}`, {
        classNames: {
          toast: "dark:bg-form-strokedark",
          title: "dark:text-snow",
          description: "dark:text-snow",
          actionButton: "!bg-slate-100 dark:bg-form-strokedark"
        },
        action: {
          label: "Desfazer",
          onClick: () => handleUnarchiveExtrato()
        }
      })

      fetchData('');
      setCheckedList([]);

    } catch (error) {
      console.log('error');
    }
  }

  // - função que seleciona uma linha/card da extratos table
  const handleSelectRow = (item: CVLDResultProps) => {

    if (checkedList.length === 0) {
      setCheckedList([item]);
      return;
    }

    const alreadySelected = checkedList.some(target => target.id === item.id);

    if (alreadySelected) {
      setCheckedList(checkedList.filter(target => target.id !== item.id));
    } else {
      setCheckedList([...checkedList, item]);
    }

    // checkedList.forEach(target => {

    //   console.log(target.id, item.id)

    //   if (target.id === item.id) {
    //     setCheckedList(checkedList.filter(target => target.id !== item.id));
    //   } else {
    //     setCheckedList([...checkedList, item]);
    //   }
    // })

  }

  useEffect(() => {
    fetchData('');
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

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (keyCode !== 46) return;

      if (checkedList.length >= 1) {
        fetchDelete(checkedList.map(item => item.id))
      }

    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div ref={mainRef}
    className="overflow-hidden"
    >
      {window.innerWidth >= 435 ? (
        <>
          {/* desktop view */}
          <div className="p-5 bg-white rounded-sm dark:bg-boxdark">
            <div className="flex flex-col">

              {/* tabs */}
              <TableTabs
                data={data}
                auxData={auxData}
                setData={setData}
                fetchData={fetchData}
                setStatusSelectValue={setStatusSelectValue}
                setOficioSelectValue={setOficioSelectValue}
                statusSelectValue={statusSelectValue}
                oficioSelectValue={oficioSelectValue}
                setActiveFilter={setActiveFilter}
                activedTab={activedTab}
                setActivedTab={setActivedTab}
              />
              {/* end tabs */}

              <div className="flex w-full h-full items-center justify-between">

                {/* filters */}
                <Filters
                  resetFilters={resetFilters}
                  filterData={filterData}
                  statusSelectValue={statusSelectValue}
                  oficioSelectValue={oficioSelectValue}
                  setStatusSelectValue={setStatusSelectValue}
                  setOficioSelectValue={setOficioSelectValue}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
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

              <MiniMenu
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                count={data.count}
                currentPage={currentPage}
                handleDeleteExtrato={handleDeleteExtrato}
                handleSelectAllRows={handleSelectAllRows}
                handleArchieveExtrato={handleArchieveExtrato}
                handleUnarchiveExtrato={handleUnarchiveExtrato}
                activedTab={activedTab}
              />

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
                handleDeleteExtrato={handleDeleteExtrato}
                handleSelectRow={handleSelectRow}
                handleSelectAllRows={handleSelectAllRows}
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
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                handleDeleteExtrato={handleDeleteExtrato}
                handleSelectRow={handleSelectRow}
                handleSelectAllRows={handleSelectAllRows}
              />
            }
          </div>
          {/* end desktop view */}
        </>
      ) : (
        /* mobile view */
        <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">

          <div className="flex flex-col">

            {/* tabs */}
            <TableTabs
              data={data}
              auxData={auxData}
              setData={setData}
              fetchData={fetchData}
              setStatusSelectValue={setStatusSelectValue}
              setOficioSelectValue={setOficioSelectValue}
              statusSelectValue={statusSelectValue}
              oficioSelectValue={oficioSelectValue}
              setActiveFilter={setActiveFilter}
              activedTab={activedTab}
              setActivedTab={setActivedTab}
            />
            {/* end tabs */}

            <div className="flex w-full h-full items-center justify-between">

              {/* filters */}
              <Filters
                resetFilters={resetFilters}
                filterData={filterData}
                statusSelectValue={statusSelectValue}
                oficioSelectValue={oficioSelectValue}
                setStatusSelectValue={setStatusSelectValue}
                setOficioSelectValue={setOficioSelectValue}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
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

            <MiniMenu
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              count={data.count}
              currentPage={currentPage}
              handleDeleteExtrato={handleDeleteExtrato}
              handleSelectAllRows={handleSelectAllRows}
              handleArchieveExtrato={handleArchieveExtrato}
              handleUnarchiveExtrato={handleUnarchiveExtrato}
              activedTab={activedTab}
            />

          </div>

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
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            handleDeleteExtrato={handleDeleteExtrato}
            handleSelectRow={handleSelectRow}
            handleSelectAllRows={handleSelectAllRows}
          />
        </div>
        /* end mobile view */
      )}
      <Suspense fallback={<Loader />}>
        <AwesomeDrawer data={item} loading={loading} setData={setItem} open={openDetailsDrawer} setOpen={setOpenDetailsDrawer} />
        {/* <TaskDrawer id={extratoId} open={openTaskDrawer} setOpen={setOpenTaskDrawer} /> */}
      </Suspense>
      {showModalMessage && (
        <DeleteExtractAlert
          response={responseStatus}
          setResponse={setResponseStatus}
          state={modalOptions}
          setState={setModalOptions}
          setDontShowState={setDontShowAgainDeleteExtractAlert}
          deleteExtract={fetchDelete}
          restoreData={handleRestoreData}
          setCheckedList={setCheckedList}
        />
      )}
    </div>
  );
}
