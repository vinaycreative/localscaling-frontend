import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import Header from "./header";

interface PageProps {
  navURL: string;
  navURLCount?: string;
  children: React.ReactNode;
}

const Page = ({ children, navURL, navURLCount }: PageProps) => {
  return (
    <div className="h-dvh px-4 flex flex-col ">
      <Header>
        <Link
          href={`/${navURL.toLowerCase()}`}
          className="flex gap-2 text-primary text-sm items-center cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
          {navURL}
          {navURLCount && (
            <span className="text-sm text-destructive ml-1">
              [{navURLCount}]
            </span>
          )}
        </Link>
      </Header>
      {children}
    </div>
  );
};

export default Page;
