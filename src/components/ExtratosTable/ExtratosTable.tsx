
import numberFormat from "@/functions/formaters/numberFormat";
import api from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, CustomFlowbiteTheme, Flowbite, Badge, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import UseMySwal from "@/hooks/useMySwal";
import dateFormater from "@/functions/formaters/dateFormater";
import { BsFillTrashFill } from "react-icons/bs";
import { AwesomeDrawer } from "../Drawer/Drawer";

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
        base: "px-6 py-4 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg"
      }
    },
    head: {
      base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
      cell: {
        base: "bg-gray-50 px-6 py-3 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"
      }
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped: "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
    }
  }
}

export function ExtratosTable() {

  const mySwal = UseMySwal();

  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState<any>({});
  const [lastId, setLastId] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const fetchData = async () => {
    const response = await api.get("api/extratos/");
    setData(response.data);
  }

  const fetchDelete = async (id: number) => {
    try {
      const response = await api.delete(`api/extrato/delete/${id}/`);
      fetchData();
      return response;
    } catch (error) {
      mySwal.fire({
        icon: "error",
        title: "Erro ao excluir",
        text: "Não foi possível excluir o registro."
      });
    }
  }

  const fetchDataById = async (id: string) => {
    if (lastId === id) {
      setOpenDrawer(!openDrawer);
      return;
    }
    const response = await api.get(`api/extrato/${id}/`);
    setItem(response.data);
    setLastId(id);
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="overflow-x-auto">
      <Flowbite theme={{ theme: customTheme }}>
        <Table hoverable className="">
          <TableHead className="bg-[#f9fafb] dark:bg-[#1a202c]">
            <TableHeadCell className="text-center w-[120px]">Oficio</TableHeadCell>
            <TableHeadCell className="text-center">Credor</TableHeadCell>
            <TableHeadCell className="text-center">Principal</TableHeadCell>
            <TableHeadCell className="text-center">Juros</TableHeadCell>
            <TableHeadCell className="text-center">Data Base</TableHeadCell>
            <TableHeadCell className="text-center w-[40px]">
              <span className="sr-only text-center">Detalhes</span>
            </TableHeadCell>
            <TableHeadCell>
              <span className="sr-only text-center w-[60px]">Detalhes</span>
            </TableHeadCell>
          </TableHead>
          <TableBody>
            {data?.map((item: any) => (

              <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Badge color="indigo" size="sm" className="max-w-full">
                  {item.tipo_do_oficio}
                </Badge>
              </TableCell>
                <TableCell className="text-center">{item?.credor || ""}</TableCell>
                <TableCell className="text-center">{numberFormat(item.valor_principal)}</TableCell>
                <TableCell className="text-center">{numberFormat(item.valor_juros)}</TableCell>
                <TableCell className="text-center">{dateFormater(item.data_base)}</TableCell>
                <TableCell className="text-center">
                <Button onClick={async () => {
                    const result = await mySwal.fire({
                      title: "Você tem certeza?",
                      text: "Esta ação não poderá ser desfeita",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Sim!",
                      cancelButtonText: "Cancelar",
                    });
                    if (result.isConfirmed) {
                      const response = await fetchDelete(item.id);
                      if (response && response.status === 204) {
                        mySwal.fire({
                          title: "Deletado!",
                          text: "Registro excluído com sucesso.",
                          icon: "success",
                          timer: 2000,
                          timerProgressBar: true,
                        }
                        );

                      } else {
                        mySwal.fire(
                          "Erro!",
                          "Ocorreu um erro ao excluir o cliente.",
                          "error"
                        );
                      }
                    }
                  }} className="bg-transparent border-none hover:bg-red-500 text-red-500 hover:text-white dark:hover:text-white dark:text-red-500 dark:hover:bg-red-500">
                    <BsFillTrashFill className="text-orange-500" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button onClick={() => {
                    fetchDataById(item.id);
                    setOpenDrawer(true);
                  }} className="bg-transparent border-none hover:bg-blue-500 text-blue-500 hover:text-white dark:hover:text-white dark:text-blue-500 dark:hover:bg-blue-500 border border-blue-500 hover:border-transparent">
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flowbite>
      <AwesomeDrawer data={item} setData={setItem} open={openDrawer} setOpen={setOpenDrawer} />
    </div>
  );
}
