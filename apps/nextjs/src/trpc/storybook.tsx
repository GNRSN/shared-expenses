/* eslint-disable react/display-name */
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";

import { api, getBaseUrl } from "./react";

export const StorybookTrpcProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } }),
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    }),
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};

type TrpcContext = ReturnType<(typeof api)["useContext"]>;

// Hack to be able to access trpcContext
const ActOnTrpcContext = ({
  callback,
  children,
}: PropsWithChildren<{
  callback: (trpcContext: TrpcContext) => void;
}>) => {
  const trpcContext = api.useContext();
  callback(trpcContext);
  return <>{children}</>;
};

export const withTrpcContext =
  (callback: (context: TrpcContext) => void) => (Story: React.FC) => (
    <ActOnTrpcContext callback={callback}>
      <Story />
    </ActOnTrpcContext>
  );
