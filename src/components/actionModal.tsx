import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ModalProps } from "antd/es/modal";

interface IProps extends ModalProps{
  children: React.ReactNode;
  actionButton: React.ReactNode;
  handleOk?: () => Promise<void> | void;
  handleCancel?: () => void;
  ModalProps?: ModalProps;
}
const ActionModal = forwardRef((props: IProps, ref) => {
  const [visible, setVisible] = useState(false);
  const { handleOk, handleCancel, ...rest } = props || {};
  const onCancel = () => {
    handleCancel && handleCancel();
    setVisible(false);
  };

  const onOk = async () => {
    handleOk && (await handleOk());
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    },
  }));

  return (
    <>
      <Modal open={visible} onOk={onOk} onCancel={onCancel} {...rest}>
        {props.children}
      </Modal>
      <span onClick={() => setVisible(v => !v)}>
        {props.actionButton}
      </span>

    </>
  );
});

export default ActionModal;
