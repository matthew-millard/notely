interface PProps extends React.ComponentPropsWithoutRef<"p"> {
  children: string;
}

export default function P({ children }: PProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
