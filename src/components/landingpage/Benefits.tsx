"use client"

import React, { useRef } from "react";
import parse from "html-react-parser";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react"; 
import { Icon, type IconName } from "@/components/ui/icon-picker";

interface BenefitItem { 
  icon: string;
  caption: string;
  beschreibung: string;
}

interface BenefitsProps {
  data: {
    titel: string;
    inhalt: string;
    buttonText: string;
    elemente: BenefitItem[];
  };
}

export default function Benefits({ data }: BenefitsProps) {
  const ref = useRef(null);
  const benefits = data || { elemente: [] };
  
  return (
    <section
      className="lg:py-24 py-16 px-6 lg:px-0 w-full text-center bg-muted z-0"
    >
      <h2 className="xl:text-4xl lg:text-3xl text-2xl font-bold mb-6">{benefits.titel}</h2>
      <p className="max-w-4xl mx-auto px-6 lg:mb-14 mb-10 text-muted-foreground">
        {benefits.inhalt}
      </p>

      <div className="grid md:grid-cols-2 max-w-7xl lg:px-10 mx-auto gap-[15px] lg:gap-[22px] ">
        {benefits.elemente.map((item: BenefitItem) => {
          return (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              key={item.caption}
              className="bg-white rounded-lg lg:p-9 p-7 text-start flex flex-col "
            >
              <div className="flex mb-4">
                <div className="my-auto">
                  <Icon name={item.icon as IconName} className="w-6 h-6 text-secondary" />
                </div>
                <span className="self-center font-semibold text-lg lg:text-xl ml-3">
                  {item.caption}
                </span>
              </div>
              <div className="text-muted-foreground text-base">{parse(item.beschreibung)}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-x-6 justify-center">
        <Link href="#form">
          <Button
            variant="default"
            isLanding={true}
            >
              {benefits.buttonText}
            <motion.div className="lg:block hidden ml-2 -mr-1" animate={{ y: [-3, 3, -3] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ArrowUp className="w-5  h-5 stroke-atMain" />
        </motion.div>
          </Button>
        </Link>
      </div>
    </section>
  );
}