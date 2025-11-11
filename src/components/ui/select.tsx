import * as React from 'react'import * as React from "react"

import * as SelectPrimitive from '@radix-ui/react-select'import * as SelectPrimitive from "@radix-ui/react-select"

import { Check, ChevronDown, ChevronUp } from 'lucide-react'import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"



import { cn } from '../../lib/utils'import { cn } from "../../lib/utils"



function Select({function Select({

  ...props  ...props

}: React.ComponentProps<typeof SelectPrimitive.Root>) {}: React.ComponentProps<typeof SelectPrimitive.Root>) {

  return <SelectPrimitive.Root data-slot="select" {...props} />  return <SelectPrimitive.Root data-slot="select" {...props} />

}}



function SelectGroup({function SelectGroup({

  ...props  ...props

}: React.ComponentProps<typeof SelectPrimitive.Group>) {}: React.ComponentProps<typeof SelectPrimitive.Group>) {

  return <SelectPrimitive.Group data-slot="select-group" {...props} />  return <SelectPrimitive.Group data-slot="select-group" {...props} />

}}



function SelectValue({function SelectValue({

  ...props  ...props

}: React.ComponentProps<typeof SelectPrimitive.Value>) {}: React.ComponentProps<typeof SelectPrimitive.Value>) {

  return <SelectPrimitive.Value data-slot="select-value" {...props} />  return <SelectPrimitive.Value data-slot="select-value" {...props} />

}}



