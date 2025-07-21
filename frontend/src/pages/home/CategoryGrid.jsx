import { CategoryCard } from "@/components/layout/CategoryCard";
import { categories } from "@/constants/dummyData";

export function CategoryGrid() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Shop by Category
          </h2>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600 md:text-xl">
            Explore our carefully curated collections designed to match your
            unique style and lifestyle
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(320px,auto)]">
          {categories?.map((category) => (
            <div key={category.id}>
              <CategoryCard
                title={category.title}
                subtitle={category.subtitle}
                image={category.image}
                href={category.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
