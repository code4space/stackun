import { useEffect, useState } from "react";

export default function Stopwatch({ isRunning, reset }: { reset:boolean, isRunning: boolean }) {
    const [time, setTime] = useState(0);

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (reset) {
            setTime(0)
        }
    }, [reset])

    useEffect(() => {
        let intervalId: any;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    return (
        <div className="stopwatch">{formatTime(time)}</div>
    )
}