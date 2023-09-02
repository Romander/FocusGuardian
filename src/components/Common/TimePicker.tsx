import { ChangeEvent } from "react";

type TimePickerProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TimePicker: React.FC<TimePickerProps> = (props) => {
  return (
    <input
      className="appearance-none text-center p-2 border border-gray-300 rounded shadow-sm bg-white text-black"
      type="time"
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export { TimePicker };
