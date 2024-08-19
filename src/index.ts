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

// Use all the routes
app.use("/api/calendars", createCalendar);
app.use("/api/calendars", fetchCalendarsSelf);
app.use("/api/calendars", fetchSpecificCalendarSelf);

app.all("/", async (req, res) => {
  return res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("API listening on port 3001");
});
