import { calculateTimeLeft } from '@/functions/timer/timeCounter';
import { time } from 'console';
import React, { useEffect, useState } from 'react'

type TimerProps = {
    days?: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export const LiquidationTimeCounter = ({ purchaseDate }: { 
    purchaseDate: string
 }) => {

    const [timer, setTimer] = useState<TimerProps>(calculateTimeLeft(purchaseDate.split(".")[0]));

    useEffect(() => {
        if (!purchaseDate) return; // Não faz nada até a data de destino ser definida

        const timer = setInterval(() => {
            setTimer(calculateTimeLeft(purchaseDate.split(".")[0]));
        }, 1000);

        return () => clearInterval(timer);
    }, [purchaseDate]);

    return (
        <React.Fragment>
            {`${timer.hours}:${timer.minutes}:${timer.seconds}`}
        </React.Fragment>
    )
}
