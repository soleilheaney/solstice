import { Link } from "@tanstack/react-router";
import { Button } from "./button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaLink = "/",
}: HeroSectionProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url('${backgroundImage}')`,
      }
    : undefined;

  return (
    <section
      className="relative h-[50vh] min-h-[350px] bg-cover bg-center sm:h-[60vh]"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl px-4 text-base text-gray-200 sm:px-0 sm:text-lg">
            {subtitle}
          </p>
          {ctaText && (
            <div className="mt-6 sm:mt-8">
              <Link to={ctaLink}>
                <Button className="btn-brand-primary inline-block rounded-lg px-6 py-2.5 text-sm font-bold shadow-lg sm:px-8 sm:py-3 sm:text-base">
                  {ctaText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
