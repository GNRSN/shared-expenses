import type { DataTransformer } from "@trpc/server/unstable-core-do-not-import";
import { parse, stringify } from "devalue";

/**
 * Define and export transformer since it is needed on clients as well
 *
 * NOTE: tRPC recommends superjson but it doesn't work with dates in dev when
 * using the nextjs edge runtime.
 * @see https://github.com/t3-oss/create-t3-turbo/issues/1110
 */
export const transformer: DataTransformer = {
  serialize: (data: object) => stringify(data),
  deserialize: (data: string) => parse(data) as object,
};
