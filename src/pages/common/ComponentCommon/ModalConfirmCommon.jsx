import React from 'react';

import PropTypes from 'prop-types';

import { Button, Modal } from 'react-bootstrap';

import moment from 'moment';

import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

import FormGroup from '../../../components/bootstrap/forms/FormGroup';

import Input from '../../../components/bootstrap/forms/Input';

import Textarea from '../../../components/bootstrap/forms/Textarea';

import { FORMAT_TASK_STATUS } from '../../../utils/constants';

const ModalConfirmCommon = ({
	type,
	show,
	title,
	subTitle,
	status,
	onClose,
	onSubmit,

	item,

	...props
}) => {
	const person = window.localStorage.getItem('name');

	const handleSubmit = () => {
		const newWorks = JSON.parse(JSON.stringify(item?.logs || []));

		const newLogs = [
			...newWorks,

			{
				user: person,

				type: 1,

				prev_status: FORMAT_TASK_STATUS(item?.status),

				next_status: FORMAT_TASK_STATUS(status),

				[item?.mission_id ? 'task_id' : 'subtask_id']: item?.id,

				[item?.mission_id ? 'task_name' : 'subtask_name']: item?.name,

				time: moment().format('YYYY/MM/DD hh:mm'),
			},
		];

		const newItem = { ...item, logs: newLogs };

		onSubmit(status, newItem);
	};

	return (
		<Modal show={show} onHide={onClose} size='lg' scrollable centered {...props}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-md-12'>
						<form>
							<Card shadow='sm'>
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>{subTitle || title}</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										{status === 4 && (
											<FormGroup
												className='col-12'
												id='kpi_value'
												label='Giá trị đánh giá'>
												<Input
													type='number'
													name='kpi_value'
													required
													size='lg'
													placeholder='Giá trị KPI đánh giá'
													className='border border-2'
												/>
											</FormGroup>
										)}
										<FormGroup
											className='col-12'
											id='description'
											label='Ghi chú'>
											<Textarea
												name='description'
												required
												size='lg'
												placeholder='Ghi chú'
												rows={4}
												className='border border-2'
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</form>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onClose}>
					Đóng
				</Button>
				<Button variant='primary' onClick={handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ModalConfirmCommon.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	subTitle: PropTypes.string,
	isScrollable: PropTypes.bool,
	show: PropTypes.bool,
	type: PropTypes.number,
	status: PropTypes.number,
	// eslint-disable-next-line react/forbid-prop-types
	item: PropTypes.object,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
};
ModalConfirmCommon.defaultProps = {
	className: null,
	title: null,
	subTitle: null,
	isScrollable: false,
	show: false,
	type: 1,
	status: null,
	item: null,
	onClose: null,
	onSubmit: null,
};

export default ModalConfirmCommon;
