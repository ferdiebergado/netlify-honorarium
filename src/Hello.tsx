import { useState } from "react";
import { Button } from "@/components/ui/button";

async function getHello() {
  try {
    const res = await fetch("/hello/me");
    if (!res.ok) throw new Error("fetch failed");
    const data: { message: string } = await res.json();
    console.log("gethello response:", res);
    console.log("gethello data.message:", data.message);

    return data;
  } catch (error) {
    console.error(error);
  }
}

export default function Hello() {
  const [msg, setMsg] = useState<string | undefined>();

  const handleClick = async () => {
    const data = await getHello();
    setMsg(data?.message);
  };

  return (
    <>
      <Button type="button" onClick={handleClick}>
        Greet
      </Button>
      <p>Message: {msg}</p>
    </>
  );
}
