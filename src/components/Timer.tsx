import { useEffect, useState } from "react";
import moment from "moment";
import { useSudokuContext } from "../context/SudokuContext";

/**
 * React component for the Timer in Status Section.
 * Uses the 'useEffect' hook to update the timer every minute.
 */
export const Timer = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const { timeGameStarted, won, elapsedTime } = useSudokuContext();

  useEffect(() => {
    if (!won) setTimeout(() => tick(), 1000);
  });

  function tick() {
    setCurrentTime(moment());
  }

  function getTimer() {
    const secondsTotal = currentTime.diff(timeGameStarted, "seconds");
    if (secondsTotal <= 0) return "00:00";
    const duration = moment.duration(secondsTotal + elapsedTime, "seconds");
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    let stringTimer = "";

    stringTimer += hours ? `${hours}:` : "";
    stringTimer += minutes ? `${(minutes < 10 ? "0" : "") + minutes}:` : "00:";
    stringTimer += seconds < 10 ? `0${seconds}` : seconds;

    return stringTimer;
  }

  return <div className="status__time">{getTimer()}</div>;
};
