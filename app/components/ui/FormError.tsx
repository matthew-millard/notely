import type { FormMetadata } from '@conform-to/react';

type FormErrorsProps = Pick<FormMetadata, 'errorId' | 'errors'>;

export default function FormErrors({ errorId, errors }: FormErrorsProps) {
  return (
    <div id={errorId} className="-mt-1 text-sm text-foreground-destructive">
      {errors ? (
        <ul>
          {errors.map(error => (
            <li key={error}>
              <p>{error}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>&nbsp;</p>
      )}
    </div>
  );
}
