import { Difficulty } from "../Difficulty";
// import { Timer } from '../Timer'
import { Numbers } from "../Numbers";
import { Action } from "../Action";
import { Mode } from "../Mode";

interface StatusSectionProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClickNumber: (number: string) => void;
  onClickUndo: () => void;
  onClickErase: () => void;
  onClickFastMode: () => void;
  onClickScoreboard: () => void;
}

/**
 * React component for the Status Section.
 */
export const StatusSection = (props: StatusSectionProps) => {
  return (
    <section className="status">
      <Difficulty onChange={props.onChange} />
      {/* <Timer /> */}
      <Numbers onClickNumber={(number) => props.onClickNumber(number)} />
      <div className="status__actions">
        <Action action="undo" onClickAction={props.onClickUndo} />
        <Action action="erase" onClickAction={props.onClickErase} />
        <Mode onClickMode={props.onClickFastMode} />
        <div
          className={"status__action-scores"}
          onClick={props.onClickScoreboard}
        >
          <svg
            className="status__action-svg"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 40 40"
          >
            <path
              fill="hsl(213, 30%, 59%)"
              d="M28.6 29.4c3-2.3 7.4-5.7 7.4-18.4v-1H14v1c0 12.7 4.5 16.1 7.4 18.4c1.7 1.3 2.6 2 2.6 3.6v3c-1.6.2-3.2.8-3.8 2H18c-1.1 0-2 .9-2 2h18c0-1.1-.9-2-2-2h-2.2c-.6-1.2-2.1-1.8-3.8-2v-3c0-1.6.8-2.3 2.6-3.6zm-3.6.5c-.6-.8-1.5-1.5-2.3-2.1c-2.7-2.1-6.4-4.9-6.6-15.8h18c-.2 10.8-3.9 13.7-6.6 15.8c-1 .7-1.9 1.3-2.5 2.1z"
            />
            <path
              fill="hsl(213, 30%, 59%)"
              d="M18.8 27C18.7 27 8 24.7 8 13v-1h7v2h-5c.6 9.2 9.1 11 9.2 11l-.4 2zm12.4 0l-.4-2c.4-.1 8.6-1.9 9.2-11h-5v-2h7v1c0 11.7-10.7 14-10.8 14z"
            />
          </svg>
          <p className="status__action-text">Scoreboard</p>
        </div>
      </div>
    </section>
  );
};
