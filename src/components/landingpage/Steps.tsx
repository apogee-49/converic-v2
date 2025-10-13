'use client'

import React from 'react'
import BlurFade from "@/components/ui/blur-fade";
import Section from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon-picker";

interface StepsProps {
  data: {
    overtitle: string;
    titel: string;
    theme: string;
    schritte: Array<{
      title: string;
      beschreibung: string;
      icon: string;
    }>;
  };
}

export default function Steps({ data }: StepsProps) {
  const steps = data || { schritte: [] };

  const renderThemeOne = () => (
    <Section
      title={steps.overtitle}
      subtitle={steps.titel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-8 mt-4 sm:mt-10 max-w-7xl mx-auto">
        {steps.schritte.map((item, index) => {
          return (
            <BlurFade key={index} delay={0.1 + index * 0.1} inView>
              <Card className="bg-background border-none shadow-none">
                <CardContent className="px-2 py-6 md:px-6 space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={item.icon as IconName} className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg lg:text-xl">{index + 1}. {item.title}</h3>
                  <p className="text-muted-foreground">{item.beschreibung}</p>
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>
    </Section>
  );

  const renderThemeTwo = () => (
    <Section
      title={steps.overtitle}
      subtitle={steps.titel}
      className="bg-muted"
    >
      <div className="max-w-7xl lg:px-6 px-2 mt-14 mx-auto flex flex-col items-center gap-20">
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {steps.schritte.map((item, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-secondary/25 rounded-lg"/>
              <div className="bg-white rounded-lg lg:p-9 p-7 text-center relative h-full">
                <div className="text-white text-2xl xl:text-3xl -mt-14 lg:-mt-16 font-bold leading-7 bg-secondary flex items-center justify-center w-12 h-12 xl:w-14 xl:h-14 rounded-full mx-auto">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-lg lg:text-xl font-bold leading-6 text-foreground py-4">{item.title}</h4>
                <p className="text-base mx-auto font-normal leading-6 text-muted-foreground">
                  {item.beschreibung}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );

  return steps.theme === 'theme-2' ? renderThemeTwo() : renderThemeOne();
}
