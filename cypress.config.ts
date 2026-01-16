import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3001',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        supportFile: false // Disabling support file if not needed or to avoid errors if missing
    },
});
