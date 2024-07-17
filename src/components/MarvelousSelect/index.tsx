import React, { forwardRef, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded, BiX } from "react-icons/bi";
import { BsChevronBarDown, BsChevronDown, BsChevronUp, BsThreeDots, BsX } from "react-icons/bs";
import { PaginatedResponse, TaskRelatedItems } from "../TaskElements";
import { Button, Popover, Tooltip } from "flowbite-react";
import api from "@/utils/api";
import { TfiCheckBox, TfiPencilAlt } from "react-icons/tfi";
import { DynamicForm } from "./DynamicForm";

export type TaskDrawerProps = {
  label: string;
  data: TaskRelatedItems[];
  color?: string;
  nameRef?: string;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  setData: React.Dispatch<React.SetStateAction<Array<TaskRelatedItems>>>;
  value: string;
};

const tooltipTheme = {
  base: "right-10 z-20 inline-block w-full bg-white outline-none border border-gray-200 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-800",
  content: "overflow-hidden z-10 rounded-[7px]",
  arrow: {
    base: "bg-red h-2 w-2 z-0 rotate-45 mix-blend-lighten bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:mix-blend-color",
    placement: "-4px",
  },
};

const MarvelousSelect = forwardRef<HTMLDivElement, TaskDrawerProps>(({
  label,
  data,
  color,
  nameRef,
  onChange,
  onBlur,
  value,
  setData
}, ref) => {
  MarvelousSelect.displayName = "MarvelousSelect";

  const [isOpen, setIsOpen] = useState(false);
  const [labelReleatedEditId, setLabelReleatedEditId] = useState<string | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const aux = nameRef === "goalName" ? "goalName" : "statusName";

  const [selected, setSelected] = useState<TaskRelatedItems>({
    id: "",
    title: label,
  });

  data.map((tag) => {
    if (aux === "goalName") {
      tag.nameRef = tag.goalName;
    } else {
      tag.nameRef = tag.statusName;
    }
  });

  // teste de clique

  // fim do teste de clique

  useEffect(() => {
    document?.addEventListener('mousedown', (e: MouseEvent) => {

      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }

    });

    return document?.addEventListener('mousedown', (e: MouseEvent) => {

      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }

    })
  }, [])

  const handleSelect = (tag: any) => {
    setSelected(tag);
    onChange(tag.id);
    setIsOpen(false);
  };

  const handleChangeValue = (value: string, targetTag: TaskRelatedItems) => {

    targetTag.title = value;
    targetTag.nameRef = value;

    if (targetTag.title?.length > 0) {
      if (targetTag?.goalName) {

        api.patch(`api/task/goals/update-goal-name/${targetTag.id}/`, {
          goalName: value,
        }).then((response) => {

          const updatedData = data.map((item) => {
            if (item.id === targetTag.id) {

              return {
                ...item,
                nameRef: targetTag.title,
                goalName: targetTag.title
              }

            }
            return item;
          });

          setData(updatedData);
          setLabelReleatedEditId(null);


        });

      } else {
        /* ... */
        return;
      }
    }
  }

  return (
    <div className="relative" ref={ref} >

      <DynamicForm label={label} />

      <div
        className={`flex py-0.5 h-fit gap-1 font-semibold ${color === undefined ? "bg-blue-100 text-blue-800 group-hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-900 dark:group-hover:bg-blue-300" : color} flex w-full cursor-pointer flex-row items-center justify-between rounded text-[10px]`}
        onClick={() => setIsOpen(!isOpen)}
        title={selected?.nameRef || selected.title}
      >
        <p className="pl-3 w-full overflow-hidden text-ellipsis whitespace-nowrap">{selected?.nameRef || selected.title}</p>{" "}
        {
          selected?.nameRef && selected.title !== label ? (
            <BiX className="w-4 h-4 mr-2 text-red-500" onClick={() => {
              setSelected({ id: "", title: label })
              onChange("");
            }} />
          ) : (
            (isOpen ? <BsChevronUp className="w-3 h-3 mr-2 animate-topbottom1" /> : <BsChevronUp className="w-3 h-3 mr-2 animate-bottomtotoparrow" />)
          )
        }
      </div>
      <div ref={selectRef}
        className={`${isOpen ? "h-40" : "h-0 border-none"} absolute z-10 mt-2 w-full rounded bg-white border border-stroke dark:border-strokedark dark:bg-boxdark shadow-lg overflow-y-auto transition-all duration-500 linear`}
      >
        {isOpen &&
          data.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between border-b border-gray-100 cursor-pointer select-none">
              <div
                className="relative w-full p-1"
                title={tag.nameRef}
                onClick={() => {
                  if (labelReleatedEditId === null) handleSelect(tag);
                }}
              >
                <input
                  type="text"
                  defaultValue={tag.nameRef}
                  disabled={labelReleatedEditId === tag.id ? false : true}
                  className="px-2 w-full text-ellipsis overflow-hidden whitespace-nowrap rounded-md text-xs font-medium border-none border-b border-black bg-blue-100 dark:hover:bg-white/30 dark:focus:text-black disabled:hover:bg-gray disabled:bg-transparent disabled:cursor-pointer transition-all duration-200"
                  // onChange={(e) => { handleChangeValue(e.target.value, tag) }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleChangeValue(e.currentTarget.value, tag)
                    }
                  }}
                />

                {labelReleatedEditId === null && (
                  <div className="absolute inset-0 bg-transparent cursor-pointer"
                    onClick={() => {
                      handleSelect(tag);
                    }}
                  ></div>
                )}

                {/* <p contentEditable={labelReleatedEditId === tag.id ? true : false}
                  tabIndex={0}
                  className={`px-1`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const newLabel = e.currentTarget.innerText;
                      tag.title = newLabel;
                      const newTags = data.map((item) => {
                        if (item.id === tag.id) {
                          return tag;
                        }
                        return item;
                      });
                      api.patch(`api/task/goals/update-goal-name/${tag.id}/`, {
                        goalName: newLabel,
                      }).then((response) => {
                        setLabelReleatedEditId(null);
                      });

                    }
                  }}>
                  {tag.nameRef}
                </p> */}
              </div>

              {!tag.non_editable && (
                <div className="px-1">
                  {labelReleatedEditId === tag.id ? (
                    <TfiCheckBox title="Concluir" className="w-3.5 h-3.5 cursor-pointer hover:fill-slate-600 dark:hover:fill-slate-500 transition-all duration-200" onClick={(e) => {
                      const el = e.target as HTMLElement;
                      const value = el.parentElement?.parentElement?.querySelector("input")?.value as string;
                      handleChangeValue(value, tag);
                    }} />
                  ) : (
                    <TfiPencilAlt title="Editar" className="w-3.5 h-3.5 cursor-pointer hover:fill-slate-600  dark:hover:fill-slate-500 transition-all duration-200" onClick={() => {
                      setLabelReleatedEditId(tag.id);
                    }} />
                  )}
                </div>
              )}


              {/* <Popover

                aria-labelledby="default-popover"
                theme={tooltipTheme}
                content={
                  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                    <div className="dark:border-gray-600 border-b border-gray-200 bg-gray-100 px-3 py-2 dark:bg-gray-700 flex items-center justify-between w-[210px]">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        OPÇÕES
                      </h3>
                      <BsX className="w-6 h-4 cursor-pointer" onClick={() => settootipToggle(false)} />
                    </div>
                    <div className="px-3 py-2">
                      <p
                        onDoubleClick={() => {
                          setLabelReleatedEdit(true);
                        }}
                        onBlur={() => {
                          setLabelReleatedEdit(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const newLabel = e.currentTarget.innerText;
                            tag.title = newLabel;
                            const newTags = data.map((item) => {
                              if (item.id === tag.id) {
                                return tag;
                              }
                              return item;
                            });
                            api.patch(`api/task/goals/update-goal-name/${tag.id}/`, {
                              goalName: newLabel,
                            }).then((response) => {
                              setLabelReleatedEdit(false);
                            });

                          }
                        }}
                        contentEditable={labelReleatedEdit}
                        id="default-popover"
                        className="text-xs word-break w-fit font-semibold text-gray-900 dark:text-white cursor-text"
                        title="Duplo clique para editar"
                      >
                        {tag.nameRef}
                      </p>

                    </div>
                  </div>
                }
                arrow={false}
              >
              </Popover> */}
            </div>
          ))}
      </div>
    </div>
  )
});

export default MarvelousSelect;
