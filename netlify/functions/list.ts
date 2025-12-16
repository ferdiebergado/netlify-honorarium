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
    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
