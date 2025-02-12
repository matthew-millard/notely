interface CodeProps extends React.ComponentPropsWithoutRef<"code"> {
  children: string;
}

export default function Code({ children }: CodeProps) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}
