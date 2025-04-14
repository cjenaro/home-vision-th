import { createCookieSessionStorage } from "react-router";
import type { House } from "./routes/houses";
type SessionData = {
  savedHouses: House[];
};

type SessionFlashData = {
  error: string;
};

const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
      secrets: COOKIE_SECRET,
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
