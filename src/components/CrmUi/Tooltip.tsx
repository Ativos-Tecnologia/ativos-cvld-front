import React from 'react'

type TooltipProps = {
    children: React.ReactNode,
    text: string,
    arrow?: boolean,
    placement?: string
}

const tooltipPlacement: Record<string, string> = {
    "top": "bottom-[75%] left-1/2 -translate-x-1/2 group-hover:bottom-full"
}

const CRMTooltip = ({ children, text, arrow = true, placement = "top" }: TooltipProps) => {
    return (
        <div className="group relative inline-block">
            {children}
            <div className={`absolute bottom-[75%] mb-3 ${tooltipPlacement[placement]} whitespace-nowrap rounded-md bg-snow dark:bg-black-2 border border-stroke dark:border-strokedark px-3.5 py-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                {arrow && <span className="absolute bottom-[-5px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-snow dark:bg-black-2 border-r border-b border-stroke dark:border-strokedark"></span>}
                <p>{text}</p>
            </div>
        </div>
    )
}

export default CRMTooltip