interface BlogNameCardProps {
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export default function BlogNameCard({
  as: Tag = "h1",
  className = "",
}: BlogNameCardProps) {
  return (
    <Tag className={`font-italianno text-[#1F4F46] text-5xl ${className}`}>
      I Am Grateful For...
    </Tag>
  );
}
