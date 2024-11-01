import { ExtratosTableContext } from "@/context/ExtratosTableContext";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { useFilter } from "@/hooks/useFilter";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import { Suspense, useContext, useEffect, useState } from "react";
import { PiGridFour, PiTable } from "react-icons/pi";
import Loader from "../common/Loader";
import { NotionDrawer } from "../Drawer/NotionDrawer";
import DeleteExtractAlert from "../Modals/DeleteExtract";
import { TableTabs } from "../TableTabs";
import CardView from "./CardView";
import NotionTableView from "./NotionTableView";
import TableView from "./TableView";

// const queryClient = new QueryClient();

type ExtratosTableProps = {
  newItem: CVLDResultProps[];
}

export function ExtratosTable({ newItem }: ExtratosTableProps) {

  const {
    data, setData,
    auxData,
    statusSelectValue, setStatusSelectValue,
    oficioSelectValue, setOficioSelectValue, viewOption,
    responseStatus, setResponseStatus,
    setCheckedList, showModalMessage,
    modalOptions, setModalOptions,
    activedTab,
    mainRef,
    fetchDelete,
    handleRestoreData,
    setDontShowAgainDeleteExtractAlert,
    setExtractListView,
    notionWorkspaceData,
    setNotionWorkspaceData

  } = useContext(ExtratosTableContext);

  const [extratosTableToNotionDrawersetId, setExtratosTableToNotionDrawersetId] = useState<string>("");
  const [notionDrawer, setNotionDrawer] = useState<boolean>(false);

  const { data: {
    role
  } } = useContext(UserInfoAPIContext)

  const { filterData, resetFilters } = useFilter(data, setData, setStatusSelectValue, setOficioSelectValue, auxData, statusSelectValue, oficioSelectValue);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      results: [...newItem, ...prevData.results]
    }));
  }, [newItem]);

  return (
    <div ref={mainRef}
      className="overflow-hidden"
    >

      {/* {
        role === 'ativos' ? (

          <div className="p-5 bg-white rounded-sm dark:bg-boxdark">
          </div>
        ) : (<div className="p-5 bg-white rounded-sm dark:bg-boxdark">
        </div>)
      } */}

      {window.innerWidth >= 100 ? (
          <>

            {/* desktop view */}
            <div className="p-5 bg-white rounded-sm dark:bg-boxdark">
              <div className="flex flex-col">

                {/* tabs */}
                {/* <TableTabs resetFilters={resetFilters} /> */}
                {/* end tabs */}


                {(activedTab !== "WORKSPACE NOTION") ?
                  (<>
                    <div className="flex w-full h-full items-center justify-between">

                      {/* filters */}
                      {/* {
                        <Filters
                          resetFilters={resetFilters}
                          filterData={filterData} />
                      } */}
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
                    {/* <MiniMenu count={data.count} /> */}
                  </>) : (
                    <><div className="flex w-full h-full items-center justify-between">

                      {/* filters */}
                      {/* {<NotionTableFilters queryClient={queryTanstack} />
                      } */}
                      {/* end filters */}

                    </div>
                    {/* <MiniMenu count={notionWorkspaceData?.results.length || 0} /> */}

                    </>
                  )
                }

              </div>
              {
                activedTab === "WORKSPACE NOTION" &&
                <NotionTableView count={notionWorkspaceData?.results.length}
                  setExtratosTableToNotionDrawersetId={setExtratosTableToNotionDrawersetId}
                  setNotionDrawer={setNotionDrawer}
                />
              }
              {(activedTab !== 'WORKSPACE NOTION' && viewOption.type === "table") &&
                <TableView count={data.count} />
              }
              {(activedTab !== 'WORKSPACE NOTION' && viewOption.type === "cards") &&
                <CardView count={data.count} />
              }
            </div>
            {/* end desktop view */}
          </>
      ) : (
        /* mobile view */
        <div className="py-7 px-5 bg-white rounded-sm dark:bg-boxdark">

          <div className="flex flex-col">

            {/* tabs */}
            <TableTabs resetFilters={resetFilters} />
            {/* end tabs */}

            <div className="flex w-full h-full items-center justify-between">

              {/* filters */}
              {/* <Filters
                resetFilters={resetFilters}
                filterData={filterData}
              /> */}
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

            {/* <MiniMenu count={data.count} /> */}

          </div>

          <CardView count={data.count} />
        </div>
        /* end mobile view */
      )}
      <Suspense fallback={<Loader />}>
        {/* <AwesomeDrawer /> */}
        {/* <TaskDrawer id={extratoId} open={openTaskDrawer} setOpen={setOpenTaskDrawer} /> */}
        {
          notionDrawer &&
          <NotionDrawer
            pageId={extratosTableToNotionDrawersetId}
            setNotionDrawer={setNotionDrawer}
            openDetailsDrawer={notionDrawer}
          />
        }
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
