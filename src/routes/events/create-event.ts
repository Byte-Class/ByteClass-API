import express from "express";

import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { authorizeRequest } from "../../core/middleware/authorize";
import { parseISO } from "date-fns";
import { db } from "../../core/drizzle/db";
import { event, timetable } from "../../core/drizzle/schema";
import { eq } from "drizzle-orm";
import { ColourType } from "../../core/types/types";

export const createEvent = express.Router();

const INVALID_DATE = "Invalid Date";

createEvent.post(
  "/",
  authorizeRequest,
  validateRequest({
    body: z.object({
      eventName: z.string(),
      description: z.string(),
      location: z.union([z.string(), z.undefined()]),
      dayOfEvent: z.string(),
      start: z.string(),
      end: z.string(),
      calendarId: z.string(),
      colour: z.custom<ColourType>(),
    }),
  }),
  async (req, res) => {
    if (!req.id) {
      return res
        .status(401)
        .send({ error: "Invalid requesting ID", code: 401 });
    }

    // verify days and times
    const day = parseISO(req.body.dayOfEvent);
    const start = parseISO(req.body.start);
    const end = parseISO(req.body.end);

    if (
      day.toString() === INVALID_DATE ||
      start.toString() === INVALID_DATE ||
      end.toString() === INVALID_DATE
    ) {
      return res.status(400).send({
        error: "day, start, or end times are invalid",
        code: 400,
      });
    }

    // Verify calender ID
    let calendarExists;

    try {
      calendarExists = await db
        .select()
        .from(timetable)
        .where(eq(timetable.id, req.body.calendarId));
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    if (calendarExists.length === 0) {
      return res.status(400).send({
        error: "the calendar you requested does not exist",
        code: 400,
      });
    }

    // Now we make the event
    try {
      await db.insert(event).values({
        name: req.body.eventName,
        day: req.body.dayOfEvent,
        description: req.body.description,
        timetableId: req.body.calendarId,
        time: {
          start: req.body.start,
          end: req.body.end,
        },
        colour: req.body.colour,
      });
    } catch (err) {
      return res.status(500).send({
        error: err,
        code: 500,
      });
    }

    return res.status(201).send("Successfully Created Event");
  }
);
