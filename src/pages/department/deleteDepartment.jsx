import React from 'react';
import { Button, Modal } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const DeleteDepartment = ({ openModal, onCloseModal }) => {
	return (
		<Modal
			show={openModal}
			onHide={() => onCloseModal(false)}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			keyboard={false}
			centered>
			<Modal.Header closeButton>
				<Modal.Title className='header-modal'>Không thể xóa</Modal.Title>
			</Modal.Header>
			<Modal.Body className='content-modal'>
				Không thể xóa cấp nhân sự khi mà đang có những cấp nhân sự nhỏ hơn bên trong.
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => onCloseModal(false)}>
					Đóng
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteDepartment;
