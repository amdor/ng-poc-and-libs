module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    globalSetup: "jest-preset-angular/global-setup",
    testRegex: "(/test/.*\\.spec)\\.ts$",
    globals: {
        "ts-jest": {
            diagnostics: {
                ignoreCodes: [2564, 7034, 2488, 7005, 7006, 2339, 2345],
            },
        },
    },
};
