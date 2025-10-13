'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { Icon, type IconName } from '@/components/ui/icon-picker'

interface Feature {
  icon: string;
  title: string;
  beschreibung: string;
}

interface AboutProps {
  data: {
    overtitle: string;
    titel: string;
    inhalt: string;
    buttonText: string;
    bild: string | { url: string; meta?: { fileName?: string; size?: number }; visible?: "desktop" | "both" };
    reversed: boolean;
    bulletpoints: Feature[];
  };
}

export default function About({ data }: AboutProps) {
  const about = data || { bulletpoints: [] };

  const visibleSetting: "desktop" | "both" | undefined =
    about.bild && typeof about.bild === 'object' && (about as any).bild?.visible
      ? (about as any).bild?.visible
      : undefined;

  const visibilityClass = !visibleSetting
    ? ''
    : visibleSetting === 'desktop'
      ? 'hidden sm:block'
      : '';

  return (
    <div className="overflow-hidden bg-background lg:py-24 py-20 sm:py-32" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-8 sm:gap-y-16 lg:gap-x-8 lg:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className={`${about.reversed ? 'lg:mr-auto lg:pr-4' : 'lg:ml-auto lg:pl-4'} pt-4 lg:pt-12`}>
            <div className="lg:max-w-lg">
              <h3 className="text-sm text-secondary font-bold">{about.overtitle}</h3>
              <h2 className="font-bold mt-4 tracking-tight text-foreground xl:text-4xl lg:text-3xl text-2xl">{about.titel}</h2>
              <p className="mt-6 xl:text-lg text-base leading-6 xl:leading-7 text-muted-foreground">
                {about.inhalt}
              </p>
              <ul role="list" className="mt-8 space-y-8 text-muted-foreground">
                {about.bulletpoints.map((feature) => (
                  <li key={feature.title} className="flex gap-x-3 items-center">
                    <span className="h-5 w-5 my-auto flex-none text-secondary">
                      <Icon name={feature.icon as IconName} className="w-5 h-5" />
                    </span>
                    <span>
                      <strong className="font-semibold text-foreground">{feature.title}</strong> {feature.beschreibung}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex items-center gap-x-6">
                <Link href="#form">
                  <Button
                    variant="default"
                    isLanding={true}
                  >
                    {about.buttonText}
                  </Button>
                </Link>
                <motion.div className="lg:block hidden -ml-1" animate={{ y: [-4, 4, -4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowUp className="w-5 h-5 stroke-atMain" />
                </motion.div>
              </div>
            </div>
          </div>
          <div className={`${about.reversed ? 'flex items-start justify-start lg:order-last' : 'flex items-start justify-end lg:order-first'} ${visibilityClass}`}>
            <Image
              src={(about as any).bild?.url ?? ''}
              alt="Product screenshot"
              className="w-[24rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </div>
  )
}