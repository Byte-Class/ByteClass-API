import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { authorizeRequest } from "../../core/middleware/authorize";
import { db } from "../../core/drizzle/db";
import { timetable } from "../../core/drizzle/schema";

export const createCalendar = express.Router();

createCalendar.post(
  "/",
  authorizeRequest,
  validateRequest({
    body: z.object({ tableName: z.string() }),
  }),
  async (req, res) => {
    if (!req.id) {
      return res.sendStatus(400);
    }

    // Now we just need to create the table
    try {
      await db.insert(timetable).values({
        name: req.body.tableName,
        userId: req.id as string,
      });
    } catch {
      return res.sendStatus(500);
    }

    return res.sendStatus(200);
  }
);
