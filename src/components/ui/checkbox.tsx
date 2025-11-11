import * as React from 'react'import * as React from "react"

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { Check } from 'lucide-react'import { CheckIcon } from "lucide-react"



import { cn } from '../../lib/utils'import { cn } from "../../lib/utils"



function Checkbox({function Checkbox({

  className,  className,

  ...props  ...props

}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {

  return (  return (

    <CheckboxPrimitive.Root    <CheckboxPrimitive.Root

      data-slot="checkbox"      data-slot="checkbox"

      className={cn(      className={cn(

        'peer border-primary focus-visible:border-ring focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow-xs transition-shadow focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",

        className,        className

      )}      )}

      {...props}      {...props}

    >    >

      <CheckboxPrimitive.Indicator      <CheckboxPrimitive.Indicator

        data-slot="checkbox-indicator"        data-slot="checkbox-indicator"

        className="flex items-center justify-center text-current"        className={cn("flex items-center justify-center text-current")}

      >      >

        <Check className="h-3 w-3" />        <CheckIcon className="h-4 w-4" />

      </CheckboxPrimitive.Indicator>      </CheckboxPrimitive.Indicator>

    </CheckboxPrimitive.Root>    </CheckboxPrimitive.Root>

  )  )

}}



export { Checkbox }export { Checkbox }