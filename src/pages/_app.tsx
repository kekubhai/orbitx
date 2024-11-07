
import "@/styles/globals.css";
import type { AppProps } from "next/app";
// Import the ThemeProvider and useTheme hook from shadcn
import { ThemeProvider, useTheme } from "next-themes";// {{ edit_1 }}

function ThemeToggle() { // {{ edit_2 }}
  const { theme, setTheme } = useTheme(); // {{ edit_3 }}
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      
    </button>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider> {/* {{ edit_4 }} */}
      <ThemeToggle /> {/* {{ edit_5 }} */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}