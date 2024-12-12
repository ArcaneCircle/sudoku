import { useSudokuContext } from "../context/SudokuContext";

interface DifficultyProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * React component for the Difficulty Selector.
 */
export const Difficulty = (props: DifficultyProps) => {
  const { difficulty } = useSudokuContext();

  return (
    <div className="status__difficulty">
      <span className="status__difficulty-text">Difficulty:&nbsp;&nbsp;</span>
      <select
        name="status__difficulty-select"
        className="status__difficulty-select"
        defaultValue={difficulty}
        onChange={props.onChange}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="expert">Expert</option>
      </select>
    </div>
  );
};
