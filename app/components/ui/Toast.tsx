import { cva, type VariantProps } from 'class-variance-authority';
import { toast as sonnerToast } from 'sonner';
import { classNames as cn } from '~/utils';

const toastVariants = cva('flex rounded-lg shadow-lg ring-1 ring-border w-full md:max-w-[364px] items-center p-4', {
  variants: {
    variant: {
      default: 'bg-card',
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type ToastProps = {
  id: string | number;
  type: 'default' | 'success' | 'info' | 'error';
  title: string;
  description: string;
} & VariantProps<typeof toastVariants>;

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast(props: ToastProps) {
  return sonnerToast.custom(() => <Toast {...props} />);
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast({ title, description, type = 'default' }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant: type }))}>
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-card-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="ml-5 shrink-0">
        <button
          className="rounded bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground hover:bg-primary/80"
          onClick={() => sonnerToast.dismiss()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
