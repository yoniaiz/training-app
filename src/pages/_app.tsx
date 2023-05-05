import { type AppProps } from "next/app";
import { ClerkProvider, useAuth, useUser, useSignIn } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CacheProvider, type EmotionCache } from "@emotion/react";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "~/styles/theme";
import createEmotionCache from "~/utils/createEmotionCache";
import Head from "next/head";
import NavBar from "~/components/Navbar/Navbar";
import { useRouter } from "next/router";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MainContainer = ({ children }: { children: React.ReactNode }) => (
  <Container
    maxWidth="lg"
    sx={{
      height: "calc(100vh - 69px)",
    }}
  >
    {children}
  </Container>
);

const ContainerCentered = ({ children }: { children: React.ReactNode }) => (
  <MainContainer>
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  </MainContainer>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <div>
      <NavBar
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onLogout={async () => {
          await signOut();
          await router.push("/all");
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onLogin={() => router.push("/login")}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSingUp={() => router.push("/signup")}
        isSignedIn={isSignedIn || false}
        isLoaded={isLoaded}
        user={{
          firstName: user?.firstName || user?.username || "",
          profileImageURL: (user?.profileImageUrl as string) || "",
        }}
      />
      <ContainerCentered>{children}</ContainerCentered>
    </div>
  );
};

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ClerkProvider {...pageProps}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ClerkProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default api.withTRPC(MyApp);
