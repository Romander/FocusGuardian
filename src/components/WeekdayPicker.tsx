// WeekdayPicker.tsx

import React, { useCallback } from "react";

type WeekdayPickerProps = {
  selectedDays: string[];
  onChange: (selectedDays: string[]) => void;
};

const days = [
  { label: "Sun", value: "0" },
  { label: "Mon", value: "1" },
  { label: "Tue", value: "2" },
  { label: "Wed", value: "3" },
  { label: "Thu", value: "4" },
  { label: "Fri", value: "5" },
  { label: "Sat", value: "6" },
];

const WeekdayPicker: React.FC<WeekdayPickerProps> = (props) => {
  const { onChange } = props;

  const toggleDay = useCallback(
    (dayValue: string) => {
      if (props.selectedDays.includes(dayValue)) {
        onChange(props.selectedDays.filter((val) => val !== dayValue));
      } else {
        onChange([...props.selectedDays, dayValue]);
      }
    },
    [onChange, props.selectedDays]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <button
          key={day.value}
          onClick={() => toggleDay(day.value)}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer 
            ${
              props.selectedDays.includes(day.value)
                ? "bg-blue-500 text-white"
                : "bg-[#1a1a1a] text-white"
            }`}
          aria-label={day.label}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

export { WeekdayPicker };
