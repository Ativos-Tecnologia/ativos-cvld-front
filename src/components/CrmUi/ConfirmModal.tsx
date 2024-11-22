import Modal from "./ui/Modal/Modal";
import ModalBody from "./ui/Modal/ModalBody";
import ModalFooter from "./ui/Modal/ModalFooter";
import ModalHeader from "./ui/Modal/ModalHeader";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    size: "sm" | "md" | "lg";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, isLoading, size }) => {
    return (
        <Modal isOpen={isOpen} size={size}>
            <ModalHeader onClose={onClose} />
            <ModalBody>Tem certeza? Essa ação não pode ser desfeita.</ModalBody>
            <ModalFooter onConfirm={onConfirm} onCancel={onClose} isLoading={isLoading} />
        </Modal>
    );
};

export default ConfirmModal;