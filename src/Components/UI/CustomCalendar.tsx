import React from "react";
import { Calendar, Flex, Radio, Select, theme } from "antd";
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

  return (
    <div style={wrapperStyle} className="container">
      <Calendar
        fullscreen={false}
        disabledDate={disabledDate}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const year = value.year();
          const month = value.month();

          const yearOptions = Array.from({ length: 20 }, (_, i) => {
            const label = year - 10 + i;
            return { label, value: label };
          });

          const monthOptions = value
            .localeData()
            .monthsShort()
            .map((label, index) => ({
              label,
              value: index,
            }));

          return (
            <div style={{ padding: 8 }}>
              <Flex wrap="wrap" gap={8}>
                <Radio.Group
                  size="small"
                  onChange={(e) => onTypeChange(e.target.value)}
                  value={type}
                >
                  <Radio.Button value="month">Month</Radio.Button>
                  <Radio.Button value="year">Year</Radio.Button>
                </Radio.Group>
                <Select
                  size="small"
                  value={year}
                  options={yearOptions}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                />
                <Select
                  size="small"
                  style={{ width: "4rem" }}
                  value={month}
                  options={monthOptions}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                />
              </Flex>
            </div>
          );
        }}
      />
    </div>
  );
};

export default CustomCalendar;
