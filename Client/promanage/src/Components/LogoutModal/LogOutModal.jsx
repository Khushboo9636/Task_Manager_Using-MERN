import React from 'react';
import Modal from '../Modal/Modal.jsx';
import style from './Style.module.css'; // Import your CSS module

function LogOutModal({ onClose, onConfirm }) {
    return (
        <Modal onClose={onClose}>
            <div className={style.popup}>
                
                <h3 className={style.heading}>Are you sure you want to Logout?</h3>
                <div className={style.buttonGroup}>
                    <button className={style.confirm} onClick={onConfirm}>Confirm</button>
                    <button  className={style.cancel} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </Modal>
    );
}

export default LogOutModal;
