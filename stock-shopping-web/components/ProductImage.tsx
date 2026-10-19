/* eslint-disable @next/next/no-img-element */
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-900 ${className}`}
      >
        ไม่มีรูปภาพ
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
