import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'vite-plugin-sass';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
// https://vitejs.dev/config/
return defineConfig({
  plugins: [react(), sass()],
  define: {
    'process.env': env
  }
})
}
