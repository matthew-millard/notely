export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
}
