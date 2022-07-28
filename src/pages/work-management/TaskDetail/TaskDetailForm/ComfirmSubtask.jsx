import React from 'react';
import { Button, Modal } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const ComfirmSubtask = ({ openModal, onCloseModal, onConfirm, title, content }) => {
	const onSubmit = () => {
		onConfirm();
		onCloseModal();
	};
	return (
		<Modal
			show={openModal}
			onHide={() => onCloseModal()}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			keyboard={false}
			centered>
			<Modal.Header closeButton>
				<Modal.Title className='header-modal'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='content-modal' dangerouslySetInnerHTML={{ __html: content }} />
			<Modal.Footer>
				<Button variant='secondary' onClick={onCloseModal}>
					Đóng
				</Button>
				<Button variant='primary' onClick={onSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ComfirmSubtask;
