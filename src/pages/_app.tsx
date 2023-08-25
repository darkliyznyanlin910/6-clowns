import { AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextPage } from "next/types";
import { ReactElement, ReactNode } from "react";
import { Header } from "~/components/header";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ClerkProvider {...pageProps}>
      <Header />
      {getLayout(<Component {...pageProps} />)}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
