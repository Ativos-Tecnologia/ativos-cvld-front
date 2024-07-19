import { useState } from "react";
import { BiArrowFromLeft, BiArrowFromRight, BiArrowToRight, BiChevronLeft, BiChevronRight } from "react-icons/bi"

const items = [
  { id: 1, title: 'Back End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 2, title: 'Front End Developer', department: 'Engineering', type: 'Full-time', location: 'Remote' },
  { id: 3, title: 'User Interface Designer', department: 'Design', type: 'Full-time', location: 'Remote' },
]

export interface MarvelousPaginationProps {
    counter: number;
    page_size: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    loading?: boolean;
}

export default function MarvelousPagination({ counter, page_size, currentPage, onPageChange, setCurrentPage, loading  }: MarvelousPaginationProps) {
    console.log('====================================');
    console.log(loading);
    console.log('====================================');
    const pageNum = Math.ceil(counter / page_size);

    if (page_size > counter) {
        page_size = counter;
    }

    const handleClick = (page: number) => {
        if (page >= 1 && page <= pageNum) {
            onPageChange(page);
            setCurrentPage(page);
        }
    }

    const getPages = () => {
        const pages = [];
        const delta = 2;

        for (let i = 1; i <= pageNum; i++) {
          if (i === 1 || i === pageNum || (i >= currentPage - delta && i <= currentPage + delta)) {
            pages.push(i);
          } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
          }
        }

        return pages;
      };


  return (
    <div className="my-4 flex items-center justify-between border-gray-200 px-4 pt-4 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Anterior
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Próximo
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between flex-col-reverse">
        <div className="flex justify-between flex-1 mt-2">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Exibindo <span className="font-medium">{
                currentPage * page_size - page_size + 1
                }</span> de <span className="font-medium">{
                    currentPage * page_size > counter ? counter : currentPage * page_size
                }</span> do total de {' '}
            <span className="font-medium">{counter}</span> resultados
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
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
              className="relative border-none inline-flex items-center rounded-l-md px-2 py-2 text-gray-400  ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <p className="sr-only">Primeira</p>
              <BiArrowFromRight aria-hidden="true" className="h-5 w-5 dark:text-gray-300" />
            </button>
            <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <BiChevronLeft aria-hidden="true" className="h-5 w-5 dark:text-gray-300" />
            </button>
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
            {/* <a
              href="#"
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              2
            </a>
            <a
              href="#"
              className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span>
            <a
              href="#"
              className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >
              8
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              9
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              10
            </a> */}
            {getPages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && handleClick(page)}
        //   className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          className={currentPage === page ? 'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}
          disabled={typeof page !== 'number' || loading === true}
          style={{ cursor: loading ? 'wait' : 'pointer' }}
        >
          {page}
        </button>
      ))}
            <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === pageNum}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Próximo</span>
              <BiChevronRight aria-hidden="true" className="h-5 w-5 dark:text-gray-300" />
            </button>
            <button
            onClick={() => handleClick(pageNum)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Última</span>
              <BiArrowFromLeft aria-hidden="true" className="h-5 w-5 dark:text-gray-300" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
