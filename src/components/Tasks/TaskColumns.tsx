import React, { useRef } from 'react'
import { ILinkedTasksProps, LinkedTaskProps } from '../TaskElements/LinkedTasks';
import { TaskColumnProps } from './KanbanTasks';
import { useDrag, useDrop } from 'react-dnd';

export type ColumnProps = {
    id: string,
    index: number,
    column: TaskColumnProps,
    tasksRelated: LinkedTaskProps[],
    subtasks: string[],
    moveColumn: (fromIndex: number, toIndex: number) => void;
    type?: string;
}

export const TaskColumns = ({ id, index, column, tasksRelated, subtasks, moveColumn, type }: ColumnProps) => {

    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'column',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver }, dropRef] = useDrop({
        accept: ['column', 'task'],
        hover: (item: ColumnProps | ILinkedTasksProps, monitor) => {
            if (item.type === 'column') {

                const dragIndex = item.index
                const hoverIndex = index
                const hoverBoundingRect = ref.current!.getBoundingClientRect()
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
                const hoverActualY = monitor.getClientOffset()!.y - hoverBoundingRect.top

                // if dragging down, continue only when hover is smaller than middle Y
                if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
                // if dragging up, continue only when hover is bigger than middle Y
                if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

                moveColumn(dragIndex, hoverIndex)
                item.index = hoverIndex
            }
        },
        // drop: (item: ColumnProps | ILinkedTasksProps) => {
        //     if (item.type === 'task') {
        //         return;
        //     }
        // },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    const dragDropRef: any = drag(dropRef(ref))

    return (
        <div
            ref={dragDropRef}
            draggable={true}
            key={id}
            id={id}
            className="flex flex-col gap-4 px-2 py-3 border shadow-2 border-stroke bg-snow rounded-md cursor-grab"
        >
            <h2 className="text-lg font-semibold text-black dark:text-white ml-3">
                {column.name}
            </h2>

            {tasksRelated.length > 0 && (
                <>
                    {tasksRelated.map((task: LinkedTaskProps) => (
                        <div key={task.id} draggable={true} className="flex flex-col gap-2 shadow-1 border border-stroke bg-white rounded-md p-2">
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
