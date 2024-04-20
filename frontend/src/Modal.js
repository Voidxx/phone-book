import React, { useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current.showModal();
        } else {
            modalRef.current.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={modalRef} className="modal">
            {children}
            <button onClick={onClose}>Close</button>
        </dialog>
    );
};

export default Modal;