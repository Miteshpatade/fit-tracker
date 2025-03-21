declare module "react-horizontal-datepicker" {
    import React from "react";
  
    interface DatePickerProps {
      getSelectedDay?: (val: Date) => void;
      endDate?: number;
      selectDate?: Date;
      labelFormat?: string;
      color?: string;
    }
  
    const DatePicker: React.FC<DatePickerProps>;
    export default DatePicker;
  }
  