type Props = {
  small: string;
  medium: string;
  large: string;
  alt: string;
};
export function ResponsiveImage({ small, medium, large, alt }: Props) {
  return (
    <img
      src={small}
      srcSet={`${small} 300w, ${medium} 768w, ${large} 1280w`}
      alt={alt}
    />
  );
}
