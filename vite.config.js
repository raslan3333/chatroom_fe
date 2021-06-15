import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build : {
    outDir: '/IdeaProjects/chatroom/src/main/resources/public',
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
  },

})
