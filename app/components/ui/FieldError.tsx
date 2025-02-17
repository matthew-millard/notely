import type { FieldMetadata } from '@conform-to/react';

interface FieldErrorProps {
  field: FieldMetadata;
}

export default function FieldError({ field }: FieldErrorProps) {
  return (
    <div id={field?.errorId} className="text-foreground-destructive -mt-1 text-xs font-medium">
      {field.errors ? (
        field.errors.map(error => <p key={error}>{error}</p>)
      ) : (
        <p>&nbsp;</p> // Empty space to maintain layout
      )}
    </div>
  );
}
