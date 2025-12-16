import type { Config } from "@netlify/functions";
import { Activity } from "./activity";
import { turso } from "./db";

export const config: Config = {
  method: "POST",
  path: "/create-activity",
};

export default async (req: Request) => {
  console.log("creating activity...");
  try {
    const activity = (await req.json()) as Activity;

    const { title, venue, startDate, endDate, code, fund } = activity;
    const query =
      "INSERT INTO activities (title, venue, start_date, end_date, code, fund) VALUES (?, ?, ?, ?, ?, ?)";
    await turso.execute(query, [title, venue, startDate, endDate, code, fund]);

    return Response.json({ message: "activity created" });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
