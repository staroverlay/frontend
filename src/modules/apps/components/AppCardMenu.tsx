import { Copy, Link2, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AppCardMenuProps {
  appId: string;
  onAction: (action: string, appId: string) => void;
  onClose: () => void;
}

export default function AppCardMenu({
  appId,
  onAction,
  onClose,
}: AppCardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    {
      action: 'edit',
      icon: Pencil,
      label: 'Edit',
      className: 'text-gray-300 hover:text-purple-400',
    },
    {
      action: 'copy-link',
      icon: Link2,
      label: 'Copy Link',
      className: 'text-gray-300 hover:text-purple-400',
    },
    {
      action: 'clone',
      icon: Copy,
      label: 'Clone',
      className: 'text-gray-300 hover:text-purple-400',
    },
    {
      action: 'delete',
      icon: Trash2,
      label: 'Delete',
      className: 'text-red-400 hover:text-red-300',
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 glass rounded-xl py-1 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map(({ action, icon: Icon, label, className }) => (
        <button
          key={action}
          onClick={() => onAction(action, appId)}
          className={`w-full flex items-center px-4 py-2 text-sm ${className}`}
        >
          <Icon className="h-4 w-4 mr-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
