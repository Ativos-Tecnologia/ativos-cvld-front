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
        <div className='flex flex-col items-center justify-center text-snow'>

            <h2>Prazo final em:</h2>

            <div className='flex gap-4'>
                <p>{timer.days} {timer.days > "01" ? 'dias' : 'dia'}</p>
                <p>{timer.hours} {timer.hours > "01" ? 'horas' : 'hora'}</p>
            </div>

            <div className='flex gap-4'>
                <p>{timer.minutes} {timer.minutes > "01" ? 'minutos' : 'minuto'}</p>
                <p>{timer.seconds} {timer.seconds > "01" ? 'segundos' : 'segundo'}</p>
            </div>

        </div>
    )
}
