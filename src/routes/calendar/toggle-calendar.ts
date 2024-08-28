import express from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

import { authorizeRequest } from "../../core/middleware/authorize";
import { db } from "../../core/drizzle/db";
import { timetable } from "../../core/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const toggleCalendar = express.Router();

toggleCalendar.put(
  "/:calendarId",
  authorizeRequest,
  validateRequest({
    params: z.object({
      calendarId: z.string(),
    }),
  }),
  async (req, res) => {
    if (!req.id) {
      return res
        .status(401)
        .send({ error: "Invalid requesting ID", code: 401 });
    }

    // check if the user owns the calendar
    let drizzleRes;

    try {
      drizzleRes = await db
        .select()
        .from(timetable)
        .where(
          and(
            eq(timetable.userId, req.id),
            eq(timetable.id, req.params.calendarId)
          )
        );
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    if (drizzleRes.length === 0) {
      return res.status(400).send({
        error: "You do not own this calendar, so you can not toggle it.",
        code: 400,
      });
    }

    // Now we can toggle it, just update it :)
    // get the initial check from the already fetched calendar, which will always be [0], cause there is only 1 calendar with that id, then we switch it with the ! operator
    const changeCheck = !drizzleRes[0].checked;

    try {
      await db
        .update(timetable)
        .set({
          checked: changeCheck,
        })
        .where(eq(timetable.id, req.params.calendarId));
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    return res.status(200).send({
      detail: "Successfully toggled calendar",
    });
  }
);
