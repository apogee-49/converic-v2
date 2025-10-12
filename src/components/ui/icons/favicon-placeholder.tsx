import React from 'react';
import Image from 'next/image';

interface FaviconPlaceholderProps {
  faviconUrl?: string;
}

export function FaviconPlaceholder({ faviconUrl }: FaviconPlaceholderProps) {
  return (
    <div className="relative">
      <svg width="187" height="61" viewBox="0 0 187 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 15C0 6.71573 6.71573 0 15 0H172C180.284 0 187 6.71573 187 15V61H0V15Z" fill="#f5f5f5" />
        <path d="M126 43.9944C126 43.9944 121.5 42.8318 119.714 41.2961C117.736 39.5953 116.571 35 116.571 35L104 58L121.286 57.486L126 43.9944Z" fill="white" />
        <path d="M41 43.9944C41 43.9944 45.4996 42.8318 47.2857 41.2961C49.2637 39.5953 50.4285 35 50.4285 35L63 58L45.7143 57.486L41 43.9944Z" fill="white" />
        <rect x="50" y="8" width="67" height="40" rx="9" fill="white" />
        <path d="M99 22L106.013 29.0134" stroke="#B4B5B7" strokeWidth="2" strokeLinecap="round" />
        <path d="M99.0952 29.0134L106.109 22" stroke="#B4B5B7" strokeWidth="2" strokeLinecap="round" />
        <mask id="mask0_84_54" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="59" y="18" width="27" height="16">
          <path d="M85.7692 18H59V33.2632H85.7692V18Z" fill="white" />
        </mask>
        {!faviconUrl && (
          <g mask="url(#mask0_84_54)">
            <path d="M73.2478 18.6158C73.6016 18.2485 74.0821 18.0422 74.5825 18.0422C76.8336 18.0422 78.9551 18.0422 81.0442 18.0422C85.2462 18.0422 87.3503 23.3157 84.3791 26.3999L77.9071 33.118C77.6099 33.4264 77.1019 33.2079 77.1019 32.7718V26.8548L77.8499 26.0783C78.4441 25.4615 78.0233 24.4068 77.1829 24.4068H67.6689L73.2478 18.6158Z" fill="#155DFC" />
            <path d="M71.5222 32.6466C71.1685 33.0139 70.688 33.2202 70.1876 33.2202C67.9365 33.2202 65.815 33.2202 63.7258 33.2202C59.5238 33.2202 57.4197 27.9467 60.3909 24.8624L66.863 18.1444C67.1601 17.836 67.6681 18.0544 67.6681 18.4906V24.4076L66.9202 25.1841C66.3259 25.8009 66.7468 26.8556 67.5872 26.8556H77.1012L71.5222 32.6466Z" fill="#155DFC" />
          </g>
        )}
        <path d="M0 59C0 50.7157 6.71573 44 15 44H187V61H0V59Z" fill="white" />
        <path d="M139.167 36.8778C133.972 35.9611 130 31.4389 130 26C130 19.95 134.95 15 141 15C147.05 15 152 19.95 152 26C152 31.4389 148.028 35.9611 142.833 36.8778L142.222 36.3889H139.778L139.167 36.8778Z" fill="url(#paint0_linear_84_54)" />
        <path d="M145.278 29.0556L145.767 26H142.833V23.8611C142.833 23.0056 143.139 22.3333 144.483 22.3333H145.889V19.5222C145.094 19.4 144.239 19.2778 143.444 19.2778C140.939 19.2778 139.167 20.8056 139.167 23.5556V26H136.417V29.0556H139.167V36.8167C139.778 36.9389 140.389 37 141 37C141.611 37 142.222 36.9389 142.833 36.8167V29.0556H145.278Z" fill="white" />
        <mask id="mask1_84_54" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="17" y="15" width="19" height="21">
          <path d="M35.8175 24.1444H26.7024V27.9891H31.94C31.8558 28.5332 31.6668 29.0685 31.3899 29.5565C31.0727 30.1158 30.6806 30.5415 30.2786 30.8657C29.0745 31.8368 27.6709 32.0354 26.696 32.0354C24.2334 32.0354 22.1293 30.36 21.3147 28.0835C21.2818 28.0008 21.26 27.9155 21.2334 27.8312C21.0492 27.2405 20.9552 26.6224 20.9551 26.0003C20.9551 25.3365 21.0616 24.7011 21.2558 24.101C22.0217 21.7342 24.1733 19.9664 26.6978 19.9664C27.2056 19.9664 27.6945 20.03 28.1582 20.157C29.0055 20.3883 29.7852 20.8395 30.4269 21.47L33.1985 18.6128C31.5126 16.9857 29.3148 15.9997 26.6932 15.9997C24.5974 15.9997 22.6624 16.687 21.0768 17.8488C19.7909 18.7908 18.7363 20.0521 18.0245 21.517C17.3625 22.8752 17 24.3804 17 25.9988C17 27.6173 17.3631 29.1381 18.0251 30.4838V30.4928C18.7243 31.9215 19.7469 33.1516 20.9897 34.0893C22.0755 34.9085 24.0223 35.9996 26.6932 35.9996C28.2292 35.9996 29.5905 35.7081 30.7911 35.1618C31.6571 34.7677 32.4244 34.2537 33.1192 33.5931C34.0372 32.7202 34.7561 31.6405 35.2468 30.3984C35.7376 29.1562 36 27.7514 36 26.2285C36 25.5193 35.9323 24.799 35.8175 24.1444Z" fill="white" />
        </mask>
        <g mask="url(#mask1_84_54)">
          <g filter="url(#filter0_f_84_54)">
            <path d="M16.8604 26.0669C16.8704 27.6598 17.3016 29.3033 17.9543 30.6301V30.6392C18.4259 31.6027 19.0705 32.3638 19.8045 33.1179L24.2385 31.4149C23.3996 30.9663 23.2716 30.6915 22.6703 30.19C22.0557 29.5377 21.5977 28.7889 21.3125 27.9109H21.301L21.3125 27.9018C21.1249 27.322 21.1064 26.7065 21.0994 26.0669H16.8604Z" fill="url(#paint1_radial_84_54)" />
          </g>
          <g filter="url(#filter1_f_84_54)">
            <path d="M26.7025 15.9272C26.2644 17.5479 26.4319 19.1232 26.7025 20.0398C27.2087 20.0402 27.6962 20.1037 28.1584 20.2302C29.0057 20.4615 29.7854 20.9128 30.4271 21.5432L33.2696 18.6131C31.5857 16.9879 29.5591 15.9297 26.7025 15.9272Z" fill="url(#paint2_radial_84_54)" />
          </g>
          <g filter="url(#filter2_f_84_54)">
            <path d="M26.6932 15.9144C24.5437 15.9144 22.5591 16.6194 20.9327 17.8109C20.3308 18.2517 19.7769 18.762 19.2812 19.3325C19.152 20.6092 20.2489 22.1781 22.4212 22.1651C23.4752 20.8746 25.034 20.0396 26.7689 20.0396L26.7737 20.0398L26.7028 15.9147C26.6996 15.9147 26.6965 15.9144 26.6933 15.9144H26.6932Z" fill="url(#paint3_radial_84_54)" />
          </g>
          <g filter="url(#filter3_f_84_54)">
            <path d="M33.788 26.5289L31.8694 27.9164C31.7852 28.4604 31.596 28.9957 31.3191 29.4838C31.0019 30.043 30.6098 30.4687 30.2078 30.7929C29.0063 31.7621 27.6063 31.9616 26.6317 31.9624C25.6244 33.7684 25.4477 34.673 26.7025 36.1306C28.2553 36.1294 29.6318 35.8344 30.846 35.2819C31.7236 34.8825 32.5013 34.3616 33.2053 33.6921C34.1356 32.8075 34.8643 31.7134 35.3616 30.4545C35.8589 29.1956 36.1248 27.7722 36.1248 26.2288L33.788 26.5289Z" fill="url(#paint4_radial_84_54)" />
          </g>
          <g filter="url(#filter4_f_84_54)">
            <path d="M26.561 23.9986V28.1354H35.7923C35.8734 27.5689 36.142 26.8357 36.142 26.2288C36.142 25.5195 36.0744 24.6532 35.9596 23.9986H26.561Z" fill="#3086FF" />
          </g>
          <g filter="url(#filter5_f_84_54)">
            <path d="M19.3251 19.1866C18.7554 19.8426 18.2687 20.577 17.8829 21.3711C17.2209 22.7294 16.8584 24.3807 16.8584 25.9991C16.8584 26.0219 16.8602 26.0442 16.8604 26.067C17.1536 26.6587 20.9101 26.5453 21.0995 26.067C21.0992 26.0447 21.0968 26.0229 21.0968 26.0005C21.0968 25.3367 21.2034 24.8475 21.3975 24.2474C21.6371 23.5071 22.0122 22.8255 22.4919 22.2382C22.6006 22.0921 22.8906 21.7779 22.9752 21.5895C23.0074 21.5178 22.9167 21.4775 22.9116 21.4522C22.9059 21.424 22.7843 21.4467 22.757 21.4256C22.6705 21.3588 22.4991 21.3239 22.395 21.2929C22.1726 21.2266 21.804 21.0804 21.5992 20.9288C20.9519 20.4498 19.942 19.8775 19.3251 19.1866Z" fill="url(#paint5_radial_84_54)" />
          </g>
          <g filter="url(#filter6_f_84_54)">
            <path d="M21.6132 21.455C23.1141 22.412 23.5457 20.972 24.5435 20.5214L22.8077 16.7324C22.1745 17.0126 21.5707 17.3623 21.0062 17.7759C20.1702 18.3883 19.432 19.1357 18.8223 19.9861L21.6132 21.455Z" fill="url(#paint6_radial_84_54)" />
          </g>
          <g filter="url(#filter7_f_84_54)">
            <path d="M22.224 31.1222C20.2093 31.8878 19.8939 31.9152 19.7085 33.2295C20.064 33.5948 20.445 33.9311 20.8482 34.2356C21.9339 35.0548 24.0224 36.1458 26.6934 36.1458C26.6965 36.1458 26.6995 36.1456 26.7027 36.1456V31.8894L26.6963 31.8896C25.6961 31.8896 24.8968 31.6131 24.0774 31.1322C23.8753 31.0136 23.5087 31.332 23.3224 31.1897C23.0655 30.9933 22.4469 31.3587 22.224 31.1222Z" fill="url(#paint7_radial_84_54)" />
          </g>
          <g opacity="0.5" filter="url(#filter8_f_84_54)">
            <path d="M25.5225 31.7554V36.0719C25.8962 36.1179 26.2851 36.1459 26.6931 36.1459C27.1021 36.1459 27.4977 36.1238 27.8822 36.0831V31.7844C27.4903 31.8544 27.0935 31.8896 26.696 31.8896C26.2934 31.8896 25.9019 31.8402 25.5225 31.7554Z" fill="url(#paint8_linear_84_54)" />
          </g>
        </g>
        <defs>
          <filter id="filter0_f_84_54" x="16.3902" y="25.5967" width="8.31833" height="7.9914" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter1_f_84_54" x="25.9629" y="15.457" width="7.77683" height="6.55642" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter2_f_84_54" x="18.8008" y="15.4442" width="8.44284" height="7.19115" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter3_f_84_54" x="25.3482" y="25.7586" width="11.247" height="10.8422" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter4_f_84_54" x="26.0908" y="23.5284" width="10.5215" height="5.0772" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter5_f_84_54" x="16.3882" y="18.7164" width="7.06394" height="8.22321" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter6_f_84_54" x="15.5173" y="13.4274" width="12.3312" height="11.6543" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1.6525" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter7_f_84_54" x="19.2383" y="30.6349" width="7.93454" height="5.98113" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <filter id="filter8_f_84_54" x="25.0523" y="31.2852" width="3.30026" height="5.33088" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.2351" result="effect1_foregroundBlur_84_54" />
          </filter>
          <linearGradient id="paint0_linear_84_54" x1="1230" y1="2138.85" x2="1230" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0062E0" />
            <stop offset="1" stopColor="#19AFFF" />
          </linearGradient>
          <radialGradient id="paint1_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-0.394811 -9.95986 14.1954 -0.597678 24.1497 32.9677)" gradientUnits="userSpaceOnUse">
            <stop offset="0.142" stopColor="#1ABD4D" />
            <stop offset="0.248" stopColor="#6EC30D" />
            <stop offset="0.312" stopColor="#8AC502" />
            <stop offset="0.366" stopColor="#A2C600" />
            <stop offset="0.446" stopColor="#C8C903" />
            <stop offset="0.54" stopColor="#EBCB03" />
            <stop offset="0.616" stopColor="#F7CD07" />
            <stop offset="0.699" stopColor="#FDCD04" />
            <stop offset="0.771" stopColor="#FDCE05" />
            <stop offset="0.861" stopColor="#FFCE0A" />
          </radialGradient>
          <radialGradient id="paint2_radial_84_54" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(33.0036 21.3313) scale(6.70507 8.92424)">
            <stop offset="0.408" stopColor="#FB4E5A" />
            <stop offset="1" stopColor="#FF4540" />
          </radialGradient>
          <radialGradient id="paint3_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-9.39437 5.36239 7.06067 13.1382 29.3421 14.6226)" gradientUnits="userSpaceOnUse">
            <stop offset="0.231" stopColor="#FF4541" />
            <stop offset="0.312" stopColor="#FF4540" />
            <stop offset="0.458" stopColor="#FF4640" />
            <stop offset="0.54" stopColor="#FF473F" />
            <stop offset="0.699" stopColor="#FF5138" />
            <stop offset="0.771" stopColor="#FF5B33" />
            <stop offset="0.861" stopColor="#FF6C29" />
            <stop offset="1" stopColor="#FF8C18" />
          </radialGradient>
          <radialGradient id="paint4_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-17.037 -22.9205 -8.2093 6.48125 26.842 34.8362)" gradientUnits="userSpaceOnUse">
            <stop offset="0.132" stopColor="#0CBA65" />
            <stop offset="0.21" stopColor="#0BB86D" />
            <stop offset="0.297" stopColor="#09B479" />
            <stop offset="0.396" stopColor="#08AD93" />
            <stop offset="0.477" stopColor="#0AA6A9" />
            <stop offset="0.568" stopColor="#0D9CC6" />
            <stop offset="0.667" stopColor="#1893DD" />
            <stop offset="0.769" stopColor="#258BF1" />
            <stop offset="0.859" stopColor="#3086FF" />
          </radialGradient>
          <radialGradient id="paint5_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-1.20568 10.7101 14.3688 1.71807 25.87 17.8034)" gradientUnits="userSpaceOnUse">
            <stop offset="0.366" stopColor="#FF4E3A" />
            <stop offset="0.458" stopColor="#FF8A1B" />
            <stop offset="0.54" stopColor="#FFA312" />
            <stop offset="0.616" stopColor="#FFB60C" />
            <stop offset="0.771" stopColor="#FFCD0A" />
            <stop offset="0.861" stopColor="#FECF0A" />
            <stop offset="0.915" stopColor="#FECF08" />
            <stop offset="1" stopColor="#FDCD01" />
          </radialGradient>
          <radialGradient id="paint6_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-3.48495 3.97223 -10.8712 -10.1303 24.1748 17.6921)" gradientUnits="userSpaceOnUse">
            <stop offset="0.316" stopColor="#FF4C3C" />
            <stop offset="0.604" stopColor="#FF692C" />
            <stop offset="0.727" stopColor="#FF7825" />
            <stop offset="0.885" stopColor="#FF8D1B" />
            <stop offset="1" stopColor="#FF9F13" />
          </radialGradient>
          <radialGradient id="paint7_radial_84_54" cx="0" cy="0" r="1" gradientTransform="matrix(-9.39437 -5.36239 7.06066 -13.1382 29.342 37.3769)" gradientUnits="userSpaceOnUse">
            <stop offset="0.231" stopColor="#0FBC5F" />
            <stop offset="0.312" stopColor="#0FBC5F" />
            <stop offset="0.366" stopColor="#0FBC5E" />
            <stop offset="0.458" stopColor="#0FBC5D" />
            <stop offset="0.54" stopColor="#12BC58" />
            <stop offset="0.699" stopColor="#28BF3C" />
            <stop offset="0.771" stopColor="#38C02B" />
            <stop offset="0.861" stopColor="#52C218" />
            <stop offset="0.915" stopColor="#67C30F" />
            <stop offset="1" stopColor="#86C504" />
          </radialGradient>
          <linearGradient id="paint8_linear_84_54" x1="25.5225" y1="33.9506" x2="27.8822" y2="33.9506" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0FBC5C" />
            <stop offset="1" stopColor="#0CBA65" />
          </linearGradient>
        </defs>
      </svg>
      {faviconUrl && (
        <div
          className="absolute"
          style={{
            left: '63px',
            top: '14px',
            width: '24px',
            height: '24px',
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