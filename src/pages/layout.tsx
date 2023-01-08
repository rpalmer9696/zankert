import Head from "next/head";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Zankert</title>
        <meta name="description" content="Zankert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-rose-800 to-pink-300">
        {children}
        <footer className="flex h-24 w-full flex-col items-center justify-center">
          <p className="text-white">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/rpalmer9696"
              className="text-underline text-blue-200"
            >
              @rpalmer9696
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
};

export default Layout;
