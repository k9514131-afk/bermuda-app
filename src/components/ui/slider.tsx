"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value || props.defaultValue || [0]
  const valuesArray = Array.isArray(values) ? values : [values]

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-4",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary shadow-[0_0_15px_rgba(110,198,217,0.5)] transition-none" />
      </SliderPrimitive.Track>
      {valuesArray.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block h-4 w-4 rounded-full border-2 border-primary bg-background shadow-md cursor-grab active:cursor-grabbing",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
            "disabled:pointer-events-none disabled:opacity-50 transition-transform active:scale-125 duration-150"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
