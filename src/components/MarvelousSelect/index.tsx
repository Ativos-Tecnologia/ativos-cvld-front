import React, { forwardRef, useState } from "react";
import { BiDotsVerticalRounded, BiX } from "react-icons/bi";
import { BsChevronBarDown, BsChevronDown, BsChevronUp, BsThreeDots, BsX } from "react-icons/bs";
import { TaskRelatedItems } from "../TaskElements";
import { Button, Popover, Tooltip } from "flowbite-react";
import api from "@/utils/api";

export type TaskDrawerProps = {
  label: string;
  data: Array<TaskRelatedItems>;
  color?: string;
  nameRef?: string;
  onChange: (...event: any[]) => void;
  onBlur: () => void;
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
  value
}, ref) => {
  MarvelousSelect.displayName = "MarvelousSelect";

  const [isOpen, setIsOpen] = useState(false);
  const [labelReleatedEdit, setLabelReleatedEdit] = useState(false);
  const [tootipToggle, settootipToggle] = useState(false);

  const [selected, setSelected] = useState<TaskRelatedItems>({
    id: "",
    goalName: label,
  });

  const handleSelect = (tag:any) => {
    setSelected(tag);
    onChange(tag.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <input type="hidden" name={nameRef} value={selected?.id} />
      <div
        className={`flex py-0.5 h-fit gap-1 font-semibold ${color === undefined ? "bg-blue-100 text-blue-800 group-hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-900 dark:group-hover:bg-blue-300" : color} flex w-full cursor-pointer flex-row items-center justify-between rounded text-[10px]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="pl-3">{selected?.goalName}</p>{" "}
        {
          selected?.goalName !== label ? (
            <BiX className="w-4 h-4 mr-2 text-red-500" onClick={() => {
              setSelected({ id: "", goalName: label })
              onChange("");
            }} />
          ) : (
            (isOpen ? <BsChevronUp className="w-4 h-4 mr-2 animate-topbottom1" /> : <BsChevronUp className="w-4 h-4 mr-2 animate-bottomtotoparrow" />)
          )
        }
      </div>
      <div
        className="mt-2 w-full rounded bg-white shadow-lg absolute z-10"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {isOpen &&
          data.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between border-b border-gray-100"
            >
              <div
                className="w-full p-2 text-xs font-bold hover:bg-gray-100"
                onClick={() => handleSelect(tag)}
              >
                <p>{tag.goalName}</p>
              </div>


              <Popover

                aria-labelledby="default-popover"
                theme={tooltipTheme}
                content={
                  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                    <div className="dark:border-gray-600 border-b border-gray-200 bg-gray-100 px-3 py-2 dark:bg-gray-700 flex items-center justify-between w-[210px]">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        OPÇÕES
                      </h3>
                      {/* <BsX className="w-6 h-4 cursor-pointer" onClick={() => settootipToggle(false)} /> */}
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
                            tag.goalName = newLabel;
                            // const newTags = data.map((item) => {
                            //   if (item.id === tag.id) {
                            //     return tag;
                            //   }
                            //   return item;
                            // });
                            api.patch(`api/task/goals/update-goal-name/${tag.id}/`, {
                              goalName: newLabel,
                            }).then((response) => {
                              setLabelReleatedEdit(false);
                            });

                          }
                        }}
                        contentEditable={labelReleatedEdit}
                        id="default-popover"
                        className="text-xs word-break w-fit font-semibold text-gray-900 dark:text-white cursor-pointer"
                        title="Duplo clique para editar"
                      >
                        {tag.goalName}
                      </p>

                    </div>
                  </div>
                }
                arrow={false}
              >
                <BiDotsVerticalRounded className="w-6 h-4 cursor-pointer" onClick={() => settootipToggle(true)} />
              </Popover>
            </div>
          ))}

      </div>
    </div>
  )});

export default MarvelousSelect;
