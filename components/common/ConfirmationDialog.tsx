import React from 'react';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '../icons';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'success' | 'warning' | 'danger';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    success: {
      iconContainer: 'bg-green-100 dark:bg-green-900/50',
      icon: <CheckBadgeIcon className="h-6 w-6 text-green-600" />,
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    warning: {
      iconContainer: 'bg-yellow-100 dark:bg-yellow-900/50',
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
      button: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
    },
    danger: {
      iconContainer: 'bg-red-100 dark:bg-red-900/50',
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  };

  const selectedVariant = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${selectedVariant.iconContainer}`}>
              {selectedVariant.icon}
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="dialog-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors sm:ml-3 sm:w-auto ${selectedVariant.button} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
