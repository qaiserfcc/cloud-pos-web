import * as React from 'react'import * as React from "react"

import * as LabelPrimitive from '@radix-ui/react-label'import * as LabelPrimitive from "@radix-ui/react-label"

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from "../../lib/utils"

import { cn } from '../../lib/utils'

function Label({

const labelVariants = cva(  className,

  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',  ...props

)}: React.ComponentProps<typeof LabelPrimitive.Root>) {

  return (

function Label({    <LabelPrimitive.Root

  className,      data-slot="label"

  ...props      className={cn(

}: React.ComponentProps<typeof LabelPrimitive.Root> &        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",

  VariantProps<typeof labelVariants>) {        className

  return (      )}

    <LabelPrimitive.Root      {...props}

      data-slot="label"    />

      className={cn(labelVariants(), className)}  )

      {...props}}

    />

  )export { Label }
}

export { Label }