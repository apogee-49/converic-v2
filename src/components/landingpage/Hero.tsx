'use client'

import React from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDown } from 'lucide-react'

const fadeUpVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};


interface HeroProps {
  data: {
    overtitle: string;
    titel: string;
    inhalt: Array<{
      stichpunkt: string;
    }>;
    buttonText: string;
    bild: string;
    theme?: string;
    pfeil?: boolean;
  };
}

export default function Hero({ data }: HeroProps) {
  const hero = data || {};

  // Fallback image
  const imageUrl = hero.bild?.startsWith('http')
    ? hero.bild
    : '/Hero-Image.png';




  const renderThemeOne = () => (
    <div className="relative bg-background bg-gradient-to-b">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-2">
        <div className="px-6 pb-20 pt-16 sm:pb-32 lg:col-span-7 lg:pl-8 lg:pr-20 lg:pb-20 lg:pt-20 xl:pt-32 xl:pb-32 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <motion.h2
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5 }}
              className="text-sm text-secondary font-bold"
            >
              {hero.overtitle}
            </motion.h2>
            <motion.h1
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold tracking-tight text-foreground mt-6 xl:text-5xl lg:text-4xl text-3xl"
            >
              {hero.titel}
            </motion.h1>
            <motion.ul
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 space-y-3"
            >
              {hero.inhalt?.map((item, index) => (
                <li key={index} className="flex items-center text-muted-foreground gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6a7190" className="size-6">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base lg:text-base">{item.stichpunkt}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div
              variants={fadeUpVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center gap-x-6"
            >
              <Link href="#form">
                <Button
                  variant="default"
                  isLanding={true}
                >
                  {hero.buttonText}
                </Button>
              </Link>
              {hero.pfeil && (
                <motion.div className="lg:block hidden text-primary -ml-1" animate={{ y: [-4, 4, -4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowDown className="w-5 h-5 stroke-atMain" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <Image
            className="aspect-[1/1] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src={imageUrl}
            alt="Hero image"
            width={1920}
            height={1080}
            fetchPriority='high'
            priority
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qQEBALkE2Qjc4QD1AOTpBRUJGSUNDWmdaW0H/2wBDABUXFx4aHh0hIR1BLjIuQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
      </div>
    </div>
  );




  const renderThemeTwo = () => (
    <section className="hero-gradient xl:py-32 py-20 bg-[#1e2032] z-[1]">
      <div className="lg:max-w-7xl max-w-2xl lg:px-10 px-6 mx-auto">
        <motion.div
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          className="flex lg:flex-nowrap flex-wrap xl:gap-28 gap-20"
        >
          <div className="xl:w-6/12 lg:w-1/2 w-full my-auto lg:order-1 order-2">
            <div className="text-center md:mx-0 relative aspect-[7/5] h-full my-auto">
              <Image
                src={imageUrl}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Hero image"
                className="rounded-xl object-cover shadow-3xl z-10 relative"
                priority
                quality={100}
              />
              <div className="absolute -top-3.5 -left-3.5 lg:-top-5 lg:-left-5 w-full h-full bg-secondary/55 rounded-xl z-[1]"/>
            </div>
          </div>
          <div className="xl:w-7/12 lg:w-1/2 w-full lg:order-2 order-1">
            <div className="max-w-1/2 ml-auto">
              <motion.span
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5 }}
                className="text-sm text-muted font-semibold leading-5 inline-block rounded-md"
              >
                {hero.overtitle}
              </motion.span>
              <motion.h1
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white mt-6 mb-[18px] xl:text-5xl lg:text-4xl text-3xl font-bold tracking-tight"
                dangerouslySetInnerHTML={{ __html: hero.titel }}
              />
              <motion.ul
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-md"
              >
                {hero.inhalt?.map((item, index) => (
                  <li key={index} className="flex mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 mr-3 flex-shrink-0 fill-white">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" />
                    </svg>
                    <span className="text-white">{item.stichpunkt}</span>
                  </li>
                ))}
              </motion.ul>
              <motion.div
                variants={fadeUpVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex items-center gap-x-4"
              >
                <Link href="#form">
                  <Button
                    variant="default"
                    isLanding={true}
                  >
                    {hero.buttonText}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {hero.pfeil && (
          <motion.div 
            className="flex justify-center xl:-mb-40 xl:mt-24 -mb-28 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="#form" className="relative bg-[#383B51] overflow-hidden w-16 h-16 rounded-full border-2 ring-[#1e2032] ring-[8px] border-none flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [-44, 44],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowDown className="w-7 h-7 text-white" />
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );

  return hero.theme === 'theme-2' ? renderThemeTwo() : renderThemeOne();
}