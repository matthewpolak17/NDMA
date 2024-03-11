import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the Component in the SessionProvider
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
