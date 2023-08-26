import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import Image from "next/image";
const Navbar = () => {
  const router = useRouter();
  const test = router.pathname;
  const { user, isLoaded } = useUser();
  return (
    <nav className="navbar fixed top-0 z-10 flex h-16 w-full items-center justify-between px-4 py-2 shadow-md">
      <div className="nav-left flex h-full w-auto">
        <SignedIn>
          <li className="flex h-full w-auto items-center justify-center">
            <UserButton />
          </li>
          {isLoaded && (
            <li className="hidden h-full w-auto items-center justify-center pl-2 md:flex">
              <p>Hi, {user?.fullName}! </p>
            </li>
          )}
        </SignedIn>
      </div>
      <div className="nav-center">
        <Link href={"/"}>
          <Image
            src={"/icon.png"}
            alt={""}
            width={63}
            height={63}
            className="h-full w-auto py-2"
          />
        </Link>
      </div>
      <ul className="nav-right flex h-full w-auto items-center space-x-5">
        <SignedIn>
          <li className="hidden w-auto items-center justify-center font-semibold md:flex">
            <Link href={"/org/join"} className="font-semibold">
              <p>Are you a business? </p>
            </Link>
          </li>
          <li className="w-auto items-center justify-center font-semibold md:flex">
            <Link href={"/post/create"} className="font-semibold">
              <div className="rounded-b-xl rounded-l-2xl rounded-r-2xl bg-[#FF5631] px-2 py-2 text-white">
                + New Lobang
              </div>
            </Link>
          </li>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn font-semibold">Login</button>
          </SignInButton>
        </SignedOut>
      </ul>
    </nav>
  );
};

export default Navbar;
