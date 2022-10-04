import React from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import PropTypes from 'prop-types';
import { arrayToTree } from 'performant-array-to-tree';
import { Button, Modal } from 'react-bootstrap';
import './pickList.css';

const ListPickKpiNorm = ({ data, handleClose, show }) => {
	const newData = arrayToTree(data, { childrenField: 'children', dataField: null });
	return (
		<Modal show={show} onHide={handleClose} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Nhiệm vụ con</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<DropdownTreeSelect
					texts={{ placeholder: 'Chọn nhiệm vụ con' }}
					data={newData}
					className='bootstrap-demo'
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleClose}>
					Close
				</Button>
				<Button variant='primary'>Chốt nhiệm vụ</Button>
			</Modal.Footer>
		</Modal>
	);
};
ListPickKpiNorm.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
};

ListPickKpiNorm.defaultProps = {
	data: [],
	handleClose: null,
	show: false,
};
export default ListPickKpiNorm;
