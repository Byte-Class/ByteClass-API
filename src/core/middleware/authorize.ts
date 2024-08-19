import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";

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
    console.log("e1");
    return res.sendStatus(401);
  }

  sessionId = convertStringArrayToString(sessionId);

  const drizzleRes = (
    await db
      .select({
        userId: session.userId,
      })
      .from(session)
      .where(eq(session.sessionToken, sessionId))
  )[0];

  if (!drizzleRes) {
    console.log("e2");
    return res.sendStatus(401);
  }

  req.id = drizzleRes.userId;

  next();
}

export { authorizeRequest };
