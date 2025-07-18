import { CategoryCard } from "@/components/layout/CategoryCard";

export function CategoryGrid() {
  const categories = [
    {
      id: 1,
      title: "Women's Fashion",
      subtitle:
        "Discover the latest trends in women's clothing",
      image: "https://res.cloudinary.com/dbizr4uou/image/upload/v1742708525/m0dvb0uuhbktg3mv4wsa.avif",
      href: "/women",
    },
    {
      id: 2,
      title: "Men's Collection",
      subtitle: "Stylish and comfortable clothing for men",
      image: "http://res.cloudinary.com/dbizr4uou/image/upload/v1742704819/imgyu5wbqwoyekmqo6yr.webp",
      href: "/men",
    },
    {
      id: 3,
      title: "Kids",
      subtitle: "Adorable and practical clothing for little ones",
      image: "http://res.cloudinary.com/dbizr4uou/image/upload/v1742707609/vmqjcg08epopktf22str.jpg",
      href: "/kids",
    },
    {
      id: 4,
      title: "Accessories",
      subtitle: "Complete your look with our premium accessories",
      image: "/placeholder.svg?height=400&width=400",
      href: "/accessories",
    },
    {
      id: 5,
      title: "Footwear",
      subtitle: "Step out in style with our curated shoe collection",
      image: "/placeholder.svg?height=400&width=400",
      href: "/shoes",
    },
    {
      id: 6,
      title: "Activewear",
      subtitle: "Performance meets style in our athletic collection",
      image: "/placeholder.svg?height=400&width=400",
      href: "/activewear",
    },
  ];

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
          {categories.map((category) => (
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
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            New collections added weekly • Free shipping on orders over $75
          </p>
        </div>
      </div>
    </section>
  );
}
