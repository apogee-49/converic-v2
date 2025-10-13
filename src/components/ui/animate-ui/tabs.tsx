import * as React from 'react';

import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContents as TabsContentsPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
  type TabsProps as TabsPrimitiveProps,
  type TabsListProps as TabsListPrimitiveProps,
  type TabsTriggerProps as TabsTriggerPrimitiveProps,
  type TabsContentsProps as TabsContentsPrimitiveProps,
  useTabs,
} from '@/components/ui/animate-ui/primitives/animate/tabs';
import { cn } from '@/lib/utils';

type TabsProps = TabsPrimitiveProps;

function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

type TabsListProps = TabsListPrimitiveProps;

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsHighlightPrimitive className="pointer-events-none absolute left-0 right-0 bottom-0 h-0 border-b-2 border-primary">
      <TabsListPrimitive
        className={cn(
          'text-muted-foreground inline-flex h-12 w-fit items-center justify-center',
          className,
        )}
        {...props}
      />
    </TabsHighlightPrimitive>
  );
}

type TabsTriggerProps = TabsTriggerPrimitiveProps;

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsHighlightItemPrimitive value={props.value} className="flex-1">
      <TabsTriggerPrimitive
        className={cn(
          "data-[state=active]:text-foreground border-b-2 border-transparent cursor-pointer py-3 px-3.5 text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded- w-full text-sm font-medium whitespace-nowrap transition-colors duration-500 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    </TabsHighlightItemPrimitive>
  );
}

type TabsContentsProps = TabsContentsPrimitiveProps;

function TabsContents(props: TabsContentsProps) {
  return <TabsContentsPrimitive {...props} />;
}

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;
  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-state={isActive ? 'active' : 'inactive'}
      hidden={!isActive}
      className={cn('flex-1 outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentsProps,
  type TabsContentProps,
};
