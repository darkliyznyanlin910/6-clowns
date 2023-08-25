import Navbar from "./navbar";
import { useUser } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const { user: sessionData } = useUser();

  // navigator.geolocation.getCurrentPosition((geo) => {
  //   console.log(geo.coords.latitude, geo.coords.longitude);
  // });

  return (
    <div className="min-w-screen flex min-h-screen flex-col bg-[#fff0E3] text-black">
      <Navbar />
      <main className="mt-16 flex flex-1 flex-col">{children}</main>
      <footer className="border-t-1 flex h-10 items-center justify-center border">
        <p>Copyright © 2023 Jiak!</p>
      </footer>
    </div>
  );
};

export default MainLayout;
