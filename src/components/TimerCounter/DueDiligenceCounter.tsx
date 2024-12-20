import { calculateTimeLeft } from '@/functions/timer/timeCounter';
import React, { useEffect, useState } from 'react'

type TimerProps = {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export const DueDiligenceCounter = ({ dueDate }: {
    dueDate: string,
}) => {

    const [timer, setTimer] = useState<TimerProps>(calculateTimeLeft(dueDate.split(".")[0]));

    useEffect(() => {
        if (!dueDate) return; // Não faz nada até a data de destino ser definida

        const timer = setInterval(() => {
            setTimer(calculateTimeLeft(dueDate.split(".")[0]));
        }, 1000);

        return () => clearInterval(timer);
    }, [dueDate]);

    return (
        <div className='flex items-center gap-3 justify-center'>
            <div className='flex gap-1 items-center'>
                <p className='text-sm'>{timer.days}</p>
                <p className='text-[10px]'>{timer.days > "01" ? 'dias' : 'dia'}</p>
            </div>

            <div className="flex gap-1 items-center">
                <p className='text-sm'>{timer.hours}</p>
                <p className='text-[10px]'>{timer.hours > "01" ? 'horas' : 'hora'}</p>
            </div>

            <div className="flex gap-1 items-center">
                <p className='text-sm'>{timer.minutes}</p>
                <p className='text-[10px]'>{timer.minutes > "01" ? 'minutos' : 'minuto'}</p>
            </div>

            <div className="flex gap-1 items-center">
                <p className='text-sm'>{timer.seconds}</p>
                <p className='text-[10px]'>{timer.seconds > "01" ? 'segundos' : 'segundo'}</p>
            </div>
        </div>
    )
}
