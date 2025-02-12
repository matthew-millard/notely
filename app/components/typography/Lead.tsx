interface LeadProps extends React.ComponentPropsWithoutRef<"p"> {
  children: React.ReactNode;
}

export default function Lead({ children }: LeadProps) {
  return <p className="mt-6 text-xl text-muted-foreground">{children}</p>;
}
