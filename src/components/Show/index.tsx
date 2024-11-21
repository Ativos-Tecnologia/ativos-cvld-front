import React from 'react'

type ShowProps = {
    children: React.ReactNode;
    when: boolean;
}

function Show({ children, when }: ShowProps) {
    return (
        when && (<>
            {children}
        </>)
    )
}

export default Show