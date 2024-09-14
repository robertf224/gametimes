import Logo from "./gametimes-logo.svg";

const LOGO_WIDTH = 928;
const LOGO_HEIGHT = 130;

export interface GametimesLogoProps {
  /** @default 200 */
  width?: number;
}

export const GametimesLogo: React.FC<GametimesLogoProps> = ({
  width = 200,
}) => {
  const height = (LOGO_HEIGHT / LOGO_WIDTH) * width;
  return <Logo className="fill-foreground" width={width} height={height} />;
};
