import { signOut } from "next-auth/react";

const Header = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-5xl">
        Zankert
      </h1>
      <button
        className="rounded-full bg-white/20 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/40 sm:px-10"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Header;
