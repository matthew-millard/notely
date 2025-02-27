import { useEffect } from 'react';
import { toast as showToast } from 'sonner';
import { ToastProps } from '~/components/ui/Toast';

export default function useToast(toast?: ToastProps) {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast[toast.type](toast.title, {
          id: toast.id,
          description: toast.description,
        });
      }, 0);
    }
  }, [toast]);
}
