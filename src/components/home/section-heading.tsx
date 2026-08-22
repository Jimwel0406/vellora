import { Heart } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold uppercase font-label tracking-[0.3em] text-terracotta">
        {eyebrow}
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="h-px w-8 sm:w-16 bg-clay/20" />
        <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-clay tracking-tight leading-none flex items-center gap-2.5">
          {title}
          <Heart className="w-5 h-5 text-terracotta fill-terracotta" />
        </h2>
        <span className="h-px w-8 sm:w-16 bg-clay/20" />
      </div>
    </div>
  );
}