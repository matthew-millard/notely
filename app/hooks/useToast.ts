import { useEffect } from 'react';
import { type ToastProps, toast as customToast } from '~/components/ui/Toast';

export default function useToast(toast?: ToastProps) {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        customToast(toast);
      }, 0);
    }
  });
}
