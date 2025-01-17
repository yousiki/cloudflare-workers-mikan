import { Hono, Context } from "hono";

type Bindings = {
  UPSTREAM: string;
};

const app = new Hono<{ Bindings: Bindings }>();

async function getUpstreamResponse(c: Context) {
  const url = new URL(c.req.url);
  url.protocol = "https:";
  url.hostname = c.env.UPSTREAM;
  url.port = "";
  const headers = new Headers(c.req.header());
  headers.delete("cf-connecting-ip");
  const body = c.req.method === "GET" ? null : await c.req.text();
  const request = new Request(url.toString(), {
    method: c.req.method,
    headers: headers,
    body: body,
    redirect: "manual",
  });
  return await fetch(request);
}

async function transformText(c: Context, response: Response) {
  const text = await response.text();
  const url = new URL(c.req.url);
  return text.replace(
    new RegExp(c.env.UPSTREAM, "g"),
    url.hostname + ":" + url.port
  );
}

app.get("/RSS/*", async (c: Context) => {
  const response = await getUpstreamResponse(c);
  const text = await transformText(c, response);
  return new Response(text, response);
});

app.all("/*", async (c: Context) => {
  return getUpstreamResponse(c);
});

export default app;
