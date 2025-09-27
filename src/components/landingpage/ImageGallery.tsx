"use client";
import { useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/section";

interface ImageGalleryProps {
  data: {
    titel: string;
    beschreibung: string;
    elemente: Array<{
      bild: string;
      titel: string;
      location: string;
      module: string;
    }>;
  };
}

const ImageGallery = ({ data }: ImageGalleryProps) => {
  const gallery = data ?? {};
  const imagesAndText = gallery.elemente ?? [];

  const [currentImage, setCurrentImage] = useState(imagesAndText[0]?.bild ?? '');
  const [currentText, setCurrentText] = useState(imagesAndText[0]?.titel ?? '');
  const [currentLocation, setCurrentLocation] = useState(imagesAndText[0]?.location ?? '');
  const [currentModule, setCurrentModule] = useState(imagesAndText[0]?.module ?? '');

  const handleImageChange = (
    bild: string,
    titel: string,
    location: string,
    module: string,
  ) => {
    setCurrentImage(bild);
    setCurrentText(titel);
    setCurrentLocation(location);
    setCurrentModule(module);
  };

  if (!imagesAndText.length) {
    return null;
  }

  return (
    <Section
      subtitle={gallery.titel}
      description={gallery.beschreibung}
      className="bg-background"
    >
      <div className="mx-auto max-w-5xl mt-8 w-full gap-6 flex flex-col">
        <div className="flex w-full overflow-hidden rounded-lg shadow-2xl relative">
          <div className="absolute bottom-0 w-full left-0 lg:p-12 md:p-6 p-3 pt-12 flex flex-col text-start gap-3 bg-gradient-to-b from-black/0 to-black/70 text-white">
            <span className="font-bold lg:text-5xl sm:text-3xl">
              {currentText}
            </span>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
               <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="w-4 self-center h-4 text-white"
               >
                    <path
                         fillRule="evenodd"
                         d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                         clipRule="evenodd"
                    ></path>
               </svg>{" "}
               {currentLocation}
              </div>
              <div className="flex items-center gap-2">
               <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="w-4 self-center h-4 text-white"
               >
                    <path
                         fillRule="evenodd"
                         d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                         clipRule="evenodd"
                    ></path>
               </svg>
               {currentModule}
              </div>
            </div>
          </div>
          <Image
            width={1000}
            height={600}
            className="lg:h-[650px] w-[1031px] object-cover"
            alt="main"
            priority
            quality={100}
            src={currentImage}
          />
        </div>

        <div className="grid md:grid-cols-6 sm:grid-cols-4 grid-cols-3 md:gap-6 sm:gap-3 gap-2">
          {imagesAndText.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                handleImageChange(
                  item.bild,
                  item.titel,
                  item.location,
                  item.module
                )
              }
              type="button"
            >
              <figure className="cursor-pointer hover:brightness-75 transition-all w-full h-24 shadow rounded overflow-hidden bg-white">
                <Image
                  src={item.bild}
                  width={300}
                  height={140}
                  className={`transition-all w-full h-full object-cover ${
                    item.bild === currentImage ? "grayscale opacity-40" : ""
                  }`}
                  alt={`Thumbnail ${index + 1}`}
                />
              </figure>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ImageGallery;
