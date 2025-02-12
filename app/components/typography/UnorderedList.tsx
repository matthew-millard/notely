interface UnorderedListProps extends React.ComponentPropsWithoutRef<"ul"> {
  children: React.ReactNode;
}

export default function UnorderedList({
  children,
  ...props
}: UnorderedListProps) {
  return (
    <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2">
      {children}
    </ul>
  );
}
