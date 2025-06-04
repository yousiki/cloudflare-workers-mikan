import { Hono, Context } from "hono";

type Bindings = {
  UPSTREAM: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const bannerHtml = `
<div style="background:#ff8800;color:#fff;padding:10px 0;text-align:center;font-size:16px;font-family:sans-serif;z-index:9999;position:relative;">
  本网站为蜜柑计划的镜像，仅供中国大陆访问，原站点地址：
  <a href="https://mikanani.me" style="color:#fff;text-decoration:underline;font-weight:bold;" target="_blank">https://mikanani.me</a>
</div>
`;

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
  const hostWithPort = url.port ? `${url.hostname}:${url.port}` : url.hostname;
  return text.replace(new RegExp(c.env.UPSTREAM, "g"), hostWithPort);
}

app.get("/RSS/*", async (c: Context) => {
  const response = await getUpstreamResponse(c);
  const text = await transformText(c, response);
  return new Response(text, response);
});

app.all("/*", async (c: Context) => {
  const response = await getUpstreamResponse(c);
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    let text = await response.text();
    text = text.replace(/<body[^>]*>/i, (match) => `${match}\n${bannerHtml}`);
    return new Response(text, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } else {
    return response;
  }
});

export default app;
