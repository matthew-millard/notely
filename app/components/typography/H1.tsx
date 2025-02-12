interface H1Props extends React.ComponentPropsWithoutRef<"h1"> {
  children: string;
}

export default function H1({ children }: H1Props) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}
