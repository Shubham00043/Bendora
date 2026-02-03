import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export const UserAvatar = ({
  name,
  imageUrl,
  size = "md",
  className,
}: {
  name: string;
  imageUrl: string | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const initials = name?.[0]?.toUpperCase() || "U";
  return (
    <Avatar
      className={cn(
        "size-10",
        size === "sm" ? "size-8" : size === "md" ? "size-10" : "size-14",
        className
      )}
    >
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
