import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  verticalOnSmallScreen?: boolean;
  repeat?: number;
  [key: string]: any;
}

export default function Marquee({
  className,
  reverse,
  children,
  vertical = false,
  verticalOnSmallScreen = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-col sm:flex-row": verticalOnSmallScreen,
          "flex-col": vertical,
          "flex-row": !vertical && !verticalOnSmallScreen,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee-vertical flex-col sm:animate-marquee sm:flex-row": verticalOnSmallScreen,
              "animate-marquee-vertical flex-col": vertical,
              "animate-marquee flex-row": !vertical && !verticalOnSmallScreen,
              "[animation-direction:reverse]": reverse,
            })}
            style={{
              animationDuration: "var(--duration)",
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
