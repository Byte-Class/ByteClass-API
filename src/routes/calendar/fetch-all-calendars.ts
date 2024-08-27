import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { authorizeRequest } from "../../core/middleware/authorize";
import { db } from "../../core/drizzle/db";
import { timetable } from "../../core/drizzle/schema";
import { eq } from "drizzle-orm";

export const fetchCalendarsSelf = express.Router();

fetchCalendarsSelf.get(
  "/:userId",
  authorizeRequest,
  validateRequest({
    params: z.object({
      userId: z.string(),
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
        .where(eq(timetable.userId, req.params.userId));
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    return res.send(drizzleRes);
  }
);
