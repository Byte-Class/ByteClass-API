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
    body: z.object({ tableName: z.string(), description: z.string().max(200) }),
  }),
  async (req, res) => {
    if (!req.id) {
      return res
        .status(401)
        .send({ error: "Invalid requesting ID", code: 401 });
    }

    // Now we just need to create the table
    try {
      await db.insert(timetable).values({
        name: req.body.tableName,
        userId: req.id as string,
        description: req.body.description,
      });
    } catch (err) {
      return res.status(500).send({ error: err, code: 500 });
    }

    return res.status(201).send({ detail: "Successfully created calendar" });
  }
);
