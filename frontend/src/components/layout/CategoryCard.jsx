import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function CategoryCard({ title, subtitle, image, href }) {
  return (
    <Link to={href}>
      <Card className="relative overflow-hidden bg-gray-100 border-0 cursor-pointer group rounded-xl h-80">
        {/* Full Cover Image */}
        <div className="absolute inset-0">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 transition-all duration-300 bg-black/20 group-hover:bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
            <h3 className="mb-2 text-2xl font-bold drop-shadow-lg">{title}</h3>
            <p className="text-sm transition-opacity duration-300 opacity-90 group-hover:opacity-100 drop-shadow">
              {subtitle}
            </p>
          </div>

          {/* Hover Arrow Indicator */}
          <div className="absolute transition-all duration-300 transform translate-x-2 opacity-0 top-4 right-4 group-hover:opacity-100 group-hover:translate-x-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </Card>
    </Link>
  );
}
