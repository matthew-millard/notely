import React from 'react';
import { classNames as cn } from '~/utils';

interface H1Props extends React.ComponentPropsWithoutRef<'h1'> {
  children: string;
}

export default function H1({ children, className }: H1Props) {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}>{children}</h1>
  );
}
