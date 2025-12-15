import { type Config, type Context } from "@netlify/functions";

export const config: Config = {
  method: "GET",
  path: ["/hello/:name"],
};

export default async (req: Request, context: Context) => {
  const { name } = context.params;

  console.log("name", name);

  const data = { message: `Hello ${name}!` };
  return Response.json(data);
};
