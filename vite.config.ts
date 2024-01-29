import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
// https://vitejs.dev/config/
return defineConfig({
  plugins: [
    sassGlobImports(),
    react(),
  ],
  define: {
    'process.env': env
  }
})
}
