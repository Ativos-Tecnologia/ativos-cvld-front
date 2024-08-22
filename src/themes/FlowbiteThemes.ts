import { CustomFlowbiteTheme } from "flowbite-react";

export const customFlowBiteTheme: CustomFlowbiteTheme = {
  drawer: {
    root: {
      base: "fixed z-40 overflow-y-auto bg-white p-4 transition-transform duration-500 bg-snow dark:bg-boxdark",
      backdrop:
        "fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-[2px] transition-opacity duration-500",
      edge: "bottom-16",
      position: {
        top: {
          on: "left-0 right-0 top-0 w-full transform-none",
          off: "left-0 right-0 top-0 w-full -translate-y-full",
        },
        right: {
          on: "right-0 top-0 h-screen w-80 transform-none",
          off: "right-0 top-0 h-screen w-80 translate-x-full",
        },
        bottom: {
          on: "bottom-0 left-0 right-0 w-full transform-none",
          off: "bottom-0 left-0 right-0 w-full translate-y-full",
        },
        left: {
          on: "left-0 top-0 h-screen transition-transform duration-500 w-80 transform-none",
          off: "left-0 top-0 h-screen transition-transform duration-500 w-80 -translate-x-full",
        },
      },
    },
    header: {
      inner: {
        closeButton:
          "absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 dark:text-gray-100 dark:hover:text-black hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/30 transition-all duration-200",
        closeIcon: "h-4 w-4",
        titleIcon: "me-2.5 text-2xl",
        titleText:
          "mb-4 inline-flex items-center text-2xl font-semibold dark:text-white",
      },
      collapsed: {
        on: "hidden",
        off: "block",
      },
    },
    items: {
      base: "",
    },
  },
  popover: {
    base: "absolute z-20 inline-block w-max max-w-[100vw] bg-white dark:bg-boxdark outline-none border border-stroke rounded-lg shadow-2",
    content: "z-10 overflow-hidden rounded-[7px]",
    arrow: {
      base: "absolute h-2 w-2 z-0 rotate-45 mix-blend-lighten bg-white border border-gray-200 dark:border-gray-600 dark:bg-strokedark dark:mix-blend-color",
      placement: "-4px",
    },
  },
  table: {
    root: {
      base: "relative w-full overflow-x-auto text-left text-sm",
      shadow:
        "absolute left-0 top-0 -z-10 h-full w-full rounded-sm bg-white drop-shadow-md dark:bg-black",
      wrapper: "relative",
    },
    body: {
      base: "group/body",
      cell: {
        base: "px-3 py-1.5 bg-transparent dark:bg-transparent group-first/body:group-first/row:first:rounded-tl-sm group-first/body:group-first/row:last:rounded-tr-sm group-last/body:group-last/row:first:rounded-bl-sm group-last/body:group-last/row:last:rounded-br-sm",
      },
    },
    head: {
      base: "group/head text-xs uppercase text-gray-700",
      cell: {
        base: "bg-zinc-200 text-black px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-meta-4 dark:text-white",
      },
    },
    row: {
      base: "group/row",
      hovered: "hover:bg-slate-50 dark:hover:bg-slate-50",
      striped:
        "odd:bg-white even:bg-green-300 odd:dark:bg-white even:dark:bg-snow",
    },
  },
};
