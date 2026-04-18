import "./CharacterAvatar.css";

type CharacterAvatarProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "pin";
  className?: string;
};

export default function CharacterAvatar({
  src,
  alt,
  size = "md",
  className = "",
}: CharacterAvatarProps) {
  const resolvedClassName = [
    "character-avatar",
    `character-avatar--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={resolvedClassName}>
      <img className="character-avatar__image" src={src} alt={alt} />
    </div>
  );
}
