import type { Config } from "@netlify/functions";
import { turso } from "./db";

export const config: Config = {
  method: "GET",
  path: "/list-activities",
};

export default async () => {
  try {
    const query = "SELECT * FROM activities";
    const { rows } = await turso.execute(query);
    const data = rows.map((a) => ({
      ...a,
      startDate: a.start_date,
      endDate: a.end_date,
    }));
    return Response.json({ data });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
