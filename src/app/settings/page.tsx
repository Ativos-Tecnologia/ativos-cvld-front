"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { use, useCallback, useContext, useEffect, useState } from "react";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { Avatar } from "flowbite-react";
import { LocalShowOptionsProps } from "@/components/ExtratosTable/ExtratosTable";
import { BiChevronRight } from "react-icons/bi";
import { BsExclamationTriangleFill } from "react-icons/bs";

const defaultOptions: LocalShowOptionsProps[] = [
  {
    key: "show_delete_extract_alert",
    active: false,
  }
  /* ... */
]

const Settings = () => {

  const { data } = useContext(UserInfoAPIContext);
  const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);

  const fetchStateFromLocalStorage = () => {
    const configs = localStorage.getItem("dont_show_again_configs");
    if (configs !== null) {
      const parsedValue = JSON.parse(configs);
      setLocalShowOptions(parsedValue);
    }
  }

  const setDefaultOptions = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("dont_show_again_configs", JSON.stringify(defaultOptions));
    fetchCallback();
  }

  const saveStateToLocalStorage = (key: string) => {
    localShowOptions.forEach((item) => {
      if (item.key === key) {
        item.active = !item.active;
      }
    });
    localStorage.setItem("dont_show_again_configs", JSON.stringify(localShowOptions));
    fetchCallback();
  }

  const fetchCallback = useCallback(() => {
    fetchStateFromLocalStorage();
  }, [localShowOptions]);


  useEffect(() => {
    fetchStateFromLocalStorage();
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Configurações" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Configurações da Conta - Em Construção 🚧
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={(e) => setDefaultOptions(e)}>
                  <fieldset className="p-4 border border-stroke mb-4">
                    <legend className="px-1 dark:text-white">Configurações de exibição</legend>
                    <div className="flex flex-col gap-5.5 sm:flex-row">
                      <label
                        className="flex gap-4 text-sm font-medium items-center"
                        htmlFor="dont_show_again_delete_extract_change"
                      >
                        <input
                          type="checkbox"
                          id="dont_show_again_delete_extract_change"
                          name="dont_show_again_delete_extract_change"
                          checked={localShowOptions[0]?.active}
                          onChange={() => saveStateToLocalStorage("show_delete_extract_alert")}
                        />
                        Não exibir confirmação de exclusão de extrato
                      </label>
                    </div>
                  </fieldset>
                  <button className="block mx-auto rounded-md px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 transition duration-200">
                    Redefinir configurações
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Gerenciamento de identificação e senha
                </h3>
              </div>
              <div className="p-7 grid">
                {/* button w border-bottom */}
                <button disabled className='disabled:opacity-50 py-2 pr-4 pl-1 flex gap-2 items-center hover:text-blue-800 hover:border-blue-800 transition-all duration-200 group'>
                  <BiChevronRight className="group-hover:translate-x-[2px] transition-all duration-200" />
                  <span>Mudança de CPF/CNPJ</span>
                </button>
                <button disabled className='disabled:opacity-50 py-2 pr-4 pl-1 flex gap-2 items-center hover:text-blue-800 hover:border-blue-800 transition-all duration-200 group'>
                  <BiChevronRight className="group-hover:translate-x-[2px] transition-all duration-200" />
                  <span>Mudança de senha</span>
                </button>
              </div>
              <div className="flex bg-[#fdf9d4] dark:bg-[#f8f0ab] border-t border-stroke px-7 py-4 dark:border-strokedark">
                <p className="text-sm text-justify text-[#8E4B10]">
                  <b>Aviso:</b> A mudança de CPF/CNPJ. Dentro de até 24h, nossa equipe responsável entrará em contato para prosseguir com a(s) mudança(s).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
