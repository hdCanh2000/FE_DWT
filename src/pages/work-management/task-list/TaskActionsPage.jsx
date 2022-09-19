import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import SelectComponent from 'react-select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewTask, getTaskById, updateTaskByID } from '../mission/services';
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
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { fetchKpiNormListByParams } from '../../../redux/slice/kpiNormSlice';
import Icon from '../../../components/icon/Icon';
import CustomSelect from '../../../components/form/CustomSelect';
import { fetchKeyList } from '../../../redux/slice/keySlice';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: '10px',
		fontSize: '18px',
		borderRadius: '1.25rem',
	}),
};

const TaskActionsPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const params = useParams();

	const departments = useSelector((state) => state.department.departments);
	const users = useSelector((state) => state.employee.employees);
	const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);
	const missions = useSelector((state) => state.mission.missions);

	const [task, setTask] = useState({});
	const [kpiNormOptions, setKpiNormOptions] = useState([]);
	const [missionOption, setMissionOption] = useState({});
	const [departmentOption, setDepartmentOption] = useState({ label: null, value: null });
	const [departmentReplatedOption, setDepartmentRelatedOption] = useState([]);
	const [userOption, setUserOption] = useState({ label: '', value: '' });
	const [userReplatedOption, setUserRelatedOption] = useState([]);

	useEffect(() => {
		if (params?.id) {
			getTaskById(params.id).then((res) => {
				const response = res.data;
				setTask(response?.data);
				// setKeysState(response.data?.keys || []);
				setMissionOption(
					{
						...response.data.mission,
						label: response.data.mission?.name,
						value: response.data.mission?.id,
					} || {},
				);
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
			setTask({
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
			setMissionOption({});
		}
	}, [params?.id]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchKeyList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchMissionList());
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
		setTask({
			...task,
			[name]: value,
		});
	};

	// thêm field nhiệm vụ phụ
	const handleAddFieldKPINorm = () => {
		const initKeyState = {};
		setKpiNormOptions((prev) => [...prev, initKeyState]);
	};

	// hàm onchange chọn nhiệm vụ
	const handleChangeKpiNormOption = (index, event) => {
		setKpiNormOptions((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					...event,
					[event?.target?.name]: event?.target?.value,
				};
			});
		});
	};

	// xoá các nhiệm vụ theo index
	const handleRemoveKpiNormField = (e, index) => {
		setKpiNormOptions((prev) => prev.filter((state) => state !== prev[index]));
	};

	// clear form
	const handleClearForm = () => {
		setTask({
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
		// setKeysState([]);
		setKpiNormOptions([]);
		setMissionOption({});
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
		data.kpiValue = parseInt(task?.kpiValue, 10) || calcTotalKpiValue(kpiNormOptions);
		data.priority = parseInt(task?.priority, 10);
		data.estimateMD = parseInt(task?.estimateMD, 10);
		data.mission = missionOption?.value
			? {
					id: missionOption?.value,
					name: missionOption?.label,
			  }
			: null;
		data.missionId = missionOption?.id || null;
		data.kpiNormIds = kpiNormOptions.map((item) => item.id);
		data.kpiNorms = kpiNormOptions.map((item) => {
			return {
				name: item.name,
				id: item.id,
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
		const dataSubmit = { ...data, logs: newLogs, notes: newNotes };
		if (data.id) {
			try {
				const response = await updateTaskByID(dataSubmit);
				const result = await response.data;
				handleShowToast(
					`Cập nhật nhiệm vụ!`,
					`Nhiệm vụ ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật nhiệm vụ`, `Cập nhật nhiệm vụ không thành công!`);
			}
		} else {
			try {
				const response = await addNewTask(dataSubmit);
				const result = await response.data;
				handleClearForm();
				handleShowToast(`Thêm nhiệm vụ`, `nhiệm vụ ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ không thành công!`);
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
								<CardTitle className='fs-4 ml-0'>Thêm nhiệm vụ</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='col-12 p-4'>
							<div className='row g-4'>
								{/* Tên nhiệm vụ */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='name' label='Tên nhiệm vụ'>
											<Input
												onChange={handleChange}
												value={task?.name || ''}
												name='name'
												ariaLabel='Tên nhiệm vụ'
												placeholder='Tên nhiệm vụ'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
								{/* Thuộc mục tiêu */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='task' label='Thuộc mục tiêu'>
											<SelectComponent
												placeholder='Thuộc mục tiêu'
												defaultValue={missionOption}
												value={missionOption}
												onChange={setMissionOption}
												options={missions}
											/>
										</FormGroup>
									</div>
								</div>
								{/* Mô tả nhiệm vụ */}
								<div className='row g-2'>
									<div className='col-12'>
										<FormGroup id='description' label='Mô tả nhiệm vụ'>
											<Textarea
												name='description'
												onChange={handleChange}
												value={task.description || ''}
												ariaLabel='Mô tả nhiệm vụ'
												placeholder='Mô tả nhiệm vụ'
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
													task.kpiValue ||
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
												value={task.estimateMD || ''}
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
												value={task?.review || ''}
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
												value={task?.priority}>
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
												onChange={setDepartmentOption}
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
												value={task.note || ''}
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
													task.startDate ||
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
												value={task.startTime || '08:00'}
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
													task.deadlineDate ||
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
												value={task.deadlineTime || '17:30'}
												onChange={handleChange}
												ariaLabel='Hạn thời gian hoàn thành'
												className='border border-2 rounded-0 shadow-none'
											/>
										</FormGroup>
									</div>
								</div>
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
																	disabled={
																		!departmentOption.value
																	}
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
																	handleChangeKpiNormOption(
																		index,
																		e,
																	)
																}
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
															<Input
																onChange={(e) =>
																	handleChangeKpiNormOption(
																		index,
																		e,
																	)
																}
																type='number'
																value={
																	parseInt(
																		item.quantity * item.point,
																		10,
																	) || item.total
																}
																name='total'
																size='lg'
																readOnly
																ariaLabel='Quy đổi'
																className='border border-2 rounded-0 shadow-none'
																placeholder='Quy đổi (điểm)'
															/>
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
									isDisable={!task.name}
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

export default TaskActionsPage;
