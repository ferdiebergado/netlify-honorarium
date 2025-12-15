import type { Config } from "@netlify/functions";
import { turso } from "./db";

export const config: Config = {
  method: "POST",
  path: "/activities",
};

type Activity = {
  title: string;
  venue: string;
  date: string;
  code: string;
  fund: string;
};

export default async (req: Request) => {
  const activity = (await req.json()) as Activity;

  const { title, venue, date, code, fund } = activity;
  const query =
    "INSERT INTO activities (title, venue, date, code, fund) VALUES (?, ?, ?, ?, ?)";
  const { lastInsertRowid } = await turso.execute(query, [
    title,
    venue,
    date,
    code,
    fund,
  ]);

  return Response.json({ lastInsertRowid });
};
