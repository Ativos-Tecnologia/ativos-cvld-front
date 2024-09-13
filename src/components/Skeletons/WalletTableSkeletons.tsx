import React from 'react'
import { TableCell, TableRow } from '../Tables/TableDefault';

export const WalletTableSkeletons = () => {

    return (
        <TableRow>

            <React.Fragment>
                {[...Array(1)].map((_, index: number) => (
                    <TableCell key={index}>
                        <div className='animate-pulse w-4 h-4 bg-slate-200 rounded-full dark:bg-slate-300'></div>
                    </TableCell>
                ))}
            </React.Fragment>

            <React.Fragment>
                {[...Array(16)].map((_, index: number) => (
                    <TableCell key={index}>
                        <div className='animate-pulse w-full h-4 my-1.5 bg-slate-200 rounded-full dark:bg-slate-300'></div>
                    </TableCell>
                ))}
            </React.Fragment>

        </TableRow>
    )
}
