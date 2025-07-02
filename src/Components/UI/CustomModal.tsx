// src/Modal/CustomModal.tsx
import { Modal } from "antd";
import type { ReactNode } from "react";
import "../../Styles/components/UI/CustomModal.scss";

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
  width = 800,
}: CustomModalProps) => {
  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onClose}
      footer={null}
      width={width}
      centered
    >
      <div className="custom-modal-scrollable-content">{children}</div>
    </Modal>
  );
};

export default CustomModal;
