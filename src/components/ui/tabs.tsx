import * as React from 'react'import * as React from "react"

import * as TabsPrimitive from '@radix-ui/react-tabs'import * as TabsPrimitive from "@radix-ui/react-tabs"



import { cn } from '../../lib/utils'import { cn } from "../../lib/utils"



function Tabs({function Tabs({

  className,  className,

  ...props  ...props

}: React.ComponentProps<typeof TabsPrimitive.Root>) {}: React.ComponentProps<typeof TabsPrimitive.Root>) {

  return (  return (

    <TabsPrimitive.Root    <TabsPrimitive.Root

      data-slot="tabs"      data-slot="tabs"

      className={cn('flex flex-col gap-2', className)}      className={cn("flex flex-col gap-2", className)}

      {...props}      {...props}

    />    />

  )  )

}}



function TabsList({function TabsList({

  className,  className,

  ...props  ...props

}: React.ComponentProps<typeof TabsPrimitive.List>) {}: React.ComponentProps<typeof TabsPrimitive.List>) {

  return (  return (

    <TabsPrimitive.List    <TabsPrimitive.List

      data-slot="tabs-list"      data-slot="tabs-list"

      className={cn(      className={cn(

        'bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1',        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",

        className,        className

      )}      )}

      {...props}      {...props}

    />    />

  )  )

}}



function TabsTrigger({function TabsTrigger({

  className,  className,

  ...props  ...props

}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {

  return (  return (

    <TabsPrimitive.Trigger    <TabsPrimitive.Trigger

      data-slot="tabs-trigger"      data-slot="tabs-trigger"

      className={cn(      className={cn(

        'data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",

        className,        className

      )}      )}

      {...props}      {...props}

    />    />

  )  )

}}



function TabsContent({function TabsContent({

  className,  className,

  ...props  ...props

}: React.ComponentProps<typeof TabsPrimitive.Content>) {}: React.ComponentProps<typeof TabsPrimitive.Content>) {

  return (  return (

    <TabsPrimitive.Content    <TabsPrimitive.Content

      data-slot="tabs-content"      data-slot="tabs-content"

      className={cn(      className={cn("flex-1 outline-none", className)}

        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',      {...props}

        className,    />

      )}  )

      {...props}}

    />

  )export { Tabs, TabsList, TabsTrigger, TabsContent }
}

export { Tabs, TabsList, TabsTrigger, TabsContent }