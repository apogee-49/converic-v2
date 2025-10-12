"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Input as AriaInput, parseColor } from "react-aria-components";
import * as ColorPicker from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pipette } from "lucide-react";

interface ColorPickerButtonProps {
  label: string;
  color: string;
  onChange: (hex: string) => void;
}

type ParsedColor = ReturnType<typeof parseColor>;

const colorSwatches: Array<string> = [
  "#335CFF",
  "#FF8447",
  "#FB3748",
  "#59ab71",
  "#F6B51E",
  "#7D52F4",
  "#47C2FF",
  "#6a7190",
];

const getSafeColor = (value: string): ParsedColor => {
  try {
    return parseColor(value);
  } catch {
    return parseColor("#335CFF");
  }
};

interface ModernColorPickerProps {
  defaultValue?: string;
  onChange?: (color: string) => void;
}

function EyeDropperButton() {
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 px-2 rounded-r-none border-r-0 focus:z-10 active:none active:scale-[1]"
      asChild
    >
      <ColorPicker.EyeDropperButton>
        <Pipette className="h-4 w-4" />
      </ColorPicker.EyeDropperButton>
    </Button>
  );
}

function ModernColorPicker({ defaultValue = "#335CFF", onChange }: ModernColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(() => getSafeColor(defaultValue));

  useEffect(() => {
    const nextColor = getSafeColor(defaultValue);
    if (currentColor.toString("hex") !== nextColor.toString("hex")) {
      setCurrentColor(nextColor);
    }
  }, [defaultValue, currentColor]);

  const handleColorChange = (nextColor: ParsedColor) => {
    setCurrentColor(nextColor);
    onChange?.(nextColor.toString("hex"));
  };

  const swatchStyle = { "--tw-ring-color": currentColor.toString("hex") };

  return (
    <ColorPicker.Root value={currentColor} onChange={handleColorChange}>
      <div className="flex w-[280px] flex-col gap-3 rounded-xl border bg-white py-4 shadow-md">
        <div className="flex flex-col gap-3 px-4">
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.Thumb className="border-white ring-white" />
          </ColorPicker.Area>

          <ColorPicker.Slider colorSpace="hsl" channel="hue">
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb className="top-1/2" />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <div className="flex items-center gap-0">
            <EyeDropperButton />
            <div className="flex-1">
              <ColorPicker.Field colorSpace="hsb">
                <AriaInput
                  className="h-8 w-full rounded-r-md border px-2 text-sm focus:z-10 focus:outline-none"
                  placeholder="#000000"
                />
              </ColorPicker.Field>
            </div>
          </div>
        </div>

        <div className="my-1 h-px bg-border" />

        <div className="flex flex-col gap-2 px-4">
          <div className="text-xs font-normal text-gray-600">Empfohlene Farben</div>
          <ColorPicker.SwatchPicker>
            {colorSwatches.map((swatchColor) => (
              <ColorPicker.SwatchPickerItem key={swatchColor} color={swatchColor}>
                <ColorPicker.Swatch
                  className="size-4.5 rounded-full"
                  style={{
                    ...(swatchStyle as CSSProperties),
                    ["--tw-ring-color" as const as keyof CSSProperties]: swatchColor,
                  }}
                />
              </ColorPicker.SwatchPickerItem>
            ))}
          </ColorPicker.SwatchPicker>
        </div>
      </div>
    </ColorPicker.Root>
  );
}


export function ColorPickerButton({ label, color, onChange }: ColorPickerButtonProps) {
  const [open, setOpen] = useState(false);
  const [currentHex, setCurrentHex] = useState(getSafeColor(color).toString("hex"));

  useEffect(() => {
    const nextHex = getSafeColor(color).toString("hex");
    if (currentHex !== nextHex) {
      setCurrentHex(nextHex);
    }
  }, [color, currentHex]);

  const handleSelectColor = (nextHex: string) => {
    setCurrentHex(nextHex);
    onChange(nextHex);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex min-w-0 w-full items-center justify-between cursor-pointer gap-2 rounded-md border p-3 active:scale-none duration-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 rounded" style={{ backgroundColor: currentHex }} />
              <span className="font-medium text-sm text-text-strong-950">{label}</span>
            </div>
            <span className="font-medium text-sm text-muted-foreground">{currentHex}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-none bg-transparent p-0 shadow-none">
          <ModernColorPicker defaultValue={currentHex} onChange={handleSelectColor} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ColorPickerButton;
