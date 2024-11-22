import React from 'react'

const placementClasses = {
    left: "items-center justify-start",
    center: "items-center justify-center",
    right: "items-center justify-end"
}

const Backdrop = ({ children, placement = "center" }: { children: React.ReactNode, placement?: keyof typeof placementClasses }) => {

    return (
        <div className={`absolute bg-black-2/50 flex ${placementClasses[placement]} w-full h-full top-0 left-0 rounded-md border z-40`}>
            {children}
        </div>
    )
}

export default Backdrop;
