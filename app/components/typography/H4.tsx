import React from 'react';

interface H4Props extends React.ComponentPropsWithoutRef<'h4'> {
  children: string;
}

export default function H4({ children }: H4Props) {
  return <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2">{children}</h4>;
}
