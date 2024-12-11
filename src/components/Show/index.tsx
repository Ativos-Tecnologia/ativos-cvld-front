import React from 'react'

type ShowProps = {
    children: React.ReactNode;
    when: boolean | "dev"
}

function Show({ children, when }: ShowProps) {
    switch (when) {
        case "dev":
            return (
                !window.location.href.includes(
                    "https://ativoscvld.vercel.app/",
                  ) && (<>
                    {children}
                </>)
            )
        default:
            return (
                when && (<>
                    {children}
                </>)
            )
        }
}

export default Show