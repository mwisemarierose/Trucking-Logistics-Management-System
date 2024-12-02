// _app.tsx
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
