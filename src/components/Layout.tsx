import Head from "next/head";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Mittwatt</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <nav className="">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-white">
                  <Image
                    src={"/images/logo.jpg"}
                    width={50}
                    height={50}
                    alt="Mittwatt"
                  />
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white"
                >
                  Home
                </Link>
                <Link
                  href="/current"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white"
                >
                  Current
                </Link>
                <Link
                  href="/future"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white"
                >
                  Future
                </Link>
                <Link
                  href="/past"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white"
                >
                  Past
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome to{" "}
            <span className="text-[hsl(280,100%,70%)]">Mittwatt</span> App
          </h1>

          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
