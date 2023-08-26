import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const { user: sessionData } = useUser();

  return (
    <div className="min-w-screen flex min-h-screen flex-col bg-primary">
      <Navbar />
      <main className="mt-16 flex px-4 pt-4">
        <div className="container mx-auto mb-4 w-full md:w-3/4 lg:w-2/3">
          {children}
        </div>
      </main>
      <footer className="border-t-1 absolute bottom-0 flex h-10 w-full items-center justify-center border">
        <p>Copyright © 2023 Jiak!</p>
      </footer>
    </div>
  );
};

export default MainLayout;
