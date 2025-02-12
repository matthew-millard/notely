interface H3Props extends React.ComponentPropsWithoutRef<"h3"> {
  children: string;
}

export default function H3({ children }: H3Props) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}
