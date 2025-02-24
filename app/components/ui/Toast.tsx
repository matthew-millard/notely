import { Check, CircleAlert, CircleX, Info } from 'lucide-react';
import { useEffect } from 'react';
import { toast as showToast } from 'sonner';

export type ToastProps = {
  id: string | number;
  type: 'success' | 'info' | 'error';
  title: string;
  description: string;
};

export default function RenderToast({ toast }: { toast: ToastProps }) {
  const { type, title, description, id } = toast;

  useEffect(() => {
    setTimeout(() => {
      showToast.custom(() => <Toast id={id} type={type} title={title} description={description} />);
    }, 0);
  }, [type, title, description, id]);
  return null;
}

function Toast({ id, type, title, description }: ToastProps) {
  const icons = {
    success: <Check className="text-green-500" />,
    info: <Info className="text-blue-500" />,
    error: <CircleAlert className="text-red-500" />,
  };
  const icon = icons[type];

  return (
    <div key={id} className="bg-card flex items-start p-4 border rounded-lg shadow-lg w-full">
      <div className="flex-shrink-0 h-6 w-6">{icon}</div>
      <div className="ml-3 flex-1 pt-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
      </div>
      <button onClick={() => showToast.dismiss(id)} className="ml-3">
        <CircleX className="w-5 h-5 text-card-foreground hover:text-card-foreground/80" />
      </button>
    </div>
  );
}
