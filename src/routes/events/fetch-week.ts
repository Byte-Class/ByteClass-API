import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  eachDayOfInterval,
  endOfWeek,
  formatISO,
  parseISO,
  startOfWeek,
} from "date-fns";
import { z } from "zod";
import { and, eq, or } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

import { authorizeRequest } from "../../core/middleware/authorize";
import { db } from "../../core/drizzle/db";
import { event } from "../../core/drizzle/schema";

export const fetchWeek = express.Router();

const INVALID_DATE = "Invalid Date";

fetchWeek.get(
  "/",
  validateRequest({
    query: z.object({
      providedDate: z.string(),
      calendar: z.union([z.array(z.string()), z.string()]),
    }),
  }),
  authorizeRequest,
  async (req, res) => {
    if (!req.id) {
      return res
        .status(401)
        .send({ error: "Invalid requesting ID", code: 401 });
    }

    // Now we need to parse the query params
    const currentDay = parseISO(req.query.providedDate);

    if (currentDay.toString() === INVALID_DATE) {
      return res.status(400).send({
        error: "current day is invalid",
        code: 400,
      });
    }

    const start = startOfWeek(currentDay);
    const end = endOfWeek(currentDay);

    const week = eachDayOfInterval({
      start: start,
      end: end,
    });

    if (typeof req.query.calendar === "string") {
      try {
        // A week always has 7 days, so it's faster to index, than to write a loop (just thought I should mention 🤓🤓🤓🤓🤓)
        return res.send(
          await db
            .select()
            .from(event)
            .where(
              and(
                or(
                  eq(event.day, formatISO(week[0])),
                  eq(event.day, formatISO(week[1])),
                  eq(event.day, formatISO(week[2])),
                  eq(event.day, formatISO(week[3])),
                  eq(event.day, formatISO(week[4])),
                  eq(event.day, formatISO(week[5])),
                  eq(event.day, formatISO(week[6]))
                ),
                eq(event.timetableId, req.query.calendar)
              )
            )
        );
      } catch (err) {
        return res.status(500).send({ error: err, code: 500 });
      }
    }

    const selectEventSchema = createSelectSchema(event, {
      time: z.object({ start: z.string(), end: z.string() }),
    });
    type eventSchema = z.infer<typeof selectEventSchema>;

    const eventsInWeekToShow: eventSchema[] = [];

    for (let i = 0; i < req.query.calendar.length; i++) {
      try {
        // A week always has 7 days, so it's faster to index, than to write a loop (just thought I should mention 🤓🤓🤓🤓🤓)
        eventsInWeekToShow.push(
          (
            await db
              .select()
              .from(event)
              .where(
                and(
                  or(
                    eq(event.day, formatISO(week[0])),
                    eq(event.day, formatISO(week[1])),
                    eq(event.day, formatISO(week[2])),
                    eq(event.day, formatISO(week[3])),
                    eq(event.day, formatISO(week[4])),
                    eq(event.day, formatISO(week[5])),
                    eq(event.day, formatISO(week[6]))
                  ),
                  eq(event.timetableId, req.query.calendar[i])
                )
              )
          )[0]
        );
      } catch (err) {
        return res.status(500).send({ error: err, code: 500 });
      }
    }

    return res.send(eventsInWeekToShow);
  }
);
