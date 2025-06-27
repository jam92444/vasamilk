// src/Modal/CustomModal.tsx
import { Modal } from "antd";
import type { ReactNode } from "react";

interface CustomModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

const CustomModal = ({
  visible,
  title,
  onClose,
  children,
  width = 500,
}: CustomModalProps) => {
  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onClose}
      footer={null}
      width={width}
      destroyOnClose
      centered
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
