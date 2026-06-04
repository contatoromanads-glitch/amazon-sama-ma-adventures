import * as LucideIcons from "lucide-react";
import { Leaf } from "lucide-react"; // Fallback icon

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function DynamicIcon({ name, size = 16, className }: DynamicIconProps) {
  // @ts-ignore - LucideIcons has index signature issues in TypeScript, but this is fine dynamically
  const IconComponent = LucideIcons[name] || Leaf;

  return <IconComponent size={size} className={className} />;
}
