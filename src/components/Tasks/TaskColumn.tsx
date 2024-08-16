import React, { useRef } from 'react'
import { LinkedTaskProps } from '../TaskElements/LinkedTasks';
import { TaskColumnProps } from './KanbanTasks';
import { useDrag, useDrop } from 'react-dnd';

export const TaskColumn = ({ id, index, column, tasksRelated, subtasks, moveColumn }:
    {
        id: string,
        index: number,
        column: TaskColumnProps,
        tasksRelated: LinkedTaskProps[],
        subtasks: string[],
        moveColumn: (fromIndex: number, toIndex: number) => void
    }
) => {

    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: 'TASK_COLUMN',
        hover: (item: { index: number }) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveColumn(dragIndex, hoverIndex);

            item.index = hoverIndex;
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: "TASK_COLUMN",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            draggable={true}
            key={id}
            className="swim-lane flex flex-col gap-4 px-2 py-3 border shadow-2 border-stroke bg-snow rounded-md cursor-grab"
        >

            <h2 className="text-lg font-semibold text-black dark:text-white ml-3">
                {column.name}
            </h2>

            {tasksRelated.length > 0 && (
                <>
                    {tasksRelated.map((task: LinkedTaskProps) => (
                        <div className="task flex flex-col gap-2 shadow-1 border border-stroke bg-white rounded-md p-2">
                            <h4 className="text-black dark:text-white">
                                {task.title}
                            </h4>
                            {subtasks.length > 0 &&
                                <ul
                                    className={`ml-3 flex flex-col gap-2`}>
                                    {subtasks.map(subtask => (
                                        <li key={subtask} className="flex items-center justify-between gap-2 peer">
                                            <label htmlFor={subtask} className="relative flex items-center gap-2 cursor-pointer">
                                                <input
                                                    id={subtask}
                                                    type="checkbox"
                                                    className="w-3 h-3 bg-transparent focus-within:ring-0 selection:ring-0 border-2 border-body dark:border-bodydark rounded-[3px] self-start mt-2 cursor-pointer"
                                                />
                                                <span title={subtask}>
                                                    {
                                                        subtask.length > 65 ?
                                                            `${subtask.substring(0, 65)}...` :
                                                            subtask
                                                    }
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}
