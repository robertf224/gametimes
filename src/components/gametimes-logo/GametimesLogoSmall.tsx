import clsx from "clsx";
import Logo from "./gametimes-logo-small.svg";

const LOGO_WIDTH = 38.462;
const LOGO_HEIGHT = 53.847;

export interface GametimesLogoSmallProps {
  className?: string;
  /** @default 30 */
  width?: number;
}

export const GametimesLogoSmall: React.FC<GametimesLogoSmallProps> = ({
  className,
  width = 30,
}) => {
  const height = (LOGO_HEIGHT / LOGO_WIDTH) * width;
  return (
    <Logo
      className={clsx("fill-foreground", className)}
      width={width}
      height={height}
    />
  );
};
