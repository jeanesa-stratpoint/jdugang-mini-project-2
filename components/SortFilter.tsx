import Link from "next/link";

interface SortOption {
  value: string;
  label: string;
}

interface SortFilterProps {
  currentSort: string;
  basePath: string;
  options: SortOption[];
}

export function SortFilter({
  currentSort,
  basePath,
  options,
}: SortFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {options.map((option) => {
        const isActive = currentSort === option.value;

        return (
          <Link
            key={option.value}
            href={`${basePath}?sort=${option.value}`}
            scroll={false}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              isActive
                ? "bg-[#1F4F46] text-white border-[#1F4F46] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#85BFBB] hover:text-[#1F4F46]"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
