'use client';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface SheetProps {
    side: 'top' | 'right' | 'bottom' | 'left';
    nameButton: any;
    id?: string | number;
    children: React.ReactNode;
    className?: string;
    classNameContent?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    footerButton?: string;
    onSubmit?: () => void | Promise<void>;
    open?: boolean;
}

/**
 * @description - Componente reutilizável para criação de modal sheet por meio de um botão trigger,
 * caso queira adicionar um formulário, basta passar o texto no footerButton Exemplo "salvar" e montar a estrutura com o SheetFooter.
 * Esse botão será responsável por fechar o modal após a requisição.
 * @param {SheetProps} props
 * @param {string} props.side - Lado que o modal irá abrir.
 * @param {string} props.nameButton - Nome do botão que irá abrir o modal.
 * @param {string} props.id - Id do modal, caso esteja em uma tabela.
 * @param {React.ReactNode} props.children - Conteúdo do modal.
 * @param {string} props.className - Classe do botão que ficará externo.
 * @param {string} props.classNameContent - Classe do conteúdo do modal.
 * @param {string} props.title - Título do modal.
 * @param {string} props.description - Descrição do titulo do modal.
 * @param {React.ReactNode} props.footer - Rodapé do modal.
 * @param {string} props.footerButton - Botão do rodapé do modal que fecha automaticamente após a ação.
 * @param {() => void | Promise<void>} props.onSubmit - Função que será executada se for passada na propriedade.
 * @returns {React.ReactNode} - Retorna o modal com o botão trigger.
 */
export function SheetCelerComponent({
    side,
    nameButton,
    id,
    className,
    classNameContent,
    children,
    title,
    description,
    footer,
    footerButton,
    onSubmit,
    open,
}: SheetProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={open} key={side}>
                <SheetTrigger asChild>
                    <Button variant="outline" className={`${className}`}>
                        {nameButton}
                    </Button>
                </SheetTrigger>
                <SheetContent side={side} className={`${classNameContent}`}>
                    {title && (
                        <SheetHeader>
                            <SheetTitle>{title}</SheetTitle>
                            {description && <SheetDescription>{description}</SheetDescription>}
                        </SheetHeader>
                    )}
                    {children}
                    {footerButton && (
                        <SheetFooter>
                            <SheetClose asChild>{footerButton}</SheetClose>
                        </SheetFooter>
                    )}
                    {footer && <SheetFooter>{footer}</SheetFooter>}
                </SheetContent>
            </Sheet>
        </div>
    );
}
