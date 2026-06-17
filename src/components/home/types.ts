import type { listServices } from "@/lib/orders.functions";

export type Service = Awaited<ReturnType<typeof listServices>>[number];
