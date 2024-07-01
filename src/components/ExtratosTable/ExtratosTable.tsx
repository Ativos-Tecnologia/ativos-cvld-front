
import api from "@/utils/api";
import { CustomFlowbiteTheme } from "flowbite-react";
import { Suspense, useEffect, useState } from "react";
import UseMySwal from "@/hooks/useMySwal";
import { AwesomeDrawer } from "../Drawer/Drawer";
import DeleteExtractAlert from "../Modals/DeleteExtract";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import Loader from "../common/Loader";
import TableView from "./TableView";
import CardView from "./CardView";

export type LocalShowOptionsProps = {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [viewOption, setViewOption] = useState<string>('table');
  const [responseStatus, setResponseStatus] = useState<string>('');
  const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);
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
      setLocalShowOptions(parsedValue);
      localShowOptions.forEach(element => {
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
    if (localShowOptions.length <= 0) return;

    localShowOptions.forEach(element => {
      if (element.key === "show_delete_extract_alert") {
        setShowModalMessage(!element.active)
      }
    });
  }, [localShowOptions]);

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
        setLocalShowOptions(parsedValue);
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
        setLocalShowOptions(parsedValue);
      }
    }

  }

  return (
    <div className="overflow-x-auto">
      {window.innerWidth >= 430 ? (
        <>
          {/* desktop view */}
          <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">
            <div className="flex flex-col items-center gap-4">
              <h3 className="w-full font-nexa font-black text-center pb-2 border-b border-stroke dark:border-strokedark dark:text-white">
                EXTRATOS
              </h3>
              <div className="flex w-full items-center justify-end gap-2 mb-5">
                <div className="flex items-center gap-2">
                  <label htmlFor="tableView" className="text-sm">tipo de visualização:</label>
                  <select name="tableView" id="tableView" className="p-0 pl-3 text-sm rounded-sm dark:bg-boxdark" onChange={e => setViewOption(e.target.value)}>
                    <option value="table">tabela</option>
                    <option value="cards">cards</option>
                  </select>
                </div>
              </div>
            </div>
            {viewOption === "table" &&
              <TableView
                data={data}
                showModalMessage={showModalMessage}
                loading={loading}
                setModalOptions={setModalOptions}
                fetchDelete={fetchDelete}
                setOpenDrawer={setOpenDrawer}
                fetchDataById={fetchDataById}
              />
            }
            {viewOption === "cards" &&
              <CardView
                className="flex gap-4 justify-center flex-wrap"
                data={data}
                showModalMessage={showModalMessage}
                loading={loading}
                setModalOptions={setModalOptions}
                fetchDelete={fetchDelete}
                setOpenDrawer={setOpenDrawer}
                fetchDataById={fetchDataById}
              />
            }
          </div>
          {/* end desktop view */}
        </>
      ) : (
        /* mobile view */
        <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">
          <h3 className="font-nexa text-center dark:text-white pb-1 mb-6 border-b border-stroke dark:border-strokedark">
            EXTRATOS
          </h3>
          <CardView
            className="grid gap-4"
            data={data}
            showModalMessage={showModalMessage}
            loading={loading}
            setModalOptions={setModalOptions}
            fetchDelete={fetchDelete}
            setOpenDrawer={setOpenDrawer}
            fetchDataById={fetchDataById}
          />
        </div>
        /* end mobile view */
      )}
      <Suspense fallback={<Loader />}>
        <AwesomeDrawer data={item} loading={loading} setData={setItem} open={openDrawer} setOpen={setOpenDrawer} />
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
