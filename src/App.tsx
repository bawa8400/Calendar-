import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getColor(pnl: number) {
  if (pnl > 0) return "#b6fcb6"; // Green
  if (pnl < 0) return "#ffb3b3"; // Red
  if (pnl === 0) return "#b3d1ff"; // Blue
  return "#f0f0f0"; // Default
}

interface RecordType {
  pnl: number;
  note: string;
}

type RecordsType = {
  [key: string]: RecordType;
};

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<RecordsType>({});
  const [pnl, setPnl] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Load from localStorage
  useEffect(() => {
    const data = localStorage.getItem("tradingRecords");
    if (data) setRecords(JSON.parse(data));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tradingRecords", JSON.stringify(records));
  }, [records]);

  // When date changes, load its data
  useEffect(() => {
    const key = getDateKey(selectedDate);
    if (records[key]) {
      setPnl(records[key].pnl.toString());
      setNote(records[key].note);
    } else {
      setPnl("");
      setNote("");
    }
  }, [selectedDate, records]);

  const handleSave = () => {
    const key = getDateKey(selectedDate);
    setRecords({
      ...records,
      [key]: { pnl: Number(pnl), note },
    });
  };

  // Calendar tile coloring
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const key = getDateKey(date);
      if (records[key]) {
        return (
          <div
            style={{
              background: getColor(records[key].pnl),
              borderRadius: "50%",
              width: 30,
              height: 30,
              margin: "auto",
            }}
          ></div>
        );
      }
    }
    return null;
  };

  return (
    <div className="container">
      <h2>Trading P&L Calendar</h2>
      <Calendar
        onChange={(date: Date) => setSelectedDate(date)}
        value={selectedDate}
        tileContent={tileContent}
      />
      <div className="entry">
        <h3>
          {selectedDate.toDateString()}
        </h3>
        <label>
          Profit/Loss ($):{" "}
          <input
            type="number"
            value={pnl}
            onChange={(e) => setPnl(e.target.value)}
          />
        </label>
        <br />
        <label>
          Note:{" "}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "80%" }}
          />
        </label>
        <br />
        <button onClick={handleSave}>Save</button>
      </div>
      <div className="legend">
        <span style={{ background: "#b6fcb6" }}></span> Profit
        <span style={{ background: "#ffb3b3" }}></span> Loss
        <span style={{ background: "#b3d1ff" }}></span> No Trade
      </div>
    </div>
  );
}

export default App;