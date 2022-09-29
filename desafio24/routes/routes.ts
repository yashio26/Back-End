import { Router } from "../deps/deps.ts";
import {
  createColor,
  findColors,
  pageColor,
} from "../controllers/controllers.tsx";

export const router = new Router()
  .get("/api/colors", findColors)
  .post("/api/colors", createColor)
  .get("/", pageColor);