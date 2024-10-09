import { time } from 'console';
import React, { useEffect, useState } from 'react'

type TimerProps = {
    days?: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export const LiquidationTimeCounter = ({ purchaseDate }: { purchaseDate: string }) => {


    const calculateTimeLeft = (date: string) => {

        let timeLeft = {
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00"
        };
        const currentDate = +new Date();
        const limitDate = +new Date(date.split(".")[0]) + (24 * 60 * 60 * 1000); // substituir por date.split(".")[0]
        const diff = limitDate - currentDate;

        if (diff > 0) {
            timeLeft = {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
                minutes: Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0"),
                seconds: Math.floor((diff / 1000) % 60).toString().padStart(2, "0"),
            };
        }

        return timeLeft
    };

    const [timer, setTimer] = useState(calculateTimeLeft(purchaseDate));

    useEffect(() => {
        if (!purchaseDate) return; // Não faz nada até a data de destino ser definida

        const timer = setInterval(() => {
            setTimer(calculateTimeLeft(purchaseDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [purchaseDate]);

    return (
        <React.Fragment>
            {`${timer.hours}:${timer.minutes}:${timer.seconds}`}
        </React.Fragment>
    )
}
