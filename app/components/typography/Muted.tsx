interface MutedProps extends React.ComponentPropsWithoutRef<"p"> {
  children: string;
}

export default function Muted({ children }: MutedProps) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}
