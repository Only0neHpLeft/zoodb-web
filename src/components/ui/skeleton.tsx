import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode
}

function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Skeleton }
