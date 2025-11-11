import * as React from 'react'import * as React from "react"

import * as SeparatorPrimitive from '@radix-ui/react-separator'import * as SeparatorPrimitive from "@radix-ui/react-separator"



import { cn } from '../../lib/utils'import { cn } from "../../lib/utils"



function Separator({function Separator({

  className,  className,

  orientation = 'horizontal',  orientation = "horizontal",

  decorative = true,  decorative = true,

  ...props  ...props

}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {

  return (  return (

    <SeparatorPrimitive.Root    <SeparatorPrimitive.Root

      data-slot="separator"      data-slot="separator"

      decorative={decorative}      decorative={decorative}

      orientation={orientation}      orientation={orientation}

      className={cn(      className={cn(

        'bg-border shrink-0',        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",

        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',        className

        className,      )}

      )}      {...props}

      {...props}    />

    />  )

  )}

}

export { Separator }
export { Separator }