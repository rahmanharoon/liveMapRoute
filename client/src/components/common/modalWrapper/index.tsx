import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';

export interface IModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const ModalWrapper: React.FC<IModalWrapperProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnBackdropClick &&
      modalRef.current &&
      event.target === modalRef.current
    ) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={modalRef}
      className={`${styles.overlay} ${className}`}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalWrapper;
