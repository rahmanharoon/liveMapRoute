import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalWrapper from '@components/common/modalWrapper';

describe('ModalWrapper Component', () => {
  it('should not render when isOpen is false', () => {
    render(
      <ModalWrapper isOpen={false} onClose={jest.fn()}>
        <div>Modal Content</div>
      </ModalWrapper>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <ModalWrapper isOpen={true} onClose={jest.fn()}>
        <div>Modal Content</div>
      </ModalWrapper>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const handleClose = jest.fn();
    render(
      <ModalWrapper isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </ModalWrapper>
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <ModalWrapper isOpen={true} onClose={handleClose} closeOnBackdropClick={true}>
        <div>Modal Content</div>
      </ModalWrapper>
    );

    const overlay = screen.getByText('Modal Content').parentElement?.parentElement;
    if (overlay) {
      await userEvent.click(overlay);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});
