import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
