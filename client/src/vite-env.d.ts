/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { SVGProps } from 'react';
  type IconProps = SVGProps<SVGSVGElement> & { size?: number };
  export const Fuel: React.FC<IconProps>;
  export const CircleDot: React.FC<IconProps>;
  export const Route: React.FC<IconProps>;
}
