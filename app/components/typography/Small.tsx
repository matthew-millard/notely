import React from 'react';
import { classNames as cn } from '~/utils';

export interface SmallProps extends React.ComponentPropsWithoutRef<'small'> {
  children: string;
}

export default function Small({ children, className }: SmallProps) {
  return <small className={cn('text-sm font-medium leading-none', className)}>{children}</small>;
}
