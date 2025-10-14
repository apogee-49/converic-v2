'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { Icon, type IconName } from "@/components/ui/icon-picker"

// Typdefinition für Props
interface HeaderProps {
  data: {
    logo: string | { url: string; meta?: { fileName?: string; size?: number } };
    tel?: string;
    sticky?: boolean;
    topPadding?: string | number;
    bottomPadding?: string | number;
    imageSize?: string | number;
    buttonText1?: string;
    buttonText2?: string;
    link?: string;
    buttonIcon?: IconName;
  };
}

export default function Header({ data }: HeaderProps) {
  const header = data || {};

  const ensurePx = (value: string | number | undefined): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    return value.endsWith('px') ? value : `${value}px`;
  };

  const parsePxNumber = (value: string | number | undefined, fallback: number): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value));
    if (typeof value === 'string') {
      const n = parseInt(value.replace(/[^\d-]/g, ''), 10);
      if (Number.isFinite(n)) return Math.max(0, n);
    }
    return fallback;
  };

  const paddingTop = ensurePx(header.topPadding) ?? '12px';
  const paddingBottom = ensurePx(header.bottomPadding) ?? '12px';

  const wrapperClass = `bg-white w-full z-30 border-b border-border flex ${header.sticky ? 'sticky top-0' : ''}`;

  const logoSrc = typeof header.logo === 'string' ? header.logo : header.logo?.url ?? '';
  const buttonHref = header.link ?? (header.tel ? `tel:${header.tel}` : '#');
  const baseLogoHeight = Math.min(400, parsePxNumber(header.imageSize, 32));
  const smallLogoHeight = Math.max(0, Math.round(baseLogoHeight * 0.75));

  return (
    <header
      className={wrapperClass}
      style={{ paddingTop, paddingBottom }}
    >
      <div className="flex mx-auto place-items-center px-3 max-w-7xl w-full lg:px-10">
        <Link href="/">
          {/* Klein: 75% von imageSize */}
          <span className="block lg:hidden">
            <Image
              src={logoSrc}
              width={130}
              height={32}
              alt={`${typeof header.logo === 'object' && header.logo?.meta?.fileName ? header.logo.meta.fileName : 'Logo'} Logo`}
              priority
              className="w-auto"
              style={{ height: `${smallLogoHeight}px` }}
            />
          </span>
          {/* Groß (lg): imageSize */}
          <span className="hidden lg:block">
            <Image
              src={logoSrc}
              width={130}
              height={32}
              alt={`${typeof header.logo === 'object' && header.logo?.meta?.fileName ? header.logo.meta.fileName : 'Logo'} Logo`}
              priority
              className="w-auto"
              style={{ height: `${baseLogoHeight}px` }}
            />
          </span>
        </Link>

          <Link href={buttonHref} className="group flex place-items-center ml-auto">
            <div className="flex flex-col text-right leading-3">
              <span className="group-hover:text-atMain lg:text-bold lg:text-base text-xs font-semibold">{header.buttonText1}</span>
              <span className="group-hover:text-atMain lg:text-sm text-xs text-gray-600">{header.buttonText2}</span>
            </div>
            <Icon name={header.buttonIcon as IconName} className="lg:w-6 lg:h-6 w-5 h-5 ml-3 text-primary" />
          </Link>
      </div>
    </header>
  )
}