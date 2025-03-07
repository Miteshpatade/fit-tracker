"use client";
import React from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic"; // Import dynamic

// Dynamically import DatePicker
const DatePicker = dynamic(() => import("react-horizontal-datepicker"), {
  ssr: false,
});

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = "#ffc20e";

  const selectedDay = (val: Date) => {
    console.log(val);
  };

  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17T15:30"));

  return (
    <div className="popupout">
      <div className="popupbox">
        <button
          className="close"
          onClick={() => {
            setShowCalorieIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>

        <DatePicker
          getSelectedDay={selectedDay} // Now TypeScript won't throw an error
          endDate={100}
          selectDate={new Date()}
          labelFormat={"MMMM"}
          color={color}
        />

        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" />
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" />
        <div className="timebox">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
          </LocalizationProvider>
        </div>
        <Button variant="contained" color="warning">
          Save
        </Button>
        <div className="hrline"></div>
        <div className="items">
          <div className="item">
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>
          <div className="item">
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>
          <div className="item">
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button>
              <AiFillDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
