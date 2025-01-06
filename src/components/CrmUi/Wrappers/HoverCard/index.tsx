import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

interface IHoverCardProps extends React.HTMLAttributes<HTMLLIElement> {
    disabled?: boolean;
    children: React.ReactNode;
}

interface IHoverCardIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    bgColor: string;
    icon: React.ReactNode;
    className?: string;
}


/**
 * Componente de wrapper do hovercard
 * 
 * @param {Object} props - propriedades do componente
 * @property {boolean} [props.disabled=false] - Informa se o conteúdo está desabilitado para manuseio. default false
 * @property {ReactNode} props.children - conteudo que será abraçado pelo componente
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCard = ({ disabled = false, children, ...props }: IHoverCardProps): JSX.Element => {
    return (
        <li
            {...props}
            className={cn(`mb-4 h-65 max-w-full cursor-pointer font-nexa xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4 ${disabled && "opacity-50 hover:cursor-not-allowed"}`, props.className)}
        >
            {children}
        </li>
    )
}

/**
 * Componente de container do HoverCard
 * 
 * @param {Object} props - Propriedades do componente 
 * @property {ReactNode} props.children - conteudo que será abraçado pelo componente
 * @property {boolean} [props.disabled] - Informa se o conteúdo está desabilitado para manuseio
 * @property {string} props.backgroundImg - caminho da imagem para o plano de fundo do card
 * @property {string} [props.className] - conjunto de classes CSS 
 * @property {string} [props.backgroundColorFill="normal"] - modo de preenchimento do plano de fundo do card. default "normal"
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardContainer = ({ children, disabled, backgroundImg, className, backgroundColorFill = "normal" }: {
    children: React.ReactNode;
    disabled?: boolean;
    backgroundImg: string;
    className?: string;
    backgroundColorFill?: "strong" | "normal";
}): JSX.Element => {
    return (
        <div
            className={cn(`group relative h-55 ${disabled ? "pointer-events-none hover:cursor-not-allowed opacity-50" : null}`, className)}
        >
            <div className="absolute inset-0 z-0 overflow-hidden rounded-md">
                <Image
                    src={backgroundImg}
                    alt="Card Image"
                    width={380}
                    height={220}
                    className="transition-all duration-500 group-hover:scale-105 h-65"
                />
                {backgroundColorFill === "strong"
                    ? <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_40%,rgba(0,0,0,0.5)_90%)]"></div>
                    : <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_40%,rgba(0,0,0,0.2)_90%)]"></div>
                }
            </div>
            {children}
        </div>
    )
}

// HoverCardContainer.displayName = "HoverCard.Container";

/**
 * Componente de badge do tribunal
 * 
 * @param {Object} props - propiedades do componente
 * @property {string} props.tribunal - nome do tribunal que será exibido
 * @property {string} props.className - classes CSS
 * 
 * @returns {JSX.Element} - Componente de Badge renderizado
 */
const HoverCardTribunalBadge = ({ tribunal, className }: {
    tribunal: string | undefined,
    className?: string
}): JSX.Element => {
    return (
        <div className={cn("absolute -top-1 right-1 z-3 flex items-center justify-center group-hover:opacity-0", className)}>
            <Image
                src="/images/badge-tribunal.svg"
                alt="badge onde mostra o tribunal referente"
                width={70}
                height={75}
            />
            <span className="absolute top-5 font-bold text-black-2">
                {tribunal && tribunal}
            </span>
        </div>
    )
}

// HoverCardTribunalBadge.displayName = "HoverCard.TribunalBadge";

/**
 * Componente de ícone do hovercard
 * 
 * @param {Object} props - propriedades do componente
 * @property {string} props.bgColor - Cor de fundo do container
 * @property {string} props.className - Classes CSS
 * @property {ReactNode} props.icon - ícone renderizado
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardIcon = ({ bgColor, icon, className }: IHoverCardIconProps): JSX.Element => {
    return (
        <span
            style={{
                backgroundColor: bgColor
            }}
            className={cn("flex h-10 w-10 items-center justify-center rounded-lg p-3", className)}
        >
            {icon}
        </span>
    )
}

// HoverCardIcon.displayName = "HoverCard.Icon";

/**
 * Componente wrapper de conteúdo (principal) do hovercard,
 * desaparece ao sofrer hover.
 * 
 * @param {Object} props - propriedades do componente
 * @property {ReactNode} props.children -  conteudo que será abraçado pelo componente
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardContent = ({ children, className }: {
    children: React.ReactNode,
    className?: string
}): JSX.Element => {
    return (
        <div className={cn("group relative flex h-full cursor-pointer flex-col justify-between rounded-md bg-cover bg-center p-4", className)}>
            {children}
        </div>
    )
}

// HoverCardContent.displayName = "HoverCard.Content";

/**
 * Componente wrapper de conteúdo (extra) do hovercard,
 * aparece ao sofrer hover.
 * 
 * @param {Object} props - propriedades do componente
 * @property {ReactNode} props.children -  conteudo que será abraçado pelo componente
 * @property {string} props.className - Classes CSS
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardHiddenContent = ({ children, className }: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode,
    className?: string
}): JSX.Element => {
    return (
        <div
            className={cn("absolute inset-0 z-2 flex h-55 cursor-pointer flex-col justify-between rounded-md bg-[linear-gradient(to_top,#000000_20%,rgba(17,17,17,0.5)_80%)] p-4 opacity-0 transition-all duration-300 ease-in-out group-hover:h-65 group-hover:opacity-100", className)}
        >
            {children}
        </div>
    )
}

// HoverCardHiddenContent.displayName = "HoverCard.HiddenContent";

/**
 * Componente de wrapper para lista de informações
 * do ativo
 * 
 * @param {Object} props - propriedades do componente
 * @property {ReactNode} props.children -  conteudo que será abraçado pelo componente
 * @property {string} props.className - Classes CSS
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardInfoList = ({ children, className }: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode,
    className?: string
}): JSX.Element => {
    return (
        <div className={cn("grid grid-cols-2 uppercase", className)}>
            {children}
        </div>
    )
}

// HoverCardInfoList.displayName = "HoverCard.InfoList";

/**
 * Componente de item da lista de informações
 * do ativo
 * 
 * @param {Object} props - propriedades do componente
 * @property {ReactNode} props.children -  conteudo que será abraçado pelo componente
 * @property {string} props.className - Classes CSS
 * 
 * @returns {JSX.Element} - Componente renderizado
 */
const HoverCardListItem = ({ children, className }: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode,
    className?: string
}): JSX.Element => {
    return (
        <div className={cn("col-span-1 mb-1 border-b border-snow pb-[2px] uppercase", className)}>
            {children}
        </div>
    )
}

HoverCard.ListItem = HoverCardListItem;
HoverCard.TribunalBadge = HoverCardTribunalBadge;
HoverCard.Icon = HoverCardIcon;
HoverCard.Content = HoverCardContent;
HoverCard.HiddenContent = HoverCardHiddenContent;
HoverCard.InfoList = HoverCardInfoList;
HoverCard.Container = HoverCardContainer;


export default HoverCard;
