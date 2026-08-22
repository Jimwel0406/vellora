import { ShoppingBag, BadgePercent, Truck, HeartHandshake } from "lucide-react";

const BENEFITS = [
  {
    icon: ShoppingBag,
    title: "Quality Products",
    description: "Handpicked with care",
  },
  {
    icon: BadgePercent,
    title: "Affordable Prices",
    description: "Best value for your money",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick & reliable shipping",
  },
  {
    icon: HeartHandshake,
    title: "Happy Customers",
    description: "Our top priority always",
  },
];

export function BenefitsBar() {
  return (
    <section data-section="benefits-bar" className="section-benefits-bar w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 lg:pb-16">
      <div className="rounded-2xl bg-clay text-sand">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-clay divide-x-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center justify-center text-center px-4 py-8 lg:py-10 gap-2.5 group hover:bg-white/5 transition-colors"
            >
              <Icon
                className="w-6 h-6 text-ochre group-hover:text-white transition-colors"
                strokeWidth={1.5}
              />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {title}
              </h3>
              <p className="text-xs text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}