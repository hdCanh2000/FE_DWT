// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import _, { parseInt } from 'lodash';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import SelectComponent from 'react-select';
import { useToasts } from 'react-toast-notifications';
import {
	updateSubtasks,
	getAllDepartments,
	getAllUser,
	getTask,
	getMission,
	updateCurrentKpiMission,
} from '../services';
// updateCurrentKpiMission
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
import Card, { CardBody } from '../../../../components/bootstrap/Card';
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
		estimate_date: '2022-12-01',
		estimate_time: '08:00',
		deadline_date: '2022-12-01',
		deadline_time: '17:00',
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
				value?.users_related?.map((item) => {
					return {
						id: item.id,
						label: item.name,
						value: item.id,
					};
				}),
			);
			setDepartmentRelated(
				value?.departments_related?.map((item) => {
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
	const handleChangeCurrentKpiMission = async () => {
		let CurrentKpi = 0;
		const newTask = await (await getTask()).data;
		newTask?.forEach((item) => {
			item?.subtasks?.forEach((res) => {
				CurrentKpi += res.kpi_value;
			});
		});
		const misson = await (await getMission()).data;
		const newMission = misson?.map((item) => {
			return item.id === task?.mission_id
				? {
						...item,
						current_kpi_value: CurrentKpi,
				  }
				: item;
		});
		await updateCurrentKpiMission(task?.mission_id, newMission[0]);
	};
	React.useEffect(() => {
		if (task.mission_id) {
			handleChangeCurrentKpiMission();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task]);
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
					prev_status: null,
					next_status: `Thêm mới`,
					subtask_id: task.subtasks.length + 1,
					subtask_name: valueInput?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const subTaskValue = JSON.parse(JSON.stringify(task?.subtasks));
			subTaskValue.push({
				...valueInput,
				kpi_value: parseInt(valueInput?.kpi_value, 10),
				keys: keysState,
				user: {
					id: valueUser.id,
					name: valueUser.label,
				},
				department: {
					id: valueDepartment.id,
					name: valueDepartment.label,
				},
				departments_related: valueDepartments,
				users_related: valueUsers,
				id: task.subtasks.length + 1,
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
			if (!valueInput?.kpi_value) {
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
				// eslint-disable-next-line no-unsafe-optional-chaining
				current_kpi_value:
					totalKpiSubtask(task?.subtasks) + parseInt(valueInput?.kpi_value, 10),
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
					prev_status: null,
					next_status: `Chỉnh sửa`,
					subtask_id: idEdit,
					subtask_name: subtask?.name,
					time: moment().format('YYYY/MM/DD hh:mm'),
				},
			];
			const newSubTasks = task.subtasks.map((item) => {
				return item.id === idEdit
					? {
							...valueInput,
							keys: keysState,
							kpi_value: parseInt(valueInput?.kpi_value),
							departments_related: valueDepartments,
							users_related: valueUsers,
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
			if (!valueInput?.kpi_value) {
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
				current_kpi_value: totalKpiSubtask(newSubTasks),
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
	const totalKpiSubtask = (subtasks) => {
		if (_.isEmpty(subtasks)) return 0;
		let totalKpi = 0;
		subtasks.forEach((item) => {
			totalKpi += item.kpi_value;
		});
		return totalKpi;
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
						<FormGroup id='total_kpi_value' label='Mức điểm KPI' isFloating>
							<Input
								type='number'
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
					onClick={() => handleSubmit(id)}>
					Lưu đầu việc
				</Button>
			</ModalFooter>
		</Modal>
	);
};
export default TaskDetailForm;
