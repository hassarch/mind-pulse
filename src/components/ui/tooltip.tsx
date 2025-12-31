import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';

export const TooltipProvider = RadixTooltip.Provider;

export const Tooltip = RadixTooltip.Root;

export const TooltipTrigger = RadixTooltip.Trigger;

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = 'top', align = 'center', ...props }, ref) => (
    <RadixTooltip.Content
      ref={ref}
      side={side}
      align={align}
      className={clsx(
        'z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md',
        'data-[state=delayed-open]:data-[side=top]:animate-in data-[state=delayed-open]:data-[side=top]:fade-in-0 data-[state=delayed-open]:data-[side=top]:zoom-in-95',
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = 'TooltipContent';
