import { useEffect, useImperativeHandle, useState } from "react";
import {
  BiArrowFromLeft,
  BiArrowFromRight,
  BiArrowToRight,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";

export interface MarvelousPaginationProps {
  counter: number;
  page_size: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  callScrollTop: () => void;
  loading?: boolean;
}

const PageHelper: React.FC<PageProps> = ({
  counter,
  page_size,
  currentPage,
}) => {
  return (
    <div className="mt-2 flex flex-1 justify-center">
      <p className="text-xs text-gray-700 dark:text-gray-300">
        Exibindo{" "}
        <span className="font-medium">
          {currentPage * page_size - page_size + 1}
        </span>{" "}
        de{" "}
        <span className="font-medium">
          {currentPage * page_size > counter
            ? counter
            : currentPage * page_size}
        </span>{" "}
        do total de <span className="font-medium">{counter}</span> resultados
      </p>
    </div>
  );
};


interface PageProps
  extends Omit<MarvelousPaginationProps, "onPageChange" | "setCurrentPage"> {
  counter: number;
  page_size: number;
  currentPage: number;
  callScrollTop: () => void;
}



export default function MarvelousPagination({
  counter,
  page_size,
  currentPage,
  onPageChange,
  setCurrentPage,
  loading,
  callScrollTop
}: MarvelousPaginationProps) {
  const [selectedPage, setSelectedPage] = useState(1);
  const pageNum = Math.ceil(counter / page_size);

  if (page_size > counter) {
    page_size = counter;
  }

  const handleClick = (page: number) => {
    if (page >= 1 && page <= pageNum) {
      // debugger
      onPageChange(page);
      setCurrentPage(page);
      setSelectedPage(page);
      setTimeout(() => {
        callScrollTop();
      }, 1000);
    }
  };

  const getPages = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= pageNum; i++) {
      if (
        i === 1 ||
        i === pageNum ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  // useEffect(() => {

  // }, [currentPage])

  return (
    <div className="mt-0 flex w-full items-center justify-between border-gray-200 px-4 pt-4 sm:px-6">
      <div className="w-full flex-col justify-between md:hidden">
        <div className="flex w-full justify-between pb-4">
          <button
            onClick={() => handleClick(1)}
            className="hover:bg-gray-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 focus:z-20 focus:outline-offset-0"
          >
            <BiArrowFromRight
              aria-hidden="true"
              className="h-5 w-5 dark:text-gray-300"
            />
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => handleClick(currentPage - 1)}
            className="hover:bg-gray-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md">
            {
              currentPage
            }
          </div>
          <button
            disabled={currentPage === pageNum}
            onClick={() => handleClick(currentPage + 1)}
            className="hover:bg-gray-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próximo
          </button>
          <button
            disabled={currentPage === pageNum}
            onClick={() => handleClick(pageNum)}
            className="hover:bg-gray-50 relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed"
          >
            <BiArrowFromLeft
              aria-hidden="true"
              className="h-5 w-5 dark:text-gray-300"
            />
          </button>
        </div>
        <PageHelper
          counter={counter}
          page_size={page_size}
          currentPage={currentPage}
          callScrollTop={callScrollTop}
        />
      </div>

      {/* view mobile */}

      <div className="hidden flex-col-reverse sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* <div className="flex justify-between flex-1 mt-2">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Exibindo <span className="font-medium">{
                currentPage * page_size - page_size + 1
                }</span> de <span className="font-medium">{
                    currentPage * page_size > counter ? counter : currentPage * page_size
                }</span> do total de {' '}
            <span className="font-medium">{counter}</span> resultados
          </p>
        </div> */}
        <PageHelper
          counter={counter}
          page_size={page_size}
          currentPage={currentPage}
          callScrollTop={callScrollTop}
        />
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            {/* {
                currentPage > 1 ? (
                    <a
                        href="#"
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">Anterior</span>
                        <BiChevronLeft aria-hidden="true" className="h-5 w-5" />
                    </a>
                ) : null
            } */}
            <button
              onClick={() => handleClick(1)}
              disabled={currentPage === 1}
              className="hover:bg-gray-50 relative inline-flex items-center rounded-l-md border-none px-2 py-2  text-gray-400 ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <p className="sr-only">Primeira</p>
              <BiArrowFromRight
                aria-hidden="true"
                className="h-5 w-5 dark:text-gray-300"
              />
            </button>
            <button
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
              className="hover:bg-gray-50 relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Anterior</span>
              <BiChevronLeft
                aria-hidden="true"
                className="h-5 w-5 dark:text-gray-300"
              />
            </button>

            {getPages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && handleClick(page)}

                className={
                  currentPage === page
                    ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-none"
                    : "hover:bg-gray-50 relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 dark:text-gray-300"
                }
                disabled={currentPage === page}
                style={{ cursor: loading ? "wait" : "pointer" }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === pageNum}
              className="hover:bg-gray-50 relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Próximo</span>
              <BiChevronRight
                aria-hidden="true"
                className="h-5 w-5 dark:text-gray-300"
              />
            </button>
            <button
              onClick={() => handleClick(pageNum)}
              className="hover:bg-gray-50 relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="sr-only">Última</span>
              <BiArrowFromLeft
                aria-hidden="true"
                className="h-5 w-5 dark:text-gray-300"
              />
            </button>
          </nav>
        </div>
      </div>
      {/* end view mobile */}
    </div>
  );
}
