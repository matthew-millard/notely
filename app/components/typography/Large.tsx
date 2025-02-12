interface LargeProps extends React.ComponentPropsWithoutRef<"p"> {
  children: string;
}

export default function Large({ children }: LargeProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}
