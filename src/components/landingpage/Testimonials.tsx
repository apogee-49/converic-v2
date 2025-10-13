"use client";

import React from 'react'
import { cn } from "@/lib/utils";
import Section from "@/components/ui/section";
import Marquee from "@/components/ui/marquee";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { motion } from 'framer-motion';

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-primary/15 p-1 py-0.5 font-bold text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  description: React.ReactNode;
  className?: string;
  stars?: number;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  role,
  className,
  showStars = true,
  ...props
}: TestimonialCardProps & { showStars?: boolean }) => (
  <div
    className={cn(
      "flex w-72 shrink-0 cursor-pointer snap-center snap-always flex-col justify-between rounded-xl p-4",
      "border border-border bg-background",
      "sm:w-96 sm:mx-0",
      "w-full mx-auto",
      className,
    )}
    {...props}
  >
    <div className="select-none text-base text-muted-foreground">
      {description}
    </div>

    <div className="select-none mt-2 sm:mt-3">
      {showStars && (
        <div className="flex flex-row py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            i < ((props as any).stars ?? 5) ? (
              <StarFilledIcon key={i} className="size-4 text-yellow-500" />
            ) : (
              <StarIcon key={i} className="size-4 text-muted-foreground/40" />
            )
          ))}
        </div>
      )}
      <p className="font-medium text-base text-muted-foreground">{name}</p>
      {role && <p className="text-sm text-muted-foreground/70">{role}</p>}
    </div>
  </div>
);

// Definiere einen Typ für Testimonial
interface Testimonial {
  name: string;
  rolle?: string;
  anfang: string;
  highlight?: string;
  ende?: string;
  stars?: number;
  showStars?: boolean;
}

// Props für die Testimonials-Komponente
interface TestimonialsProps {
  data: {
    titel: string;
    overtitle: string;
    sterneAnzeigen: boolean;
    theme?: string;
    bewertungen: Testimonial[];
  };
}

export function Testimonials({ data }: TestimonialsProps) {
  const testimonials = data || { bewertungen: [] };

  const renderThemeOne = () => (
    <Section
      title={testimonials.overtitle}
      subtitle={testimonials.titel}
      className="bg-muted"
    >
      <div>
        <div >
          <div className='grid lg:mt-10 mt-6 md:grid-cols-3 px-2 max-w-7xl lg:px-6 mx-auto gap-[15px] lg:gap-[22px]'>
            {testimonials.bewertungen.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg lg:p-8 p-7 text-start flex flex-col gap-2.5"
              >
                {(testimonials.sterneAnzeigen || testimonial.showStars) && (
                  <ul className='flex gap-0.5'>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <li key={starIndex}>
                        {starIndex < (testimonial.stars ?? 5) ? (
                          <StarFilledIcon className="size-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="size-5 text-muted-foreground/40" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p className='text-base mb-4 max-w-[335px] font-normal text-muted-foreground'>
                  {testimonial.anfang}{" "}
                  {testimonial.highlight && (
                    <>
                      <Highlight>
                        {testimonial.highlight}
                      </Highlight>{" "}
                    </>
                  )}
                  {testimonial.ende}
                </p>
                <div className='flex flex-col gap-0.5 mt-auto'>
                  <h6 className='text-base font-semibold leading-6 text-foreground'>
                    {testimonial.name}
                  </h6>
                  <p className='text-sm max-w-[335px] font-normal text-muted-foreground'>{testimonial.rolle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );

  const renderThemeTwo = () => (
    <Section
      title={testimonials.overtitle}
      subtitle={testimonials.titel}
    >
      <div data-nosnippet>
        <div className="mx-auto md:container md:px-8">
          <div className="relative mx-auto max-w-[100vw] overflow-hidden">
            <div className="relative">
              <Marquee
                className="mt-6 [--duration:100s] max-h-[40rem] sm:max-h-none"
                verticalOnSmallScreen={true}
              >
                {testimonials.bewertungen.map((testimonial: Testimonial, idx: number) => (
                  <TestimonialCard
                    key={idx}
                    name={testimonial.name}
                    role={testimonial.rolle ?? ""}
                    showStars={testimonials.sterneAnzeigen}
                    stars={testimonial.stars ?? 5}
                    description={
                      <p>
                        {testimonial.anfang}{" "}
                        {testimonial.highlight && (
                          <>
                            <Highlight>
                              {testimonial.highlight}
                            </Highlight>{" "}
                          </>
                        )}
                        {testimonial.ende}
                      </p>
                    }
                  />
                ))}
              </Marquee>
              <div className="pointer-events-none hidden sm:block absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent"></div>
              <div className="pointer-events-none hidden sm:block absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent"></div>
              <div className="pointer-events-none block sm:hidden absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-background to-transparent"></div>
              <div className="pointer-events-none block sm:hidden absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return testimonials.theme === 'theme-2' ? renderThemeTwo() : renderThemeOne();
}
