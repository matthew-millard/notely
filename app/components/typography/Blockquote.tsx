interface BlockquoteProps extends React.ComponentPropsWithoutRef<"blockquote"> {
  children: React.ReactNode;
}

export default function P({ children }: BlockquoteProps) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

{
  /* 
    Example
    <Blockquote>{'"This is a blockquote"'}</Blockquote> 
*/
}