function SelectTrigger({function SelectTrigger({

  className,  className,

  children,  size = "default",

  ...props  children,

}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {  ...props

  return (}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {

    <SelectPrimitive.Trigger  size?: "sm" | "default"

      data-slot="select-trigger"}) {

      className={cn(  return (

        'border-input bg-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',    <SelectPrimitive.Trigger

        className,      data-slot="select-trigger"

      )}      className={cn(

      {...props}        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",

    >        size === "sm" && "h-8 px-2 py-1 text-xs",

      {children}        className

      <SelectPrimitive.Icon asChild>      )}

        <ChevronDown className="h-4 w-4 opacity-50" />      {...props}

      </SelectPrimitive.Icon>    >

    </SelectPrimitive.Trigger>      {children}

  )      <SelectPrimitive.Icon asChild>

}        <ChevronDownIcon className="h-4 w-4 opacity-50" />

      </SelectPrimitive.Icon>

function SelectScrollUpButton({    </SelectPrimitive.Trigger>

  className,  )

  ...props}

}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {

  return (function SelectScrollUpButton({

    <SelectPrimitive.ScrollUpButton  className,

      data-slot="select-scroll-up-button"  ...props

      className={cn(}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {

        'flex cursor-default items-center justify-center py-1',  return (

        className,    <SelectPrimitive.ScrollUpButton

      )}      data-slot="select-scroll-up-button"

      {...props}      className={cn(

    >        "flex cursor-default items-center justify-center py-1",

      <ChevronUp className="h-4 w-4" />        className

    </SelectPrimitive.ScrollUpButton>      )}

  )      {...props}

}    >

      <ChevronUpIcon className="size-4" />

function SelectScrollDownButton({    </SelectPrimitive.ScrollUpButton>

  className,  )

  ...props}

}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {

  return (function SelectScrollDownButton({

    <SelectPrimitive.ScrollDownButton  className,

      data-slot="select-scroll-down-button"  ...props

      className={cn(}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {

        'flex cursor-default items-center justify-center py-1',  return (

        className,    <SelectPrimitive.ScrollDownButton

      )}      data-slot="select-scroll-down-button"

      {...props}      className={cn(

    >        "flex cursor-default items-center justify-center py-1",

      <ChevronDown className="h-4 w-4" />        className

    </SelectPrimitive.ScrollDownButton>      )}

  )      {...props}

}    >

      <ChevronDownIcon className="size-4" />

function SelectContent({    </SelectPrimitive.ScrollDownButton>

  className,  )

  children,}

  position = 'popper',

  ...propsfunction SelectContent({

}: React.ComponentProps<typeof SelectPrimitive.Content>) {  className,

  return (  children,

    <SelectPrimitive.Portal>  position = "popper",

      <SelectPrimitive.Content  align = "center",

        data-slot="select-content"  ...props

        className={cn(}: React.ComponentProps<typeof SelectPrimitive.Content>) {

          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md',  return (

          position === 'popper' &&    <SelectPrimitive.Portal>

            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',      <SelectPrimitive.Content

          className,        data-slot="select-content"

        )}        className={cn(

        position={position}          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",

        {...props}          position === "popper" &&

      >            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",

        <SelectScrollUpButton />          className

        <SelectPrimitive.Viewport        )}

          data-slot="select-viewport"        position={position}

          className={cn(        align={align}

            'p-1',        {...props}

            position === 'popper' &&      >

              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',        <SelectScrollUpButton />

          )}        <SelectPrimitive.Viewport

        >          data-slot="select-viewport"

          {children}          className={cn(

        </SelectPrimitive.Viewport>            "p-1",

        <SelectScrollDownButton />            position === "popper" &&

      </SelectPrimitive.Content>              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"

    </SelectPrimitive.Portal>          )}

  )        >

}          {children}

        </SelectPrimitive.Viewport>

function SelectLabel({        <SelectScrollDownButton />

  className,      </SelectPrimitive.Content>

  ...props    </SelectPrimitive.Portal>

}: React.ComponentProps<typeof SelectPrimitive.Label>) {  )

  return (}

    <SelectPrimitive.Label

      data-slot="select-label"function SelectLabel({

      className={cn('px-2 py-1.5 text-sm font-semibold', className)}  className,

      {...props}  ...props

    />}: React.ComponentProps<typeof SelectPrimitive.Label>) {

  )  return (

}    <SelectPrimitive.Label

      data-slot="select-label"

function SelectItem({      className={cn("px-2 py-1.5 text-sm font-semibold", className)}

  className,      {...props}

  children,    />

  ...props  )

}: React.ComponentProps<typeof SelectPrimitive.Item>) {}

  return (

    <SelectPrimitive.Itemfunction SelectItem({

      data-slot="select-item"  className,

      className={cn(  children,

        'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',  ...props

        className,}: React.ComponentProps<typeof SelectPrimitive.Item>) {

      )}  return (

      {...props}    <SelectPrimitive.Item

    >      data-slot="select-item"

      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">      className={cn(

        <SelectPrimitive.ItemIndicator>        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",

          <Check className="h-4 w-4" />        className

        </SelectPrimitive.ItemIndicator>      )}

      </span>      {...props}

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>    >

    </SelectPrimitive.Item>      <span className="absolute right-2 flex size-3.5 items-center justify-center">

  )        <SelectPrimitive.ItemIndicator>

}          <CheckIcon className="size-4" />

        </SelectPrimitive.ItemIndicator>

function SelectSeparator({      </span>

  className,      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

  ...props    </SelectPrimitive.Item>

}: React.ComponentProps<typeof SelectPrimitive.Separator>) {  )

  return (}

    <SelectPrimitive.Separator

      data-slot="select-separator"function SelectSeparator({

      className={cn('bg-muted -mx-1 my-1 h-px', className)}  className,

      {...props}  ...props

    />}: React.ComponentProps<typeof SelectPrimitive.Separator>) {

  )  return (

}    <SelectPrimitive.Separator

      data-slot="select-separator"

export {      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}

  Select,      {...props}

  SelectGroup,    />

  SelectValue,  )

  SelectTrigger,}

  SelectContent,

  SelectLabel,export {

  SelectItem,  Select,

  SelectSeparator,  SelectContent,

  SelectScrollUpButton,  SelectGroup,

  SelectScrollDownButton,  SelectItem,

}  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}