
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

  const [data, setData] = useState<PaginatedResponse<CVLDResultProps>>({ count: 0, next: "", previous: "", results: [] });
  const [item, setItem] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [viewOption, setViewOption] = useState<LocalExtractViewProps>({
    type: 'table'
  });
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);
  const [showModalMessage, setShowModalMessage] = useState<boolean>(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [extratoId, setExtractId] = useState<string>("");
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false);
  const [openTaskDrawer, setOpenTaskDrawer] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState({
    open: false,
    extractId: ''
  });
  const viewModeRef = useRef<HTMLSelectElement | null>(null);

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

      setData(prevData => ({
        ...prevData,
        results: prevData.results.filter((item) => item.id !== id)
      }));
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
    console.log(loading);

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
    setData({ ...data, results: [...newItem, ...data.results] });
  }, [newItem])

  return (
    <div className="overflow-x-auto">
      {window.innerWidth >= 435 ? (
        <>
          {/* desktop view */}
          <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">
            <div className="flex flex-col items-center gap-4">
              <h3 className="w-full text-2xl font-bold text-center pb-2 border-b border-stroke dark:border-strokedark dark:text-white">
                EXTRATOS
              </h3>
              <div className="flex w-full items-center justify-end gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <label htmlFor="tableView" className="text-sm">tipo de visualização:</label>
                  <select ref={viewModeRef} name="tableView" id="tableView" className="p-0 pl-3 text-sm rounded-md dark:bg-boxdark" onChange={(e) => setExtractListView(e.target.value)}>
                    <option value="table">tabela</option>
                    <option value="cards">cards</option>
                  </select>
                </div>
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
              />
            }
            {viewOption.type === "cards" &&
              <CardView
                className="flex justify-center"
                data={data}
                setData={setData}
                showModalMessage={showModalMessage}
                loading={loading}
                setModalOptions={setModalOptions}
                fetchDelete={fetchDelete}
                setOpenDetailsDrawer={setOpenDetailsDrawer}
                setOpenTaskDrawer={setOpenTaskDrawer} // ainda não utilizado
                setExtractId={setExtractId} // ainda não utilizado
                fetchDataById={fetchDataById}
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
            setOpenTaskDrawer={setOpenTaskDrawer} // ainda não utilizado
            setExtractId={setExtractId} // ainda não utilizado
            fetchDataById={fetchDataById}
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
