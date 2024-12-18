export const calculateTimeLeft = (date: string) => {

    let timeLeft = {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
    };
    const currentDate = +new Date();
    const limitDate = +new Date(date) + (24 * 60 * 60 * 1000); // substituir por date.split(".")[0]
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