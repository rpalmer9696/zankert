import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zankert</title>
        <meta name="description" content="Zankert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-800 to-pink-300">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Zankert
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Get ready to organise your life!
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData ? (
          <Link href="/boards" className="text-l text-blue-200 underline">
            Go to Boards
          </Link>
        ) : (
          ""
        )}
      </p>
      <button
        className="rounded-full bg-white/20 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/40"
        onClick={() => signIn("google", { callbackUrl: "/boards" })}
      >
        Sign In
      </button>
    </div>
  );
};
