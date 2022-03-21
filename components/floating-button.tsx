import Link from "next/link";
import React from "react";

interface FloatingButton {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({ children, href }: FloatingButton) {
  return (
    <Link href={href}>
      <a className="fixed bottom-24 right-5 flex aspect-square w-14 cursor-pointer  items-center justify-center rounded-full border-0 border-transparent bg-pink-400 text-white shadow-xl transition-colors hover:bg-pink-500">
        {children}
      </a>
    </Link>
  );
}
