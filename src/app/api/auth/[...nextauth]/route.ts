import { handlers } from "@/logic/auth";

export const runtime = "edge";

export const { GET, POST } = handlers;
