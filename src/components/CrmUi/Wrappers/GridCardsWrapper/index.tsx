import React from 'react';
import { cn } from '@/lib/utils';

interface IGridCardsWrapperProps extends React.HTMLAttributes<HTMLUListElement> {
    children: React.ReactNode;
    cardsSize?: keyof typeof gridCardsSize
}

const gridCardsSize = {
    "xsm": "2xsm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5",
    "sm": "md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5",
    "md": "md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4",
    "lg": "grid-cols-1 md:grid-cols-2"
}

const GridCardsWrapper = ({
    children,
}: { children: React.ReactNode }): JSX.Element => {
    return (
        <div className='relative'>
            {children}
        </div>
    )
}

GridCardsWrapper.Label = (({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <h2 className='text-lg font-bold'>{children}</h2>
    )
}) as React.FC<{ children: React.ReactNode }>;
GridCardsWrapper.Label.displayName = 'GridCardsWrapper.Label';

GridCardsWrapper.List = (function List({
    children,
    cardsSize = "md",
    ...props 
}: IGridCardsWrapperProps): JSX.Element {
        
    return (
        <ul className={cn(`my-5 grid ${gridCardsSize[cardsSize]}`, props.className)}
        >
            {children}
        </ul>
    )
}) as React.FC<IGridCardsWrapperProps>;

GridCardsWrapper.List.displayName = 'GridCardsWrapper.List';

export default GridCardsWrapper;
