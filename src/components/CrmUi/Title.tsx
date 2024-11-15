import React from 'react'

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ text, children, ...props }: TitleProps) => {

    const [visible, setVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setPosition({ x: e.clientX, y: e.clientY });
        setVisible(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    return (
        <div
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseLeave={handleMouseLeave}
            {
                ...props
            }
        // className='inline-block'
        >
            {children}

            {text && (
                <>
                    <div
                        style={{
                            top: position.y + 10, // Ajusta a posição vertical do tooltip
                            left: position.x + 10, // Ajusta a posição horizontal do tooltip
                        }}
                        className={`${visible ? 'opacity-100 transition-opacity duration-200 delay-200' : 'opacity-0 transition-opacity duration-200 delay-0'} fixed z-9999 bg-white border border-slate-600 dark:bg-slate-600 py-1 px-2 rounded-sm pointer-events-none whitespace-nowrap text-xs`}
                    >
                        {text}
                    </div>
                </>
            )}
        </div>
    )
}

export default Title