import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// See: https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // frontend runs here; backend runs separately on port 5000
    },
});
