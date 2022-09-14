import React, { memo, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import CheckboxTree from 'react-checkbox-tree';
import Icon from '../../../components/icon/Icon';

const ConfigPermissionForm = ({ openModal, onCloseModal, onConfirm, title, permissions }) => {
	const [checked, setChecked] = useState([]);
	const [expanded, setExpanded] = useState([]);
	const data = _(permissions)
		.groupBy('moduleName')
		.map((items, moduleName) => {
			return {
				label: moduleName,
				value: moduleName,
				children: items.map((item) => {
					return {
						value: item.code,
						label: item.name,
					};
				}),
			};
		})
		.value();
	const icons = {
		expandClose: <Icon icon='ArrowRight' />,
		expandOpen: <Icon icon='ArrowDropDown' />,
	};

	return (
		<Modal
			show={openModal}
			onHide={() => onCloseModal()}
			aria-labelledby='contained-modal-title-vcenter'
			backdrop='static'
			size='lg'
			keyboard={false}
			centered>
			<Modal.Header closeButton>
				<Modal.Title className='header-modal'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='content-modal'>
				<CheckboxTree
					nodes={data}
					checked={checked}
					expanded={expanded}
					onCheck={(check) => setChecked(check)}
					onExpand={(expand) => setExpanded(expand)}
					icons={icons}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onCloseModal}>
					Đóng
				</Button>
				<Button variant='primary' onClick={() => onConfirm()}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ConfigPermissionForm.propTypes = {
	openModal: PropTypes.bool,
	onCloseModal: PropTypes.func,
	onConfirm: PropTypes.func,
	title: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	permissions: PropTypes.array,
};
ConfigPermissionForm.defaultProps = {
	openModal: false,
	onCloseModal: null,
	onConfirm: null,
	title: null,
	permissions: null,
};

export default memo(ConfigPermissionForm);
