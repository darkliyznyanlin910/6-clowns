import { createContext, useEffect, useState } from "react";
import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";
import type { ICustomMetadata } from "~/types/customMetadata";
import { api } from "~/utils/api";
import type { Org } from "@prisma/client";

interface Props {
  children: React.ReactNode;
}

export const OrgContext = createContext<Org | undefined>(undefined);

const MainLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const [org, setOrg] = useState<Org>();
  const [orgId, setOrgId] = useState<string>();

  useEffect(() => {
    if (isLoaded && !!user) {
      const { orgId: data } = user.publicMetadata as ICustomMetadata;
      setOrgId(data);
    }
  }, [isLoaded]);

  const { data, isLoading } = api.org.getDetails.useQuery(
    { orgId: orgId ?? "" },
    {
      enabled: !!orgId,
    }
  );

  useEffect(() => {
    if (!isLoading && data?.status == "success") {
      setOrg(data.data);
    }
  }, [isLoading]);

  return (
    <OrgContext.Provider value={org}>
      <div className="min-w-screen flex min-h-screen flex-col bg-primary">
        <Navbar />
        <main className="mt-16 flex flex-1 flex-col px-4 pt-4">
          <div className="container mx-auto mb-4 w-full md:w-3/4 lg:w-2/3">
            {children}
          </div>
        </main>
        <footer className="border-t-1 flex h-10 w-full items-center justify-center border bg-primary">
          <p>Copyright © 2023 Jiak!</p>
        </footer>
      </div>
    </OrgContext.Provider>
  );
};

export default MainLayout;
