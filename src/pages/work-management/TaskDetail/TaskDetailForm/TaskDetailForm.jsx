// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { parseInt } from 'lodash';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import SelectComponent from 'react-select';
import { useToasts } from 'react-toast-notifications';
import { updateSubtasks, getAllDepartments, getAllUser } from '../services';
import Modal, {
	ModalHeader,
	ModalBody,
	ModalTitle,
	ModalFooter,
} from '../../../../components/bootstrap/Modal';
import Option from '../../../../components/bootstrap/Option';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Button from '../../../../components/bootstrap/Button';
import Icon from '../../../../components/icon/Icon';
import Toasts from '../../../../components/bootstrap/Toasts';
import Select from '../../../../components/bootstrap/forms/Select';

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
	const [usersRelated, setUsersRelated] = React.useState([]);
	const [departmentRelated, setDepartmentRelated] = React.useState([]);
	const [subtask, setSubTask] = React.useState();
	const { addToast } = useToasts();
	const PRIORITIES = [5, 4, 3, 2, 1];
	const initError = {
		name: { errorMsg: '' },
		description: { errorMsg: '' },
		kpiValue: { errorMsg: '' },
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
		taskId: id,
		priority: 2,
		status: 0,
		percent: 0,
		name: '',
		description: '',
		estimateDate: '2022-12-01',
		estimateTime: '08:00',
		deadlineDate: '2022-12-01',
		deadlineTime: '17:00',
		kpiValue: 0,
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
						value: item.id,
					};
				}),
			);
		});
		setErrors(initError);
		if (idEdit && title !== 'add') {
			const value = task.subtasks.filter((item) => item.id === idEdit)[0];
			setValueInput(value);
			setSubTask(value);
			setUsersRelated(
				value?.usersRelated?.map((item) => {
					return {
						id: item.id,
						label: item.name,
						value: item.id,
					};
				}),
			);
			setDepartmentRelated(
				value?.departmentsRelated?.map((item) => {
					return {
						id: item.id,
						label: item.name,
						value: item.id,
					};
				}),
			);
			setValueUser({
				id: value?.user?.id,
				label: value?.user?.name,
			});
			setValueDepartment({
				id: value?.department?.id,
				label: value?.department?.name,
			});
			setKeysState(value?.keys || []);
		} else {
			setUsersRelated([]);
			setDepartmentRelated([]);
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
	const handleShowToast = (titles, content) => {
		addToast(
			<Toasts title={titles} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};
	const person = window.localStorage.getItem('name');
	const handleSubmit = async () => {
		const valueUsers = usersRelated.map((item) => {
			return {
				id: item?.id,
				name: item?.label,
			};
		});
		const valueDepartments = departmentRelated.map((item) => {
			return {
				id: item?.id,
				name: item?.label,
			};
		});
		setErrors(initError);
		if (title === 'add') {
			const newLogs = [
				{
					id: 1,
					user: person,
					type: 2,
					prevStatus: null,
					nextStatus: `Thêm mới`,
					// eslint-disable-next-line no-unsafe-optional-chaining
					subtaskId: task?.subtasks?.length + 1,
					subtaskName: valueInput?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const subTaskValue = JSON.parse(JSON.stringify(task?.subtasks || []));
			subTaskValue.push({
				...valueInput,
				kpiValue: parseInt(valueInput?.kpiValue, 10),
				keys: keysState,
				user: {
					id: valueUser.id,
					name: valueUser.label,
				},
				department: {
					id: valueDepartment.id,
					name: valueDepartment.label,
				},
				departmentsRelated: valueDepartments,
				usersRelated: valueUsers,
				// eslint-disable-next-line no-unsafe-optional-chaining
				id: task?.subtasks?.length + 1,
				logs: newLogs,
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
			if (!valueInput?.kpiValue) {
				kpiRef.current.focus();
				return;
			}
			if (!valueInput?.description) {
				descriptionRef.current.focus();
				return;
			}
			const taskValue = JSON.parse(JSON.stringify(task));
			const data = Object.assign(taskValue, {
				subtasks: subTaskValue,
			});
			try {
				const respose = await updateSubtasks(id, data).then(
					handleShowToast(
						`Tạo đầu việc!`,
						`Tạo đầu việc ${valueInput?.name} thành công!`,
					),
				);
				const result = await respose.data;
				setTask(result);
			} catch (error) {
				handleShowToast(`Tạo đầu việc!`, `Tạo đầu việc ${valueInput?.name} thất bại!`);
			}
			setValueInput(initValueInput);
		} else {
			const values = task?.subtasks?.filter((item) => item.id === idEdit);
			const newWorks = JSON.parse(JSON.stringify(values[0]?.logs || []));
			const newLogs = [
				...newWorks,
				{
					user: person,
					type: 2,
					prevStatus: null,
					nextStatus: `Chỉnh sửa`,
					subtaskId: idEdit,
					subtaskName: subtask?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const newSubTasks = task.subtasks.map((item) => {
				return item.id === idEdit
					? {
							...valueInput,
							keys: keysState,
							kpiValue: parseInt(valueInput?.kpiValue),
							departmentsRelated: valueDepartments,
							usersRelated: valueUsers,
							user: {
								id: valueUser.id,
								name: valueUser.label,
							},
							department: {
								id: valueDepartment.id,
								name: valueDepartment.label,
							},
							logs: newLogs,
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
			if (!valueInput?.kpiValue) {
				kpiRef.current.focus();
				return;
			}
			if (!valueInput?.description) {
				descriptionRef.current.focus();
				return;
			}

			const taskValue = JSON.parse(JSON.stringify(task));
			const newData = Object.assign(taskValue, {
				subtasks: newSubTasks,
			});
			try {
				const respose = await updateSubtasks(id, newData).then(
					toast.success(`Sửa đầu việc ${subtask?.name} thành công !`),
				);
				const result = await respose.data;
				setTask(result);
			} catch (error) {
				toast.error(`Sửa đầu việc ${subtask?.name} thất bại !`);
			}
		}
		setEditModalStatus(false);
	};
	const prevIsValid = () => {
		if (keysState?.length === 0 || !keysState) {
			return true;
		}
		const someEmpty = keysState?.some((key) => key?.keyName === '' || key?.keyValue === '');

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((_key, index) => {
				const allPrev = [...keysState] || [];
				if (keysState[index]?.keyName === '') {
					allPrev[index].error.keyName = 'Nhập tên chỉ số key!';
				}
				if (keysState[index]?.keyValue === '') {
					allPrev[index].error.keyValue = 'Nhập giá trị key!';
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
			keyName: '',
			keyValue: '',
			error: {
				keyName: null,
				keyValue: null,
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
		validateFieldForm('kpiValue', valueInput?.kpiValue);
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
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
						{errors?.name?.errorMsg && (
							<ErrorText>Vui lòng nhập tên mục tiêu</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='department' label='Phòng ban'>
							<SelectComponent
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
							<SelectComponent
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
						<FormGroup id='department' label='Phòng ban liên quan'>
							<SelectComponent
								isMulti
								defaultValue={departmentRelated}
								value={departmentRelated}
								onChange={setDepartmentRelated}
								options={department?.filter(
									(item) => item.id !== valueDepartment.id,
								)}
								placeholder=''
								ref={departmentRef}
							/>
						</FormGroup>
						{errors?.department?.errorMsg && (
							<ErrorText>Vui lòng chọn phòng ban liên quan</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='user' label='Nhân viên liên quan'>
							<SelectComponent
								isMulti
								defaultValue={usersRelated}
								value={usersRelated}
								onChange={setUsersRelated}
								options={user?.filter((item) => item.id !== valueUser.id)}
								ref={userRef}
								placeholder=''
							/>
						</FormGroup>
						{errors?.user?.errorMsg && (
							<ErrorText>Vui lòng chọn nhân viên liên quan</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='priority' label='Độ ưu tiên'>
							<Select
								name='priority'
								placeholder='Độ ưu tiên'
								className='border border-2 rounded-0 shadow-none'
								onChange={handleChange}
								value={valueInput?.priority}
								defaultValue={2}>
								{PRIORITIES.map((priority) => (
									<Option key={priority} value={priority}>
										{`Cấp ${priority}`}
									</Option>
								))}
							</Select>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='kpiValue' label='Mức điểm KPI' isFloating>
							<Input
								type='number'
								placeholder='Mức điểm KPI'
								value={valueInput.kpiValue || ''}
								name='kpiValue'
								onChange={handleChange}
								ref={kpiRef}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
						{errors?.kpiValue?.errorMsg && <ErrorText>Vui lòng nhập KPI</ErrorText>}
					</div>
					<div className='col-6'>
						<FormGroup id='estimateDate' label='Ngày hoàn thành ước tính' isFloating>
							<Input
								placeholder='Ngày hoàn thành ước tính'
								type='date'
								value={
									valueInput.estimateDate ||
									moment().add(0, 'days').format('YYYY/MM/DD')
								}
								name='estimateDate'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
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
								value={valueInput.estimateTime || ''}
								name='estimateTime'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineDate' label='Hạn ngày hoàn thành' isFloating>
							<Input
								placeholder='Hạn ngày hoàn thành'
								type='date'
								value={
									valueInput.deadlineDate ||
									moment().add(0, 'days').format('YYYY/MM/DD')
								}
								name='deadlineDate'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineTime' label='Hạn thời gian hoàn thành' isFloating>
							<Input
								placeholder='Hạn thời gian hoàn thành'
								type='time'
								value={valueInput.deadlineTime || ''}
								name='deadlineTime'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='description' label='Ghi chú mục tiêu' isFloating>
							<Textarea
								className='h-100 border border-2 rounded-0 shadow-none'
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
												value={item?.keyName || ''}
												name='keyName'
												required
												size='lg'
												className='border border-2'
												placeholder='VD: Doanh thu, đơn hàng, ...'
											/>
										</FormGroup>
										{item.error?.keyName && (
											<ErrorText>{item.error?.keyName}</ErrorText>
										)}
									</div>
									<div style={{ width: '45%', marginLeft: 10 }}>
										<FormGroup className='ml-2' id='name' label='Giá trị key'>
											<Input
												onChange={(e) => handleChangeKeysState(index, e)}
												value={item?.keyValue || ''}
												name='keyValue'
												size='lg'
												required
												className='border border-2'
												placeholder='VD: 100 tỷ, 1000 đơn hàng, ..'
											/>
										</FormGroup>
										{item.error?.keyValue && (
											<ErrorText>{item.error?.keyValue}</ErrorText>
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
					onClick={() => handleSubmit(id)}>
					Lưu đầu việc
				</Button>
			</ModalFooter>
		</Modal>
	);
};
export default TaskDetailForm;
