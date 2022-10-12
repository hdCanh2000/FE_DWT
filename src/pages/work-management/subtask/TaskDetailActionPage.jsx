import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';
import SelectComponent from 'react-select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewSubtask, getSubTaskById, updateSubtask } from '../TaskDetail/services';
import Toasts from '../../../components/bootstrap/Toasts';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import { fetchDepartmentList } from '../../../redux/slice/departmentSlice';
import Select from '../../../components/bootstrap/forms/Select';
import { PRIORITIES } from '../../../utils/constants';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { fetchKpiNormListByParams } from '../../../redux/slice/kpiNormSlice';
import Icon from '../../../components/icon/Icon';
import CustomSelect from '../../../components/form/CustomSelect';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import { fetchAllTask, fetchTaskById } from '../../../redux/slice/taskSlice';
import styles from './style.module.css';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskDetailActionPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const departments = useSelector((state) => state.department.departments);
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const tasks = useSelector((state) => state.task.tasks);
	const task = useSelector((state) => state.task.task);

	const [subtask, setSubTask] = useState({});
	const [kpiNormOptions, setKpiNormOptions] = useState([]);
	const [taskOption, setTaskOption] = useState({ label: '', value: '' });
	const [departmentOption, setDepartmentOption] = useState({ label: null, value: null });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);

	useEffect(() => {
		if (params?.id) {
			getSubTaskById(params.id).then((res) => {
				const response = res.data;
				setSubTask(response?.data);
				setTaskOption({
					...response.data.task,
					label: response.data.task?.name,
					value: response.data.task?.id,
				});
				setKpiNormOptions(
					response.data?.kpiNorms?.map((item) => {
						return {
							...item,
							value: item.id,
							label: item.name,
						};
					}) || [],
				);
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
			setSubTask({
				id: null,
				name: '',
				description: '',
				kpiValue: '',
				startDate: moment().add(0, 'days').format('YYYY-MM-DD'),
				startTime: '08:00',
				deadlineDate: moment().add(1, 'days').format('YYYY-MM-DD'),
				deadlineTime: '17:00',
				status: 0,
			});
			setDepartmentOption({});
			setUserOption({});
			setDepartmentRelatedOption([]);
			setUserRelatedOption([]);
			setTaskOption({});
		}
	}, [params?.id]);

	useEffect(() => {
		dispatch(fetchTaskById(params.taskId));
	}, [dispatch, params.taskId]);

	useEffect(() => {
		if (!isEmpty(task)) {
			setTaskOption(task);
		}
	}, [task]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchAllTask());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(
			fetchKpiNormListByParams({
				departmentId: parseInt(departmentOption.value, 10),
				parentId: 'null',
			}),
		);
	}, [departmentOption.value, dispatch]);

	// show toast
	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleChange = (e) => {
		const { value, name } = e.target;
		setSubTask({
			...subtask,
			[name]: value,
		});
	};

	// thêm field đầu việc phụ
	const handleAddFieldKPINorm = () => {
		const initKeyState = {};
		setKpiNormOptions((prev) => [...prev, initKeyState]);
	};

	// hàm onchange chọn đầu việc
	const handleChangeKpiNormOption = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					...event,
				};
			});
		});
	};

	// hàm onchange chọn đầu việc
	const handleChangeKpiNormInput = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event?.target?.name]: event?.target?.value,
				};
			});
		});
	};

	// xoá các đầu việc theo index
	const handleRemoveKpiNormField = (e, index) => {
		setKpiNormOptions((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setSubTask({
			id: null,
			name: '',
			description: '',
			priority: '',
			kpiValue: '',
			startDate: '',
			startTime: '',
			deadlineDate: '',
			deadlineTime: '',
			status: 0,
		});
		setDepartmentOption({});
		setDepartmentRelatedOption([]);
		setUserOption({});
		setUserRelatedOption([]);
		setKpiNormOptions([]);
		setTaskOption({});
	};

	const calcTotalKpiValue = (arr = []) => {
		let result = 0;
		arr.forEach((item) => {
			result += parseInt(item.quantity, 10) * parseInt(item.point, 10);
		});
		return result || '';
	};

	const person = window.localStorage.getItem('name');

	const handleSubmitTaskForm = async () => {
		const newWorks = JSON.parse(JSON.stringify(subtask?.logs || []));
		const newNotes = JSON.parse(JSON.stringify(subtask?.notes || []));
		const newLogs = [
			...newWorks,
			{
				user: person,
				type: 2,
				prevStatus: null,
				nextStatus: subtask?.id ? 'Cập nhật' : 'Thêm mới',
				subtaskId: subtask.id,
				subtaskName: subtask?.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
				createdAt: Date.now(),
			},
		];
		const data = { ...subtask };
		data.kpiValue = parseInt(subtask?.kpiValue, 10) || calcTotalKpiValue(kpiNormOptions);
		data.priority = parseInt(subtask?.priority, 10);
		data.estimateMD = parseInt(subtask?.estimateMD, 10);
		data.task = taskOption?.value
			? {
					id: taskOption?.value,
					name: taskOption?.label,
			  }
			: null;
		data.taskId = taskOption?.id || null;
		data.kpiNormIds = kpiNormOptions.map((item) => item.id);
		data.kpiNorms = kpiNormOptions.map((item) => {
			return {
				name: item.name,
				id: item.id,
				point: parseInt(item.point, 10),
				quantity: parseInt(item.quantity, 10),
				total: parseInt(item.quantity * item.point, 10),
			};
		});
		data.departmentId = departmentOption.id || null;
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
		data.userId = userOption.value || null;
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
		data.steps = subtask.steps ? subtask.steps : [];
		const dataSubmit = { ...data, logs: newLogs, notes: newNotes };
		if (data.id) {
			try {
				const response = await updateSubtask(dataSubmit);
				const result = await response.data;
				handleShowToast(
					`Cập nhật đầu việc!`,
					`Đầu việc ${result.name} được cập nhật thành công!`,
				);
				navigate(-1);
			} catch (error) {
				handleShowToast(`Cập nhật đầu việc`, `Cập nhật đầu việc không thành công!`);
			}
		} else {
			try {
				const response = await addNewSubtask(dataSubmit);
				const result = await response.data;
				handleClearForm();
				navigate(-1);
				handleShowToast(`Thêm đầu việc`, `Đầu việc ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm đầu việc`, `Thêm đầu việc không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.mission.text}>
			<SubHeaderCommon />
			<Page container='fluid'>
				<div className='row mx-4 px-4 my-4'>
					<Card className='p-4 w-75 m-auto'>
						<CardHeader className='py-2'>
							<CardLabel>
								<CardTitle className='fs-4 ml-0'>
									{params.id ? 'Cập nhật đầu việc' : 'Thêm đầu việc'}
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='col-12 p-4'>
							<div className='row g-4'>
								{/* Tên đầu việc */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='name' label='Tên đầu việc'>
											<Input
												onChange={handleChange}
												value={subtask?.name || ''}
												name='name'
												ariaLabel='Tên đầu việc'
												placeholder='Tên đầu việc'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Thuộc nhiệm vụ */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='task' label='Thuộc công việc'>
											<SelectComponent
												placeholder='Thuộc công việc'
												defaultValue={taskOption}
												value={taskOption}
												onChange={setTaskOption}
												options={tasks}
											/>
										</FormGroup>
									</div>
								</div>
								{/* Mô tả đầu việc */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='description' label='Mô tả đầu việc'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={subtask.description || ''}
												ariaLabel='Mô tả đầu việc'
												placeholder='Mô tả đầu việc'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Giá trị KPI - Ước tính MD - Độ ưu tiên */}
								<div className='row g-2'>
									<div className='col-4'>
										<FormGroup id='kpiValue' label='Giá trị KPI'>
											<Input
												type='number'
												name='kpiValue'
												onChange={handleChange}
												value={
													subtask.kpiValue ||
													calcTotalKpiValue(kpiNormOptions)
												}
												ariaLabel='Giá trị KPI'
												placeholder='Giá trị KPI'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup id='Ước tính MD' label='Ước tính MD'>
											<Input
												type='number'
												name='estimateMD'
												onChange={handleChange}
												value={subtask.estimateMD || ''}
												ariaLabel='Ước tính MD'
												placeholder='Ước tính MD'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup id='review' label='Thưởng/Phạt'>
											<Input
												onChange={handleChange}
												value={subtask?.review || ''}
												name='review'
												ariaLabel='Thưởng/Phạt'
												placeholder='Thưởng/Phạt'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Người phụ trách - Phòng ban phụ trách - Thưởng/Phạt */}
								<div className='row g-2'>
									<div className='col-4'>
										<FormGroup id='priority' label='Độ ưu tiên'>
											<Select
												name='priority'
												ariaLabel='Board select'
												className='border border-2 rounded-0 shadow-none'
												placeholder='Độ ưu tiên'
												onChange={handleChange}
												value={subtask?.priority}>
												{PRIORITIES.map((priority) => (
													<Option key={priority} value={priority}>
														{`Cấp ${priority}`}
													</Option>
												))}
											</Select>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup id='userOption' label='Nguời phụ trách'>
											<SelectComponent
												style={customStyles}
												placeholder='Chọn nguời phụ trách'
												defaultValue={userOption}
												value={userOption}
												onChange={setUserOption}
												options={users}
											/>
										</FormGroup>
									</div>
									<div className='col-4'>
										<FormGroup
											id='departmentOption'
											label='Phòng ban phụ trách'>
											<SelectComponent
												style={customStyles}
												placeholder='Chọn phòng ban phụ trách'
												defaultValue={departmentOption}
												value={departmentOption}
												onChange={(selectedOption) => {
													setDepartmentOption(selectedOption);
													setKpiNormOptions([]);
												}}
												options={departments}
											/>
										</FormGroup>
									</div>
								</div>
								{/* Phòng ban hỗ trợ - Người hỗ trợ */}
								<div className='row g-2'>
									<div className='col-6'>
										<FormGroup
											id='departmentReplatedOption'
											label='Phòng ban hỗ trợ'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={departmentReplatedOption}
												value={departmentReplatedOption}
												onChange={setDepartmentRelatedOption}
												isDisabled={!departmentOption.value}
												options={departments.filter(
													(department) =>
														department.id !== departmentOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup id='userReplatedOption' label='Người hỗ trợ'>
											<SelectComponent
												style={customStyles}
												placeholder=''
												defaultValue={userReplatedOption}
												value={userReplatedOption}
												onChange={setUserRelatedOption}
												isDisabled={!userOption.value}
												options={users.filter(
													(user) => user.id !== userOption?.id,
												)}
												isMulti
											/>
										</FormGroup>
									</div>
								</div>
								{/* Ghi chú */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='note' label='Ghi chú'>
											<Textarea
												name='note'
												onChange={handleChange}
												value={subtask.note || ''}
												ariaLabel='Ghi chú'
												placeholder='Ghi chú'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Thời gian bắt đầu - Thời gian dự kiến */}
								<div className='row g-2'>
									<div className='d-flex align-items-center justify-content-between'>
										<FormGroup
											className='w-50 me-2'
											id='startDate'
											label='Ngày bắt đầu'>
											<Input
												name='startDate'
												placeholder='Ngày bắt đầu'
												onChange={handleChange}
												value={
													subtask.startDate ||
													moment().add(0, 'days').format('YYYY-MM-DD')
												}
												type='date'
												ariaLabel='Ngày bắt đầu'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
										<FormGroup
											className='w-50 ms-2'
											id='startTime'
											label='Thời gian bắt đầu'>
											<Input
												name='startTime'
												placeholder='Thời gian bắt đầu'
												type='time'
												value={subtask.startTime || '08:00'}
												onChange={handleChange}
												ariaLabel='Thời gian bắt đầu'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Hạn ngày hoàn thành - Thời hạn hoàn thành */}
								<div className='row g-2'>
									<div className='d-flex align-items-center justify-content-between'>
										<FormGroup
											className='w-50 me-2'
											id='deadlineDate'
											label='Hạn ngày hoàn thành'>
											<Input
												name='deadlineDate'
												placeholder='Hạn ngày hoàn thành'
												onChange={handleChange}
												value={
													subtask.deadlineDate ||
													moment().add(1, 'days').format('YYYY-MM-DD')
												}
												type='date'
												ariaLabel='Hạn ngày hoàn thành'
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
												value={subtask.deadlineTime || '17:30'}
												onChange={handleChange}
												ariaLabel='Hạn thời gian hoàn thành'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Danh mục định mức KPI */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup>
											<Button
												color='success'
												type='button'
												className='d-block w-25 py-3'
												onClick={handleAddFieldKPINorm}>
												Thêm nhiệm vụ phụ
											</Button>
										</FormGroup>
										{/* eslint-disable-next-line no-shadow */}
										{kpiNormOptions?.map((item, index) => {
											return (
												<div
													// eslint-disable-next-line react/no-array-index-key
													key={index}
													className='row mt-4 d-flex align-items-center justify-content-between'>
													<div className='col-5'>
														<div className='w-100'>
															<FormGroup
																className='mr-2'
																id='name'
																label={`Nhiệm vụ phụ ${index + 1}`}>
																<CustomSelect
																	placeholder='Chọn nhiệm vụ phụ'
																	value={item}
																	onChange={(e) => {
																		handleChangeKpiNormOption(
																			index,
																			e,
																		);
																	}}
																	options={kpiNorms}
																/>
															</FormGroup>
														</div>
													</div>
													<div className='col-3'>
														<FormGroup
															className='ml-2'
															id='quantity'
															label='Số lượng'>
															<Input
																onChange={(e) =>
																	handleChangeKpiNormInput(
																		index,
																		e,
																	)
																}
																min={0}
																disabled={!item.value}
																type='number'
																value={item?.quantity || ''}
																name='quantity'
																size='lg'
																ariaLabel='Số lượng'
																className='border border-2 rounded-0 shadow-none'
																placeholder='Số lượng'
															/>
														</FormGroup>
													</div>
													<div className='col-3'>
														<FormGroup
															className='ml-2'
															id='total'
															label='Quy đổi (điểm)'>
															<div
																className={`${styles.total} form-control`}>
																{parseInt(
																	item.quantity * item.point,
																	10,
																) || 0}
															</div>
														</FormGroup>
													</div>
													<div className='col-1'>
														<div className='w-100'>
															<Button
																color='light'
																variant='light'
																size='lg'
																className='mt-4 h-100 bg-transparent border-0'
																onClick={(e) =>
																	handleRemoveKpiNormField(
																		e,
																		index,
																	)
																}>
																<Icon icon='Trash' size='lg' />
															</Button>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
						<div className='col-12 my-4'>
							<div className='w-100 mt-4 text-center'>
								<Button
									color='primary'
									className='w-50 p-3'
									type='button'
									isDisable={!subtask.name}
									onClick={handleSubmitTaskForm}>
									Lưu thông tin
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TaskDetailActionPage;
