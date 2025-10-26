import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import Header from "./header";

interface PageProps {
  navURL: string;
  children: React.ReactNode;
}

const Page = ({ children, navURL }: PageProps) => {
  return (
    <div className="h-dvh px-4 flex flex-col overflow-auto">
      <Header>
        <Link
          href={`/${navURL.toLowerCase()}`}
          className="flex gap-2 text-primary text-sm items-center cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
          {navURL}
        </Link>
      </Header>
      {children}
    </div>
  );
};

export default Page;
