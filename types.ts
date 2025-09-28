
import type React from 'react';

export interface Program {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
