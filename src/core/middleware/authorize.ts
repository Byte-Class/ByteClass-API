import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../drizzle/db";
import { session } from "../drizzle/schema";
import { convertStringArrayToString } from "../utils/convert-string";

async function authorizeRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let sessionId = req.headers.session;

  if (!sessionId) {
    return res.sendStatus(401);
  }

  sessionId = convertStringArrayToString(sessionId);

  const drizzleRes = await db
    .select({
      userId: session.userId,
    })
    .from(session)
    .where(eq(session.sessionToken, sessionId));

  if (drizzleRes.length === 0) {
    return res.sendStatus(401);
  }

  next();
}

export { authorizeRequest };
