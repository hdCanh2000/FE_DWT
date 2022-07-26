// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { isArray } from 'lodash';
import moment from 'moment';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
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
import { getAllDepartments, getAllUser, getTaskById } from './services';

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

const TaskFormModal = ({ show, onClose, item, onSubmit }) => {
	const params = useParams();
	const [task, setTask] = useState({});
	const [keysState, setKeysState] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [users, setUsers] = useState([]);
	const [departmentOption, setDepartmentOption] = useState({ label: '', value: '' });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);
	const [errors, setErrors] = useState({
		name: { error: false, errorMsg: '' },
		kpi_value: { error: false, errorMsg: '' },
		priority: { error: false, errorMsg: '' },
		departmentOption: { error: false, errorMsg: '' },
		userOption: { error: false, errorMsg: '' },
	});

	const nameRef = useRef(null);
	const kpiValueRef = useRef(null);
	const priorityRef = useRef(null);
	const departmentRef = useRef(null);
	const userRef = useRef(null);

	const onValidate = (message, value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], error: value, errorMsg: value },
		}));
	};

	const validateFieldForm = (field, value) => {
		if (!value) {
			onValidate(true, field);
		}
	};

	const validateForm = () => {
		validateFieldForm('name', task?.name);
		validateFieldForm('kpi_value', task?.kpi_value);
		validateFieldForm('kpi_value', parseInt(task?.kpi_value, 10) > 0);
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
		handleClearErrorMsgAfterChange('kpi_value');
		handleClearErrorMsgAfterChange('priority');
		handleClearErrorMsgAfterChange('departmentOption');
		handleClearErrorMsgAfterChange('userOption');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task?.name, task?.kpi_value, task?.priority, departmentOption?.value, userOption?.value]);

	useEffect(() => {
		if (item?.id) {
			getTaskById(item?.id).then((res) => {
				setTask(res.data);
				setKeysState(res.data?.keys || []);
				setDepartmentOption({
					...res.data.department,
					id: res.data.department.id,
					label: res.data.department.name,
					value: res.data.department.slug,
				});
				setUserOption({
					...res.data.user,
					id: res.data.user.id,
					label: res.data.user.name,
					value: res.data.user.id,
				});
				setDepartmentRelatedOption(
					res.data?.departments_related?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.slug,
						};
					}),
				);
				setUserRelatedOption(
					res.data?.users_related?.map((user) => {
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
				kpi_value: '',
				estimate_date: moment().add(0, 'days').format('YYYY-MM-DD'),
				estimate_time: '08:00',
				deadline_date: moment().add(0, 'days').format('YYYY-MM-DD'),
				deadline_time: '17:00',
				status: 0,
			});
			setKeysState([]);
			setDepartmentOption({ label: '', value: '' });
			setUserOption({ label: '', value: '' });
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
							value: department.slug,
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

	// hàm validate cho dynamic field form
	const prevIsValid = () => {
		if (keysState?.length === 0 || keysState === null) {
			return true;
		}
		const someEmpty = keysState?.some((key) => key.key_name === '' || key.key_value === '');

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].key_name === '') {
					allPrev[index].error.key_name = 'Nhập tên chỉ số key!';
				}
				if (keysState[index].key_value === '') {
					allPrev[index].error.key_value = 'Nhập giá trị key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};

	// thêm field cho các giá trị key
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

	const handleChange = (e) => {
		const { value } = e.target;
		setTask({
			...task,
			[e.target.name]: value,
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
							event.target.value.length > 0
								? null
								: `${[event.target.name]} is required!`,
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
			kpi_value: '',
			estimate_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			estimate_time: '08:00',
			deadline_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			deadline_time: '08:00',
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
			kpi_value: '',
			estimate_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			estimate_time: '08:00',
			deadline_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			deadline_time: '17:00',
			status: 0,
		});
		setKeysState([]);
		setDepartmentOption({ label: '', value: '' });
		setUserOption({ label: '', value: '' });
		setDepartmentRelatedOption([]);
		setUserRelatedOption([]);
		setErrors({});
	};

	const handleSubmit = () => {
		const data = { ...task };
		data.mission_id = parseInt(params?.id, 10);
		data.kpi_value = parseInt(task?.kpi_value, 10);
		data.priority = parseInt(task?.priority, 10);
		data.keys = keysState.map((key) => {
			return {
				key_name: key.key_name,
				key_value: key.key_value,
			};
		});
		data.subtasks = isArray(task.subtasks) && task?.subtasks?.length > 0 ? task.subtasks : [];
		data.department = {
			id: departmentOption.id,
			name: departmentOption.label,
			slug: departmentOption.value,
		};
		data.departments_related = departmentReplatedOption.map((department) => {
			return {
				id: department.id,
				name: department.label,
				slug: department.value,
			};
		});
		data.user = {
			id: userOption.value,
			name: userOption.label,
		};
		data.users_related = userReplatedOption.map((user) => {
			return {
				id: user.id,
				name: user.label,
			};
		});
		validateForm();
		if (!task?.name) {
			nameRef.current.focus();
			return;
		}
		if (parseInt(task?.kpi_value, 10) <= 0) {
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
		onSubmit(data);
		handleClearForm();
	};

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
											className='col-12'
											id='name'
											label='Tên công việc'>
											<Input
												onChange={handleChange}
												value={task.name || ''}
												name='name'
												ref={nameRef}
												required
												placeholder='Tên công việc'
												size='lg'
												className='border border-2'
											/>
										</FormGroup>
										{errors?.name?.errorMsg && (
											<ErrorText>Vui lòng nhập tên công việc</ErrorText>
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
												className='border border-2'
											/>
										</FormGroup>
										<FormGroup
											className='col-12'
											id='kpi_value'
											label='Giá trị KPI'>
											<Input
												ref={kpiValueRef}
												type='number'
												name='kpi_value'
												onChange={handleChange}
												value={task.kpi_value || ''}
												required
												size='lg'
												placeholder='Giá trị KPI'
												className='border border-2'
											/>
										</FormGroup>
										{errors?.kpi_value?.errorMsg && (
											<ErrorText>Vui lòng nhập giá trị KPI hợp lệ</ErrorText>
										)}
										<FormGroup
											className='col-12'
											id='priority'
											label='Độ ưu tiên'>
											<Select
												ref={priorityRef}
												name='priority'
												ariaLabel='Board select'
												className='border border-2'
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
										<FormGroup
											className='col-12'
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
												Vui lòng chọn phòng ban phụ trách cho công việc
											</ErrorText>
										)}
										{/* nhân viên phụ trách chính */}
										<FormGroup
											className='col-12'
											id='userOption'
											label='Nhân viên phụ trách'>
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
												Vui lòng chọn nhân viên phụ trách cho công việc
											</ErrorText>
										)}
										{/* phòng ban liên quan */}
										<FormGroup
											className='col-12'
											id='departmentReplatedOption'
											label='Phòng ban liên quan'>
											<SelectComponent
												style={customStyles}
												placeholder='Chọn phòng ban liên quan'
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
												placeholder='Chọn nhân viên liên quan'
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
												className='w-50 mr-2'
												style={{ width: '45%', marginRight: 10 }}
												id='estimate_date'
												label='Ngày dự kiến hoàn thành'
												isFloating>
												<Input
													name='estimate_date'
													placeholder='Ngày dự kiến hoàn thành'
													onChange={handleChange}
													value={
														task.estimate_date ||
														moment().add(0, 'days').format('YYYY-MM-DD')
													}
													type='date'
													size='lg'
													className='border border-2'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 mr-2'
												style={{ width: '45%', marginRight: 10 }}
												id='estimate_time'
												label='Thời gian dự kiến hoàn thành'
												isFloating>
												<Input
													name='estimate_time'
													placeholder='Thời gian dự kiến hoàn thành'
													type='time'
													value={task.estimate_time || '08:00'}
													onChange={handleChange}
													size='lg'
													className='border border-2'
												/>
											</FormGroup>
										</div>
										<div className='d-flex align-items-center justify-content-between'>
											<FormGroup
												className='w-50 ml-2'
												style={{ width: '45%', marginRight: 10 }}
												id='deadline_date'
												label='Hạn ngày hoàn thành'
												isFloating>
												<Input
													name='deadline_date'
													placeholder='Hạn ngày hoàn thành'
													onChange={handleChange}
													value={
														task.deadline_date ||
														moment().add(0, 'days').format('YYYY-MM-DD')
													}
													type='date'
													size='lg'
													className='border border-2'
												/>
											</FormGroup>
											<FormGroup
												className='w-50 mr-2'
												style={{ width: '45%', marginLeft: 10 }}
												id='deadline_time'
												label='Hạn thời gian hoàn thành'
												isFloating>
												<Input
													name='deadline_time'
													placeholder='Hạn thời gian hoàn thành'
													type='time'
													value={task.deadline_time || '08:00'}
													onChange={handleChange}
													size='lg'
													className='border border-2'
												/>
											</FormGroup>
										</div>
										<FormGroup>
											<Button variant='success' onClick={handleAddFieldKey}>
												Thêm chỉ số key
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{keysState?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
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
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.key_name || ''}
																name='key_name'
																required
																size='lg'
																className='border border-2'
																placeholder='VD: Doanh thu, đơn hàng, ...'
															/>
														</FormGroup>
														{item.error?.key_name && (
															<ErrorText>
																{item.error?.key_name}
															</ErrorText>
														)}
													</div>
													<div style={{ width: '45%', marginLeft: 10 }}>
														<FormGroup
															className='ml-2'
															id='name'
															label='Giá trị key'>
															<Input
																onChange={(e) =>
																	handleChangeKeysState(index, e)
																}
																value={item?.key_value || ''}
																name='key_value'
																size='lg'
																required
																className='border border-2'
																placeholder='VD: 100 tỷ, 1000 đơn hàng, ..'
															/>
														</FormGroup>
														{item.error?.key_value && (
															<ErrorText>
																{item.error?.key_value}
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
					Lưu mục tiêu
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default TaskFormModal;
