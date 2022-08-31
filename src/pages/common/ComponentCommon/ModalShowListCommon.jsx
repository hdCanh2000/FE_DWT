import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import classNames from 'classnames';
import TableCommon from './TableCommon';

const ModalShowListCommon = ({ title, className, columns, data, show, onClose, ...props }) => {
	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size='lg'
			scrollable
			centered
			{...props}>
			<Modal.Header closeButton>
				<Modal.Title className='header-modal'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='content-modal'>
				<TableCommon className='table table-modern mb-0' columns={columns} data={data} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onClose}>
					Đóng
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ModalShowListCommon.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	show: PropTypes.bool,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	onClose: PropTypes.func,
};
ModalShowListCommon.defaultProps = {
	title: '',
	className: '',
	show: false,
	data: [],
	columns: [],
	onClose: null,
};

export default ModalShowListCommon;
