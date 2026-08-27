import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-14 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  fallback?: string
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-medium text-muted-foreground">
          {fallback || "U"}
        </span>
      )}
    </div>
  )
}

export { Avatar, avatarVariants }
export type { AvatarProps }
