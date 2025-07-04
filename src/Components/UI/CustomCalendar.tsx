import React from "react";
import { Calendar, Select, theme } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import dayLocaleData from "dayjs/plugin/localeData";
import "../../Styles/pages/_distributordashboard.scss";

dayjs.extend(dayLocaleData);

interface CustomCalendarProps {
  disabledDate?: (current: Dayjs) => boolean;
  onSelect?: (date: Dayjs) => void;
  onPanelChange?: CalendarProps<Dayjs>["onPanelChange"];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  disabledDate,
  onSelect,
  onPanelChange,
}) => {
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    overflowX: "auto",
  };

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month();

  const defaultDisabledDate = (current: Dayjs) => {
    return current.isAfter(dayjs(), "day");
  };

  return (
    <div style={wrapperStyle} className="">
      <Calendar
        fullscreen={false}
        disabledDate={disabledDate || defaultDisabledDate}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        headerRender={({ value, onChange }) => {
          const yearOptions = Array.from({ length: 5 }, (_, i) => {
            const year = currentYear - 4 + i;
            return { label: year.toString(), value: year };
          });

          const monthOptions =
            value.year() === currentYear
              ? Array.from({ length: currentMonth + 1 }, (_, i) => ({
                  label: dayjs().month(i).format("MMM"),
                  value: i,
                }))
              : Array.from({ length: 12 }, (_, i) => ({
                  label: dayjs().month(i).format("MMM"),
                  value: i,
                }));

          return (
            <div style={{ padding: 8, display: "flex", gap: "8px" }}>
              <Select
                style={{ width: "70px" }}
                size="small"
                value={value.year()}
                options={yearOptions}
                onChange={(newYear) => {
                  const newDate = value.clone().year(newYear);
                  onChange(newDate);
                }}
              />
              <Select
                style={{ width: "70px" }}
                size="small"
                value={value.month()}
                options={monthOptions}
                onChange={(newMonth) => {
                  const newDate = value.clone().month(newMonth);
                  onChange(newDate);
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default CustomCalendar;
