interface ListItemProps extends React.ComponentPropsWithoutRef<"li"> {
  children: React.ReactNode;
}

export default function ListItem({ children, ...props }: ListItemProps) {
  return <li {...props}>{children}</li>;
}
