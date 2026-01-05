import type { SVGProps } from 'react';

export function SweepsCoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M16 8.5c-2.5 0-4 1.5-4 3.5s1.5 3.5 4 3.5" />
      <path d="M8 15.5c2.5 0 4-1.5 4-3.5S9.5 8.5 7 8.5" />
    </svg>
  );
}
