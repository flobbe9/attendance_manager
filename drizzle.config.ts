import type {Config} from "drizzle-kit";

/**
 * This  needs to stay inside a file called 'drizzle.config.ts'.
 *
 * @since 0.0.1
 */
export default {
    schema: "./backend/schemas/DbSchema.ts",
    dialect: "sqlite",
    out: "./drizzle",
    driver: "expo",
    casing: "snake_case",
} satisfies Config;
