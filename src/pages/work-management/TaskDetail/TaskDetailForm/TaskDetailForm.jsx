// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import Select from 'react-select';
import { updateSubtasks, getAllDepartments, getAllUser } from '../services';
import Modal, {
	ModalHeader,
	ModalBody,
	ModalTitle,
	ModalFooter,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import Icon from '../../../../components/icon/Icon';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;
const TaskDetailForm = ({
	editModalStatus,
	setEditModalStatus,
	id,
	task,
	title,
	setTask,
	idEdit,
}) => {
	// state
	const [valueInput, setValueInput] = React.useState({});
	const [keysState, setKeysState] = React.useState([]);
	const [department, setDepartment] = React.useState([]);
	const [valueDepartment, setValueDepartment] = React.useState({});
	const [user, setUser] = React.useState([]);
	const [valueUser, setValueUser] = React.useState({});

	const initError = {
		name: { errorMsg: '' },
		description: { errorMsg: '' },
		kpi_value: { errorMsg: '' },
		user: { errorMsg: '' },
		department: { errorMsg: '' },
	};
	const [errors, setErrors] = React.useState(initError);
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);
	const kpiRef = useRef(null);
	const userRef = useRef(null);
	const departmentRef = useRef(null);
	const initValueInput = {
		task_id: id,
		priority: 2,
		status: 0,
		percent: 0,
		name: '',
		description: '',
		estimate_date: moment().add(0, 'days').format('YYYY/MM/DD'),
		estimate_time: '',
		deadline_date: moment().add(0, 'days').format('YYYY/MM/DD'),
		deadline_time: '',
		kpi_value: 0,
		keys: [],
		steps: [],
	};
	// render data
	useEffect(() => {
		getAllDepartments().then((res) => {
			setDepartment(
				res?.data?.map((item) => {
					return {
						id: item.id,
						label: item.name,
						value: item.slug,
					};
				}),
			);
		});
		getAllUser().then((res) => {
			setUser(
				res?.data?.map((item) => {
					return {
						id: item.id,
						label: item.name,
						value: item.slug,
					};
				}),
			);
		});
		setErrors(initError);
		if (idEdit && title !== 'add') {
			setValueInput(task.subtasks.filter((item) => item.id === idEdit)[0]);
			setValueUser({
				id: task.subtasks.filter((item) => item.id === idEdit)[0]?.user?.id,
				label: task.subtasks.filter((item) => item.id === idEdit)[0]?.user?.name,
			});
			setValueDepartment({
				id: task.subtasks.filter((item) => item.id === idEdit)[0]?.department?.id,
				label: task.subtasks.filter((item) => item.id === idEdit)[0]?.department?.name,
			});
			setKeysState(task.subtasks.filter((item) => item.id === idEdit)[0]?.keys || []);
		} else {
			setValueDepartment({});
			setValueUser({});
			setValueInput(initValueInput);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idEdit]);
	// handle
	const handleChange = (e) => {
		const { value, name } = e.target;
		setValueInput({
			...valueInput,
			[name]: value,
		});
	};
	const handleSunmit = async () => {
		setErrors(initError);
		if (title === 'add') {
			const subTaskValue = JSON.parse(JSON.stringify(task.subtasks));
			subTaskValue.push({
				...valueInput,
				keys: keysState,
				user: {
					id: valueUser.id,
					name: valueUser.label,
				},
				department: {
					id: valueDepartment.id,
					name: valueDepartment.label,
				},
				id: task.subtasks.length + 1,
			});
			validateForm();
			if (!valueInput?.name) {
				nameRef.current.focus();
				return;
			}
			if (!valueDepartment.label) {
				departmentRef.current.focus();
				return;
			}
			if (!valueUser?.label) {
				userRef.current.focus();
				return;
			}
			if (!valueInput?.kpi_value) {
				kpiRef.current.focus();
				return;
			}
			if (!valueInput?.description) {
				descriptionRef.current.focus();
				return;
			}
			const taskValue = JSON.parse(JSON.stringify(task));
			const data = Object.assign(taskValue, { subtasks: subTaskValue });
			try {
				const respose = await updateSubtasks(id, data).then(
					toast.success('Create Task Success !'),
				);
				const result = await respose.data;
				setTask(result);
			} catch (error) {
				toast.error('Create Task Error !');
			}
		} else {
			const newSubTasks = task.subtasks.map((item) => {
				return item.id === idEdit
					? {
							...valueInput,
							keys: keysState,
							user: {
								id: valueUser.id,
								name: valueUser.label,
							},
							department: {
								id: valueDepartment.id,
								name: valueDepartment.label,
							},
					  }
					: item;
			});
			validateForm();
			if (!valueInput?.name) {
				nameRef.current.focus();
				return;
			}
			if (!valueInput?.department) {
				departmentRef.current.focus();
				return;
			}
			if (!valueInput?.user) {
				userRef.current.focus();
				return;
			}
			if (!valueInput?.kpi_value) {
				kpiRef.current.focus();
				return;
			}
			if (!valueInput?.description) {
				descriptionRef.current.focus();
				return;
			}
			const taskValue = JSON.parse(JSON.stringify(task));
			const newData = Object.assign(taskValue, { subtasks: newSubTasks });
			try {
				const respose = await updateSubtasks(id, newData).then(
					toast.success('Edit Task Success !'),
				);
				const result = await respose.data;
				setTask(result);
			} catch (error) {
				toast.error('Edit Task Error !');
			}
		}
		setEditModalStatus(false);
	};
	const prevIsValid = () => {
		if (keysState?.length === 0 || !keysState) {
			return true;
		}
		const someEmpty = keysState?.some((key) => key?.key_name === '' || key?.key_value === '');

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((_key, index) => {
				const allPrev = [...keysState] || [];
				if (keysState[index]?.key_name === '') {
					allPrev[index].error.key_name = 'Nhập tên chỉ số key!';
				}
				if (keysState[index]?.key_value === '') {
					allPrev[index].error.key_value = 'Nhập giá trị key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};
	const handleRemoveKeyField = (_e, index) => {
		setKeysState((prev) => prev?.filter((state) => state !== prev[index]));
	};
	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev?.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0
								? null
								: `${[event.target.name]} is required!`,
					},
				};
			});
		});
	};
	const handleAddFieldKey = () => {
		const initKeyState = {
			key_name: '',
			key_value: '',
			error: {
				key_name: null,
				key_value: null,
			},
		};
		if (prevIsValid()) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};
	// valueDalite
	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};
	const validateFieldForm = (field, value) => {
		if (!value) {
			onValidate(true, field);
		}
	};
	const validateForm = () => {
		validateFieldForm('name', valueInput?.name);
		validateFieldForm('description', valueInput?.description);
		validateFieldForm('kpi_value', valueInput?.kpi_value);
		validateFieldForm('department', valueDepartment?.label);
		validateFieldForm('user', valueUser?.label);
	};
	return (
		<Modal setIsOpen={setEditModalStatus} isOpen={editModalStatus} size='lg' isScrollable>
			<Toaster />
			<ModalHeader className='px-4' setIsOpen={setEditModalStatus}>
				<ModalTitle id='project-edit'>
					{title === 'add' ? 'Thêm mới đầu việc ' : 'Sửa đầu việc'}
				</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<div className='row g-4'>
					<div className='col-12'>
						<FormGroup id='name' label='Tên đầu việc' isFloating>
							<Input
								onChange={handleChange}
								placeholder='Tên đầu việc'
								value={valueInput.name || ''}
								name='name'
								ref={nameRef}
							/>
						</FormGroup>
						{errors?.name?.errorMsg && (
							<ErrorText>Vui lòng nhập tên mục tiêu</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='department' label='Phòng ban'>
							<Select
								defaultValue={valueDepartment}
								value={valueDepartment}
								onChange={setValueDepartment}
								options={department}
								ref={departmentRef}
							/>
						</FormGroup>
						{errors?.department?.errorMsg && (
							<ErrorText>Vui lòng chọn phòng ban phụ trách</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='user' label='Nhân viên phụ trách'>
							<Select
								defaultValue={valueUser}
								value={valueUser}
								onChange={setValueUser}
								options={user}
								ref={userRef}
							/>
						</FormGroup>
						{errors?.user?.errorMsg && (
							<ErrorText>Vui lòng chọn người phụ trách</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='total_kpi_value' label='Mức điểm KPI' isFloating>
							<Input
								placeholder='Mức điểm KPI'
								value={valueInput.kpi_value || ''}
								name='kpi_value'
								onChange={handleChange}
								ref={kpiRef}
							/>
						</FormGroup>
						{errors?.kpi_value?.errorMsg && <ErrorText>Vui lòng nhập KPI</ErrorText>}
					</div>
					<div className='col-6'>
						<FormGroup id='estimateDate' label='Ngày hoàn thành ước tính' isFloating>
							<Input
								placeholder='Ngày hoàn thành ước tính'
								type='date'
								value={
									valueInput.estimate_date ||
									moment().add(0, 'days').format('YYYY/MM/DD')
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
								value={valueInput.estimate_time || ''}
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
									moment().add(0, 'days').format('YYYY/MM/DD')
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
								value={valueInput.deadline_time || ''}
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
										value={valueInput.description}
										name='description'
										onChange={handleChange}
										ref={descriptionRef}
									/>
								</FormGroup>
								{errors?.description?.errorMsg && (
									<ErrorText>Vui lòng nhập ghi chú</ErrorText>
								)}
							</CardBody>
						</Card>
					</div>
					<div className='col-12'>
						<FormGroup>
							<Button
								variant='success'
								onClick={handleAddFieldKey}
								icon='AddCircle'
								color='success'
								size='lg'>
								Thêm chỉ số key
							</Button>
						</FormGroup>
						{/* eslint-disable-next-line no-shadow */}
						{keysState?.map((item, index) => {
							return (
								<div
									key={item.id}
									// eslint-disable-next-line react/no-array-index-key
									className='mt-4 d-flex align-items-center justify-content-between'>
									<div
										style={{
											width: '45%',
											marginRight: 10,
										}}>
										<FormGroup
											className='mr-2'
											id='name'
											label='Tên chỉ số key'>
											<Input
												onChange={(e) => handleChangeKeysState(index, e)}
												value={item?.key_name || ''}
												name='key_name'
												required
												size='lg'
												className='border border-2'
												placeholder='VD: Doanh thu, đơn hàng, ...'
											/>
										</FormGroup>
										{item.error?.key_name && (
											<ErrorText>{item.error?.key_name}</ErrorText>
										)}
									</div>
									<div style={{ width: '45%', marginLeft: 10 }}>
										<FormGroup className='ml-2' id='name' label='Giá trị key'>
											<Input
												onChange={(e) => handleChangeKeysState(index, e)}
												value={item?.key_value || ''}
												name='key_value'
												size='lg'
												required
												className='border border-2'
												placeholder='VD: 100 tỷ, 1000 đơn hàng, ..'
											/>
										</FormGroup>
										{item.error?.key_value && (
											<ErrorText>{item.error?.key_value}</ErrorText>
										)}
									</div>
									<FormGroup>
										<Button
											color='light'
											variant='light'
											style={{
												background: 'transparent',
												border: 0,
											}}
											size='lg'
											className='mt-4 h-100'
											onClick={(e) => handleRemoveKeyField(e, index)}>
											<Icon icon='Trash' size='lg' />
										</Button>
									</FormGroup>
								</div>
							);
						})}
					</div>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button
					color='primary'
					className='w-100'
					type='submit'
					onClick={() => handleSunmit(id)}>
					Lưu đầu việc
				</Button>
			</ModalFooter>
		</Modal>
	);
};
export default TaskDetailForm;
