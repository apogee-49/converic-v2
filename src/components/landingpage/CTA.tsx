'use client'

import React from 'react'
import { PhoneIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Typdefinition für Props
interface CTAProps {
  data: {
    overtitle: string;
    titel: string;
    buttonText: string;
    buttonUrl: string;
    bild: string | { url: string; meta?: { fileName?: string; size?: number } };
  };
}

export default function CTA({ data }: CTAProps) {
  const cta = data || {};

  return (
    <div className="relative isolate overflow-hidden bg-muted">
      <div className="px-6 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {cta.bild && (
            <Image className='rounded-full mx-auto w-28 h-28' width={200} height={200} alt="profile image" src={(cta as any).bild?.url ?? ''}></Image>
          )}
          <p className="mx-auto mt-6 max-w-xl lg:text-lg lg:leading-8 text-gray-500">
            {cta.overtitle}
          </p>
          <h2 className="font-bold mt-2 tracking-tight xl:text-4xl lg:text-3xl text-2xl">
            {cta.titel}
          </h2>
          <div className="mt-10 flex items-center gap-x-6 justify-center">
          <Link href={cta.buttonUrl}>
            <Button
              variant="default"
              isLanding={true}
            >
              <PhoneIcon className='animate w-5 h-5 me-2' />
              {cta.buttonText}
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}