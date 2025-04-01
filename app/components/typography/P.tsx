import React from 'react';

interface PProps extends React.ComponentPropsWithoutRef<'p'> {
  children: React.ReactNode;
}

export default function P({ children }: PProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
