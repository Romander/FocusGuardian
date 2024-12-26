import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

type WeekdayPickerProps = {
  selectedDays: string[];
  onChange: (selectedDays: string[]) => void;
};

const WeekdayPicker: React.FC<WeekdayPickerProps> = (props) => {
  const { t } = useTranslation();

  const days = useMemo(
    () => [
      {
        label: t("weekday_sun"),
        value: "0",
        title: t("weekday_sunday"),
      },
      {
        label: t("weekday_mon"),
        value: "1",
        title: t("weekday_monday"),
      },
      {
        label: t("weekday_tue"),
        value: "2",
        title: t("weekday_tuesday"),
      },
      {
        label: t("weekday_wed"),
        value: "3",
        title: t("weekday_wednesday"),
      },
      {
        label: t("weekday_thu"),
        value: "4",
        title: t("weekday_thursday"),
      },
      {
        label: t("weekday_fri"),
        value: "5",
        title: t("weekday_friday"),
      },
      {
        label: t("weekday_sat"),
        value: "6",
        title: t("weekday_saturday"),
      },
    ],
    [t],
  );

  const { onChange } = props;

  const toggleDay = useCallback(
    (dayValue: string) => {
      if (props.selectedDays.includes(dayValue)) {
        onChange(props.selectedDays.filter((val) => val !== dayValue));
      } else {
        onChange([...props.selectedDays, dayValue]);
      }
    },
    [onChange, props.selectedDays],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <button
          key={day.value}
          title={day.title}
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
