/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button, Modal } from 'react-bootstrap';
import SelectComponent from 'react-select';
import styled from 'styled-components';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Option from '../../../components/bootstrap/Option';
import Icon from '../../../components/icon/Icon';
import { PRIORITIES } from '../../../utils/constants';
import { getAllDepartments, getAllKeys, getAllMission, getAllUser, getTaskById } from './services';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '4px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskFormModal = ({ show, onClose, item, onSubmit, isShowMission }) => {
	const [task, setTask] = useState({});
	const [keysState, setKeysState] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [users, setUsers] = useState([]);
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);
	const [missionOptions, setMissionOptions] = useState([]);
	const [valueMission, setValueMisson] = useState({});
	const [keyOption, setKeyOption] = useState([]);
	const [errors, setErrors] = useState({
		name: { error: false, errorMsg: '' },
		kpiValue: { error: false, errorMsg: '' },
		priority: { error: false, errorMsg: '' },
		departmentOption: { error: false, errorMsg: '' },
		userOption: { error: false, errorMsg: '' },
	});

	const nameRef = useRef(null);
	const kpiValueRef = useRef(null);
	const priorityRef = useRef(null);
	const departmentRef = useRef(null);
	const userRef = useRef(null);

	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};

	const validateFieldForm = (field, value) => {
		if (value === '' || !value || value === false) {
			onValidate(true, field);
		}
	};

	const validateForm = () => {
		validateFieldForm('name', task?.name);
		validateFieldForm('kpiValue', task?.kpiValue);
		validateFieldForm('kpiValue', parseInt(task?.kpiValue, 10) > 0);
		validateFieldForm('priority', task?.priority);
		validateFieldForm('departmentOption', departmentOption?.value);
		validateFieldForm('userOption', userOption?.value);
	};

	const handleClearErrorMsgAfterChange = (name) => {
		if (task?.[name] || departmentOption?.value || userOption?.value) {
			setErrors((prev) => ({
				...prev,
				[name]: { ...prev[name], errorMsg: '' },
			}));
		}
	};

	useEffect(() => {
		handleClearErrorMsgAfterChange('name');
		handleClearErrorMsgAfterChange('kpiValue');
		handleClearErrorMsgAfterChange('priority');
		handleClearErrorMsgAfterChange('departmentOption');
		handleClearErrorMsgAfterChange('userOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task?.name, task?.kpiValue, task?.priority, departmentOption?.value, userOption?.value]);

	useEffect(() => {
		if (item?.id) {
			getTaskById(item?.id).then((res) => {
				const response = res.data;
				setTask(response?.data);
				setKeysState(response.data?.keys || []);
				setDepartmentOption({
					...response.data.departments[0],
					id: response.data.departments[0].id,
					label: response.data.departments[0].name,
					value: response.data.departments[0].id,
				});
				setUserOption({
					...response.data.users[0],
					id: response.data.users[0].id,
					label: response.data.users[0].name,
					value: response.data.users[0].id,
				});
				setDepartmentRelatedOption(
					response.data?.departments?.slice(1)?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
				setUserRelatedOption(
					response.data?.users?.slice(1)?.map((user) => {
						return {
							id: user.id,
							label: user.name,
							value: user.id,
						};
					}),
				);
			});
		} else {
			setTask({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				estimateDate: '',
				estimateTime: '',
				deadlineDate: '',
				deadlineTime: '',
				status: 0,
			});
			setKeysState([]);
			setDepartmentOption({});
			setUserOption({});
			setDepartmentRelatedOption([]);
			setUserRelatedOption([]);
		}
	}, [item?.id]);

	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
				const data = await response.data;
				setDepartments(
					data.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
			} catch (error) {
				setDepartments([]);
			}
		}
		getDepartments();
	}, []);

	useEffect(() => {
		async function getUsers() {
			try {
				const response = await getAllUser();
				const data = await response.data;
				setUsers(
					data.map((user) => {
						return {
							id: user.id,
							label: user.name,
							value: user.id,
						};
					}),
				);
			} catch (error) {
				setUsers([]);
			}
		}
		getUsers();
	}, []);

	useEffect(() => {
		getAllMission().then((res) => {
			setMissionOptions(
				res.data.map((mission) => {
					return {
						id: mission.id,
						label: mission.name,
						value: mission.id,
					};
				}),
			);
		});
	}, []);
	useEffect(() => {
		async function getKey() {
			try {
				const response = await getAllKeys();
				const data = await response.data;
				setKeyOption(data);
			} catch (error) {
				setKeyOption([]);
			}
		}
		getKey();
	}, []);
	// hàm validate cho dynamic field form
	const prevIsValid = () => {
		if (keysState?.length === 0 || keysState === null) {
			return true;
		}
		const someEmpty = keysState?.some(
			(key) => key.keyName === '' || key.keyValue === '' || key.keyType === '',
		);

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].keyName === '') {
					allPrev[index].error.keyName = 'Nhập Tên chỉ số đánh giá!';
				}
				if (keysState[index].keyValue === '') {
					allPrev[index].error.keyValue = 'Nhập giá trị!';
				}
				if (keysState[index].keyType === '') {
					allPrev[index].error.keyType = 'Nhập loại key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};

	// thêm field cho các giá trị key
	const handleAddFieldKey = () => {
		const initKeyState = {
			keyName: '',
			keyValue: '',
			keyType: '',
			error: {
				keyName: null,
				keyValue: null,
				keyType: null,
			},
		};
		if (prevIsValid() && keysState?.length <= 3) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};

	const handleChange = (e) => {
		const { value, name } = e.target;
		setTask({
			...task,
			[name]: value,
		});
	};

	// hàm onchange cho input key
	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0 ? null : `Vui lòng nhập đầu đủ thông tin`,
					},
				};
			});
		});
	};

	// xoá các key theo index
	const handleRemoveKeyField = (e, index) => {
		setKeysState((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setTask({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			estimateDate: '',
			estimateTime: '08:00',
			deadlineDate: '',
			deadlineTime: '08:00',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setUserOption({});
		setUserRelatedOption([]);
	};

	// close form
	const handleCloseForm = () => {
		onClose();
		setTask({
			id: null,
			name: '',
			description: '',
			kpiValue: '',
			estimateDate: '',
			estimateTime: '08:00',
			deadlineDate: '',
			deadlineTime: '17:00',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({ label: '', value: '' });
		setUserOption({ label: '', value: '' });
		setDepartmentRelatedOption([]);
		setUserRelatedOption([]);
		setErrors({});
	};
	const person = window.localStorage.getItem('name');
	const handleSubmit = () => {
		validateForm();
		if (!task?.name) {
			nameRef.current.focus();
			return;
		}
		if (parseInt(task?.kpiValue, 10) <= 0) {
			kpiValueRef.current.focus();
			return;
		}
		if (!task?.priority) {
			priorityRef.current.focus();
			return;
		}
		if (!departmentOption?.value) {
			departmentRef.current.focus();
			return;
		}
		if (!userOption?.value) {
			userRef.current.focus();
			return;
		}
		if (!prevIsValid()) {
			return;
		}
		const newWorks = JSON.parse(JSON.stringify(task?.logs || []));
		const newNotes = JSON.parse(JSON.stringify(task?.notes || []));
		const newLogs = [
			...newWorks,
			{
				user: person,
				type: 2,
				prevStatus: null,
				nextStatus: task?.id ? 'Cập nhật' : 'Thêm mới',
				taskId: task?.id,
				taskName: task?.name,
				time: moment().format('DD/MM/YYYY hh:mm'),
				createdAt: Date.now(),
			},
		];

		const data = { ...task };
		data.kpiValue = parseInt(task?.kpiValue, 10);
		data.priority = parseInt(task?.priority, 10);
		data.keys = keysState.map((key) => {
			return {
				keyName: key.keyName,
				keyValue: key.keyValue,
				keyType: key.keyType,
			};
		});
		data.missionId = valueMission.id || null;
		data.departmentId = departmentOption.id;
		data.departments = [
			{
				id: departmentOption.id,
				name: departmentOption.label,
			},
			...departmentReplatedOption.map((department) => {
				return {
					id: department.id,
					name: department.label,
				};
			}),
		];
		data.userId = userOption.value;
		data.users = [
			{
				id: userOption.id,
				name: userOption.label,
			},
			...userReplatedOption.map((user) => {
				return {
					id: user.id,
					name: user.label,
				};
			}),
		];
		const newData = { ...data, logs: newLogs, notes: newNotes };
		onSubmit(newData);
		handleClearForm();
	};
	const compare = ['>', '=', '<', '<=', '>='];
	return (
		<Modal show={show} onHide={handleCloseForm} size='lg' scrollable centered>
			<Modal.Header closeButton>
				<Modal.Title>{item?.id ? 'Cập nhật công việc' : 'Thêm mới công việc'}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<div className='row'>
					<div className='col-md-12'>
						<form>
							<Card shadow='sm'>
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>Thông tin công việc</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup
											color='red'
											className='col-12'
											id='name'
											label='Tên công việc'>
											<Input
												onChange={handleChange}
												value={task?.name || ''}
												name='name'
												ref={nameRef}
												required
												placeholder='Tên công việc'
												size='lg'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui lòng nhập tên công việc</ErrorText>
										)}
										{isShowMission && (
											<div className='col-12'>
												<FormGroup id='task' label='Thuộc mục tiêu'>
													<SelectComponent
														placeholder='Thuộc mục tiêu'
														defaultValue={valueMission}
														value={valueMission}
														onChange={setValueMisson}
														options={missionOptions}
													/>
												</FormGroup>
											</div>
										)}
										<FormGroup
											className='col-12'
											id='description'
											label='Mô tả công việc'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={task.description || ''}
												required
												placeholder='Mô tả công việc'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											color='red'
											className='col-12'
											id='kpiValue'
											label='Giá trị KPI'>
											<Input
												ref={kpiValueRef}
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={task.kpiValue || ''}
												required
												size='lg'
												placeholder='Giá trị KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										{errors?.kpiValue?.errorMsg && (
											<ErrorText>Vui lòng nhập giá trị KPI hợp lệ</ErrorText>
										)}
										<FormGroup
											color='red'
											className='col-12'
											id='priority'
											label='Độ ưu tiên'>
											<Select
												ref={priorityRef}
												name='priority'
												ariaLabel='Board select'
												className='border border-2 rounded-0 shadow-none'
												placeholder='Độ ưu tiên'
												onChange={handleChange}
												value={task?.priority}>
												{PRIORITIES.map((priority) => (
													<Option key={priority} value={priority}>
														{`Cấp ${priority}`}
													</Option>
												))}
											</Select>
										</FormGroup>
										{errors?.priority?.errorMsg && (
											<ErrorText>
												Vui lòng chọn độ ưu tiên cho công việc
											</ErrorText>
										)}
										{/* phòng ban phụ trách */}
										<div className='col-6'>
											<FormGroup
												color='red'
												id='departmentOption'
												label='Phòng ban phụ trách'>
												<SelectComponent
													style={customStyles}
													placeholder='Chọn phòng ban phụ trách'
													defaultValue={departmentOption}
													value={departmentOption}
													onChange={setDepartmentOption}
													options={departments}
													ref={departmentRef}
												/>
											</FormGroup>
											{errors?.departmentOption?.errorMsg && (
												<ErrorText>
													Vui lòng chọn phòng ban phụ trách
												</ErrorText>
											)}
										</div>
										{/* nhân viên phụ trách chính */}
										<div className='col-6'>
											<FormGroup
												id='userOption'
												label='Nhân viên phụ trách'
												color='red'>
												<SelectComponent
													style={customStyles}
													placeholder='Chọn nhân viên phụ trách'
													defaultValue={userOption}
													value={userOption}
													onChange={setUserOption}
													options={users}
													ref={userRef}
												/>
											</FormGroup>
											{errors?.userOption?.errorMsg && (
												<ErrorText>
													Vui lòng chọn nhân viên phụ trách
												</ErrorText>
											)}
										</div>
										{/* phòng ban liên quan */}
										<FormGroup
											className='col-12'
											id='departmentReplatedOption'
											label='Phòng ban liên quan'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={departmentReplatedOption}
												value={departmentReplatedOption}
												onChange={setDepartmentRelatedOption}
												options={departments.filter(
													(department) =>
														department.id !== departmentOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
										{/* Nhân viên liên quan */}
										<FormGroup
											className='col-12'
											id='userReplatedOption'
											label='Nhân viên liên quan'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={userReplatedOption}
												value={userReplatedOption}
												onChange={setUserRelatedOption}
												options={users.filter(
													(user) => user.id !== userOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='estimateDate'
												label='Ngày dự kiến hoàn thành'>
												<Input
													name='estimateDate'
													placeholder='Ngày dự kiến hoàn thành'
													onChange={handleChange}
													value={task.estimateDate || ''}
													type='date'
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ms-2'
												id='estimateTime'
												label='Thời gian dự kiến hoàn thành'>
												<Input
													name='estimateTime'
													placeholder='Thời gian dự kiến hoàn thành'
													type='time'
													value={task.estimateTime || ''}
													onChange={handleChange}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 me-2'
												id='deadlineDate'
												label='Hạn ngày hoàn thành'>
												<Input
													name='deadlineDate'
													placeholder='Hạn ngày hoàn thành'
													onChange={handleChange}
													value={task.deadlineDate || ''}
													type='date'
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 ms-2'
												id='deadlineTime'
												label='Hạn thời gian hoàn thành'>
												<Input
													name='deadlineTime'
													placeholder='Hạn thời gian hoàn thành'
													type='time'
													value={task.deadlineTime || ''}
													onChange={handleChange}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
										<FormGroup>
											<Button variant='success' onClick={handleAddFieldKey}>
												Thêm tiêu chí đánh giá
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{keysState?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
													className='mt-4 d-flex align-items-center justify-content-between'>
													<div style={{ width: '40%', marginRight: 10 }}>
														<FormGroup
															className='mr-2'
															id='name'
															label={`Chỉ số key ${index + 1}`}>
															<Select
																name='keyName'
																required
																size='lg'
																className='border border-2 rounded-0 shadow-none'
																placeholder='Chọn chỉ số Key'
																value={item?.keyName}
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}>
																{keyOption.map((key) => (
																	<Option
																		key={`${key?.name} (${key?.unit?.name})`}
																		value={`${key?.name} (${key?.unit?.name})`}>
																		{`${key?.name} (${key?.unit?.name})`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyName && (
															<ErrorText>
																{item.error?.keyName}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '15%' }}>
														<FormGroup
															className='ml-2'
															id='type'
															label='So sánh'>
															<Select
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyType}
																name='keyType'
																size='lg'
																required
																ariaLabel='So sánh'
																className='border border-2 rounded-0 shadow-none'
																placeholder='> = <'>
																{compare.map((element) => (
																	<Option
																		key={`${element}`}
																		value={`${element}`}>
																		{`${element}`}
																	</Option>
																))}
															</Select>
														</FormGroup>
														{item.error?.keyType && (
															<ErrorText>
																{item.error?.keyType}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '30 %', marginLeft: 10 }}>
														<FormGroup
															className='ml-2'
															id='name'
															label='Giá trị'>
															<Input
																type='number'
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.keyValue || ''}
																name='keyValue'
																size='lg'
																required
																className='border border-2 rounded-0 shadow-none'
																placeholder='VD: 100 , 1000 , ..'
															/>
														</FormGroup>
														{item.error?.keyValue && (
															<ErrorText>
																{item.error?.keyValue}
															</ErrorText>
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
															onClick={(e) =>
																handleRemoveKeyField(e, index)
															}>
															<Icon icon='Trash' size='lg' />
														</Button>
													</FormGroup>
												</div>
											);
										})}
									</div>
								</CardBody>
							</Card>
						</form>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseForm}>
					Đóng
				</Button>
				<Button variant='primary' type='submit' onClick={handleSubmit}>
					Lưu công việc
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default TaskFormModal;
