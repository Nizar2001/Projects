'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';

type NavButtonProps = {
  text: string;
  href: string;
};

export default function NavButton({ text, href }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href}
      className={`
        flex items-center justify-center
        w-[105px] h-[60px] my-[10px] px-[10px]
        bg-[#D9D9D9]
        hover:bg-[#C4C4C4]
        active:bg-[#C4C4C4]
        ${isActive ? 'bg-[#F3F3F3] hover:bg-[#F3F3F3]' : 'bg-[#D9D9D9]'}
      `}
    >
      <h1 className="text-black text-center">{text}</h1>
    </Link>
  );
}