import React from 'react'

type CapaDoBatmanProps = {
    children: React.ReactNode;
    show: boolean;
}

function CapaDoBatman({ children, show }: CapaDoBatmanProps) {
    return (
        show && (<>
            {children}
        </>)
    )
}

export default CapaDoBatman