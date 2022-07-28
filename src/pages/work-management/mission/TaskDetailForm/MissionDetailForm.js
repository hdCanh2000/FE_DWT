// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import Modal, {
	ModalHeader,
	ModalBody,
	ModalTitle,
	ModalFooter,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';

const MissionDetailFormModal = ({ editModalStatus, setEditModalStatus, id }) => {
	const [valueInput, setValueInput] = React.useState({});
	console.log(id, 'id');
	useEffect(() => {
		if (id) {
			axios.get(`https://fake-data-dwt.herokuapp.com/tasks/${id}`).then((res) => {
				setValueInput(res.data);
			});
		} else {
			setValueInput({
				mission_id: 1,
				departmnent_id: 1,
				priority: 2,
				status: 0,
				user: {
					id: 1,
					name: 'Nhân viên 1',
				},
				name: '',
				description: '',
				assign_to: '',
				teamName: '',
				estimate_date: moment().add(0, 'days').format('YYYY/MM/DD'),
				estimate_time: '',
				deadline_date: moment().add(0, 'days').format('YYYY/MM/DD'),
				deadline_time: '',
				kpi_value: 0,
				keys: null,
			});
		}
	}, [id]);
	const handleChange = (e) => {
		const { value, name } = e.target;
		setValueInput({
			...valueInput,
			[name]: value,
		});
	};
	const handleSunmit = async () => {
		if (id === undefined) {
			try {
				axios.post(`https://fake-data-dwt.herokuapp.com/tasks`, valueInput);
				toast.success('Create Task Success !');
			} catch (error) {
				toast.error('Create Task Error !');
			}
		} else {
			try {
				axios.patch(`https://fake-data-dwt.herokuapp.com/tasks/${id}`, valueInput);
				toast.success('Edit Task Success !');
			} catch (error) {
				toast.error('Edit Task Error !');
			}
		}
		setEditModalStatus(false);
	};
	return (
		<Modal setIsOpen={setEditModalStatus} isOpen={editModalStatus} size='lg' isScrollable>
			<Toaster />
			<ModalHeader className='px-4' setIsOpen={setEditModalStatus}>
				<ModalTitle id='project-edit'>Thêm mới công việc</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<div className='row g-4'>
					<div className='col-12'>
						<FormGroup id='name' label='Tên công việc' isFloating>
							<Input
								onChange={handleChange}
								placeholder='Tên công việc'
								value={valueInput.name || ''}
								name='name'
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='teamName' label='Phòng ban' isFloating>
							<Input
								placeholder='Phòng ban'
								value={valueInput.teamName || ''}
								name='teamName'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='assign_to' label='Nhân viên phụ trách' isFloating>
							<Input
								placeholder='Nhân viên phụ trách'
								value={valueInput.assign_to || ''}
								name='assign_to'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='total_kpi_value' label='Mức điểm KPI' isFloating>
							<Input
								placeholder='Mức điểm KPI'
								value={valueInput.kpi_value || ''}
								name='kpi_value'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='estimateDate' label='Ngày hoàn thành ước tính' isFloating>
							<Input
								placeholder='Ngày hoàn thành ước tính'
								type='date'
								value={
									valueInput.estimate_date ||
									moment().add(0, 'days').format('YYYY-MM-DD')
								}
								name='estimate_date'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup
							id='estimateTime'
							label='Thời gian hoàn thành ước tính'
							isFloating>
							<Input
								placeholder='Thời gian hoàn thành ước tính'
								type='time'
								value={valueInput.estimate_time || 0}
								name='estimate_time'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineDate' label='Hạn ngày hoàn thành' isFloating>
							<Input
								placeholder='Hạn ngày hoàn thành'
								type='date'
								value={
									valueInput.deadline_date ||
									moment().add(0, 'days').format('YYYY-MM-DD')
								}
								name='deadline_date'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineTime' label='Hạn thời gian hoàn thành' isFloating>
							<Input
								placeholder='Hạn thời gian hoàn thành'
								type='time'
								value={valueInput.deadline_time || 0}
								name='deadline_time'
								onChange={handleChange}
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<Card isCompact className='mb-0'>
							<CardBody>
								<FormGroup id='description' label='Ghi chú mục tiêu' isFloating>
									<Textarea
										className='h-100'
										rows={12}
										placeholder='note'
										value={valueInput.description || ''}
										name='description'
										onChange={handleChange}
									/>
								</FormGroup>
							</CardBody>
						</Card>
					</div>
					<div className='col-12'>
						<Card isCompact className='mb-0'>
							<CardHeader>
								<CardLabel>
									<CardTitle>Tạo mục tiêu</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<Button
									color='info'
									size='lg'
									isLight
									className='h-100'
									icon='AddCircle'>
									Thêm mới
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button
					color='primary'
					className='w-100'
					type='submit'
					onClick={() => handleSunmit(id)}>
					Lưu mục tiêu
				</Button>
			</ModalFooter>
		</Modal>
	);
};
export default MissionDetailFormModal;
