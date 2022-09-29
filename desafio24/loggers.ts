import type { Context } from "./deps/deps.ts";

export const logger = async (ctx: Context, next: () => any) => {
  await next();
  const body = await ctx.request.body().value;
  const params = body ? `enviando color ${JSON.stringify(body)}` : "";
  console.log(`Metodo ${ctx.request.method} hacia ${ctx.request.url} ${params}`);
};