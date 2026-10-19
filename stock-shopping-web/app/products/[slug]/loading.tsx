export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-8 pt-10 lg:grid-cols-2 lg:gap-12">
      <div className="aspect-square animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="space-y-6">
        <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-20 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-12 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
