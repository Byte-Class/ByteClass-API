import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Import all routes
import { createCalendar } from "./routes/calendar/create-calendar";
import { fetchCalendarsSelf } from "./routes/calendar/fetch-all-calendars";
import { fetchSpecificCalendarSelf } from "./routes/calendar/fetch-specific-calendar";
import { toggleCalendar } from "./routes/calendar/toggle-calendar";

import { createEvent } from "./routes/events/create-event";
import { fetchWeek } from "./routes/events/fetch-week";

// Use all the routes
app.use("/api/calendars", createCalendar);
app.use("/api/calendars", fetchCalendarsSelf);
app.use("/api/calendars", fetchSpecificCalendarSelf);
app.use("/api/calendars", toggleCalendar);

app.use("/api/events", createEvent);
app.use("/api/events/week", fetchWeek);

app.all("/", async (req, res) => {
  return res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("API listening on port 3001");
});
