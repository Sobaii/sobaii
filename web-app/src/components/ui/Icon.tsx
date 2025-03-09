import { FC, AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface IconProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  image: string;
  alt?: string;
  width?: number;
  height?: number;
  text?: string;
}

const Icon: FC<IconProps> = ({
  image,
  alt = "icon",
  width = 16,
  height = 16,
  text = "",
  ...props
}) => {
  return (
    <a
      {...props}
      className={twMerge(
        "flex rounded-md hover:bg-neutral-200 flex-shrink-0 items-center gap-2 p-2 cursor-pointer transition-all duration-75 ease-out",
        props.className
      )}
    >
      <img
        alt={alt}
        src={image}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      {text && <p>{text}</p>}
    </a>
  );
};

export default Icon;
