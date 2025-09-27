import React from 'react';
import Image from 'next/image';

interface FaviconPlaceholderProps {
  faviconUrl?: string;
}

export function FaviconPlaceholder({ faviconUrl }: FaviconPlaceholderProps) {
  return (
    <div className="relative">
      <svg width="269" height="65" viewBox="0 0 269 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="269" height="65" rx="8" fill="#EFEFF2"/>
        <path d="M17 22C17 18.134 20.134 15 24 15H269V57C269 61.4183 265.418 65 261 65H17V22Z" fill="white"/>
        <rect x="89" y="22" width="155" height="39" rx="7" fill="#F6F7F8"/>
        <mask id="mask0_13_38" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="95" y="26" width="26" height="26">
          <path d="M121 26H95V52H121V26Z" fill="white"/>
        </mask>
        <g mask="url(#mask0_13_38)">
          {!faviconUrl && (
            <>
              <path transform="translate(-2, 2)" d="M110.581 28.4141C110.819 28.1671 111.142 28.0284 111.478 28.0284C112.992 28.0284 114.418 28.0284 115.823 28.0284C118.649 28.0284 120.063 31.5744 118.066 33.6482L113.714 38.1656C113.514 38.373 113.172 38.226 113.172 37.9327V33.9541L113.675 33.432C114.075 33.0172 113.792 32.308 113.227 32.308H106.829L110.581 28.4141Z" fill="#155DFC"/>
              <path transform="translate(-2, 2)" d="M109.42 37.8486C109.182 38.0956 108.859 38.2343 108.523 38.2343C107.009 38.2343 105.582 38.2343 104.178 38.2343C101.352 38.2343 99.9374 34.6883 101.935 32.6144L106.287 28.0971C106.487 27.8897 106.829 28.0366 106.829 28.3299V32.3086L106.326 32.8307C105.926 33.2454 106.209 33.9546 106.774 33.9546H113.171L109.42 37.8486Z" fill="#155DFC"/>
            </>
          )}
        </g>
        <path d="M127 35L179 35" stroke="#E2E1E3" strokeWidth="5.5" strokeLinecap="round"/>
        <path d="M226 32L233.013 39.0134" stroke="#B4B5B7" strokeWidth="2" strokeLinecap="round"/>
        <path d="M226.095 39.0134L233.109 32" stroke="#B4B5B7" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="34.5" cy="33.5" r="4.5" fill="#E6E6E6"/>
        <circle cx="51.5" cy="33.5" r="4.5" fill="#E6E6E6"/>
        <circle cx="68.5" cy="33.5" r="4.5" fill="#E6E6E6"/>
        <path d="M17 50H269V57C269 61.4183 265.418 65 261 65H17V50Z" fill="#F6F7F8"/>
        <path d="M83 50C83 50 85.8634 49.3537 87 48.5C88.2587 47.5545 89 45 89 45L97.0001 57.7857L86 57.5L83 50Z" fill="#F6F7F8"/>
        <path d="M250 50.0838C250 50.0838 247.137 49.4267 246 48.5587C244.741 47.5974 244 45 244 45L236 58L247 57.7095L250 50.0838Z" fill="#F6F7F8"/>
      </svg>
      {faviconUrl && (
        <div
          className="absolute"
          style={{
            left: '97px',
            top: '26px',
            width: '19px',
            height: '19px',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={faviconUrl}
            alt="Favicon"
            fill
            sizes="19px"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </div>
      )}
    </div>
  );
} 