export interface SmallProps extends React.ComponentPropsWithoutRef<"small"> {
  children: string;
}

export default function Small({ children }: SmallProps) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}
