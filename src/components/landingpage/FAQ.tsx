'use client'

import React from 'react'
import Section from "@/components/ui/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FAQItem {
  frage: string;
  antwort: React.ReactNode;
}

// Typdefinition für Props
interface FAQProps {
  data: {
    overtitle: string;
    titel: string;
    buttonText: string;
    elemente: FAQItem[];
  };
}

export default function FAQ({ data }: FAQProps) {
  const faq = data || { elemente: [] };

  return (
    <Section title={faq.overtitle} subtitle={faq.titel}>
      <div className="mx-auto mt-6 px-2 mb-12 md:max-w-[800px]">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          {faq.elemente.map((faqItem: FAQItem, idx: number) => (
            <AccordionItem
              key={idx}
              value={faqItem.frage}
              className="w-full border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 text-left gap-2 font-semibold text-base">
                {faqItem.frage}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground text-base">{faqItem.antwort}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="mt-10 flex items-center gap-x-6 justify-center">
        <Link href="#form">
          <Button
            variant="default"
            isLanding={true}
          >
            {faq.buttonText}
            <motion.div className="lg:block hidden ml-2 -mr-1" animate={{ y: [-3, 3, -3] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ArrowUp className="w-5  h-5 stroke-atMain" />
        </motion.div>
          </Button>
        </Link>
      </div>
    </Section>
  );
}
