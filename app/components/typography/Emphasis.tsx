interface EmphasisProps {
  children: string;
}

export default function Emphasis({ children }: EmphasisProps) {
  return <span className="font-bold text-primary">{children}</span>;
}
