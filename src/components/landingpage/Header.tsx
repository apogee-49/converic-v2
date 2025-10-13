'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

// Typdefinition für Props
interface HeaderProps {
  data: {
    logo: string | { url: string; meta?: { fileName?: string; size?: number } };
    tel: string;
    name: string;
  };
}

export default function Header({ data }: HeaderProps) {
  const header = data || {};

  return (
    <header className="bg-white w-full z-30 sticky top-0 border-b border-border flex">
      <div className="flex mx-auto place-items-center px-3 py-3 max-w-7xl w-full lg:px-10">

        <Link href="/">
          <Image 
            src={(header as any).logo?.url ?? ''} 
            width={130} 
            height={32} 
            alt={`${header.name} Logo`}
            priority
            className="h-6 w-auto lg:h-8"
          />
        </Link>

        <a href={'tel:' + header.tel} className="group flex place-items-center ml-auto">
          <div className="flex flex-col text-right leading-3">
            <span className="group-hover:text-atMain lg:text-bold lg:text-base text-xs font-bold">{header.tel}</span>
            <span className="group-hover:text-atMain lg:text-sm text-xs text-gray-600">{header.name}</span>
          </div>
          <Phone className="lg:w-6 lg:h-6 w-5 h-5 ml-3 text-primary" />
        </a>

      </div>
    </header>
  )
}