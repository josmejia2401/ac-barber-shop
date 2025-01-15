import React, { useState, useEffect } from "react";
import "./style.css";
export const Stopwatch = (props) => {
    const [time, setTime] = useState(0);
    const [data, setData] = useState({ startDate: null, endDate: null, elapsed: 0 });
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTime(time + 1), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);
    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;

    // Method to start and stop timer
    const startAndStop = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setIsRunning(!isRunning);
        const newData = {
            startDate: data.startDate, endDate: data.endDate, elapsed: data.elapsed
        };
        if (isRunning === false && data.startDate === null) {
            newData.startDate = new Date();
        } else if (isRunning === true) {
            newData.elapsed = (hours * 60 * 60) + (minutes * 60) + seconds;
            newData.endDate = new Date();
        }
        setData(newData);
        props.handle(newData);
    };
    const reset = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setTime(0);
        props.handle({
            startDate: new Date(), endDate: new Date(), elapsed: 0
        });
    };
    return (
        <div className="stopwatch-container">
            <p className="stopwatch-time p-stop">
                {hours}:{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}:
                {milliseconds.toString().padStart(2, "0")}
            </p>
            <div className="stopwatch-buttons">
                <button className="stopwatch-button" onClick={startAndStop}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button className="stopwatch-button" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
};