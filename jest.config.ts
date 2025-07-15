import type {Config} from 'jest';

const config: Config = {
    preset: "jest-expo",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/build/",
        "/dist/",
        "./test.ts"
    ],
    verbose: true,
};

export default config;