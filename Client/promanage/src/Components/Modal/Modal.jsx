import React from 'react';
import style from './Style.module.css';

function Modal({ onClose, children }) {
    return (
        <div className={style.modalOverlay}>
            <div className={style.modal}>
                <div className={style.modalContent}>
                    {children}
                    {/* <button onClick={onClose} className={style.closeButton}>
                        Close
                    </button> */}
                </div>
            </div>
        </div>
    );
}

export default Modal;
