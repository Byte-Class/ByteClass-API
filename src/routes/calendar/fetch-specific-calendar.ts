import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { authorizeRequest } from "../../core/middleware/authorize";
import { db } from "../../core/drizzle/db";
import { timetable } from "../../core/drizzle/schema";
import { eq, and } from "drizzle-orm";

export const fetchSpecificCalendarSelf = express.Router();

fetchSpecificCalendarSelf.get(
  "/:userId/:calendarId",
  authorizeRequest,
  validateRequest({
    params: z.object({
      userId: z.string(),
      calendarId: z.string(),
    }),
  }),
  async (req, res) => {
    if (!req.id) {
      return res
        .status(401)
        .send({ error: "Invalid requesting ID", code: 401 });
    }

    let drizzleRes;

    // Fetch all the timetables with the user if provided as a param
    try {
      drizzleRes = await db
        .select()
        .from(timetable)
        .where(
          and(
            eq(timetable.userId, req.params.userId),
            eq(timetable.id, req.params.calendarId)
          )
        );
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    return res.send(drizzleRes);
  }
);
