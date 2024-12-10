import React, { useEffect, useRef } from 'react';

type TooltipProps = {
    children: React.ReactNode,
    text: string,
    arrow?: boolean,
    placement?: string,
    animationDelay?: "0" | "75" | "100" | "200" | "300" | "500" | "700"
}

const tooltipPlacement: Record<string, { container: string, arrow: string }> = {
    top: {
        container: "bottom-[75%] left-1/2 -translate-x-1/2 group-hover:bottom-[90%]",
        arrow: "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b"
    },
    right: {
        container: "left-[75%] top-1/2 -translate-y-1/2 group-hover:left-[120%]",
        arrow: "left-[-4px] top-1/2 -translate-y-1/2 border-l border-b"
    },
    bottom: {
        container: "left-1/2 top-[75%] -translate-x-1/2 group-hover:top-[120%]",
        arrow: "left-1/2 top-[-4px] -translate-x-1/2 border-l border-t"
    },
    left: {
        container: "right-[75%] top-1/2 -translate-y-1/2 group-hover:right-[120%]",
        arrow: "right-[-4px] top-1/2 -translate-y-1/2 border-r border-t"
    },
    start: {
        container: "bottom-[75%] -translate-x group-hover:bottom-[90%] z-4",
        arrow: "bottom-[-5px] border-r border-b "
    },
    end: {
        container: "top-[75%] group-hover:top-[120%]",
        arrow: "top-[-5px] border-l border-t"
    }
}

const CRMTooltip = ({ children, text, arrow = true, placement = "top", animationDelay = "300" }: TooltipProps) => {

    return (
        <div
            className="group relative inline-block"
        >
            {children}
            <div className={`absolute mb-3 ${tooltipPlacement[placement].container} z-999999 whitespace-nowrap rounded-md bg-snow dark:bg-black-2 border border-stroke dark:border-strokedark px-3.5 py-1 text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-${animationDelay}`}>
                {arrow && <span className={`absolute -z-10 h-2 w-2 ${tooltipPlacement[placement].arrow} rotate-45 bg-snow dark:bg-black-2 border-stroke dark:border-strokedark`}></span>}
                <p className={`${text.includes('\n') ? 'text-center' : 'text-left'}`}>
                    {
                        text.split('\n').map((item, index) => (
                            <span key={index}>
                                {item}
                                <br />
                            </span>
                        ))
                    }
                </p>
            </div>
        </div>
    )
}

export default CRMTooltip