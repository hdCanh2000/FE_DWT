import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import { dashboardMenu, demoPages } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import Toasts from '../../components/bootstrap/Toasts';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Chart from '../../components/extras/Chart';
import useDarkMode from '../../hooks/useDarkMode';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Progress from '../../components/bootstrap/Progress';
import {
	addNewMission,
	addNewTask,
	getAllDepartments,
	getAllMission,
	updateMissionById,
	updateTaskByID,
} from '../work-management/mission/services';
import { FORMAT_TASK_STATUS, formatColorStatus, formatColorPriority } from '../../utils/constants';
import MissionFormModal from '../work-management/mission/MissionFormModal';
import Alert from '../../components/bootstrap/Alert';
import {
	getAllSubTasksByUser,
	getAllTasks,
	getAllTasksByStatus,
	getReportMisson,
	getReportSubTask,
	getReportTask,
} from './services';
import MissionChartReport from './admin/MissionChartReport';
import TaskChartReport from './admin/TaskChartReport';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import TaskFormModal from '../work-management/mission/TaskFormModal';
import TaskDetailForm from '../work-management/TaskDetail/TaskDetailForm/TaskDetailForm';
import { addNewSubtask, updateSubtask } from '../work-management/TaskDetail/services';

// eslint-disable-next-line react/prop-types
const TaskSolved = ({ id, name, to, departmentUser, value, color }) => {
	const [state] = useState({
		series: [value],
		options: {
			chart: {
				type: 'radialBar',
				width: 50,
				height: 50,
				sparkline: {
					enabled: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				radialBar: {
					hollow: {
						margin: 0,
						size: '50%',
					},
					track: {
						margin: 0,
					},
					dataLabels: {
						show: false,
					},
				},
			},
			stroke: {
				lineCap: 'round',
			},
			colors: [
				(color === 'primary' && process.env.REACT_APP_PRIMARY_COLOR) ||
					(color === 'secondary' && process.env.REACT_APP_SECONDARY_COLOR) ||
					(color === 'success' && process.env.REACT_APP_SUCCESS_COLOR) ||
					(color === 'info' && process.env.REACT_APP_INFO_COLOR) ||
					(color === 'warning' && process.env.REACT_APP_WARNING_COLOR) ||
					(color === 'danger' && process.env.REACT_APP_DANGER_COLOR),
			],
		},
	});
	return (
		<div className='col-12' key={id}>
			<div className='row g-2'>
				<div className='col d-flex'>
					<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
						<div>
							<Link to={to} className='fs-5'>
								{name}
							</Link>
							<div className='text-muted mt-n1'>
								<small style={{ fontSize: 13 }}>{departmentUser}</small>
							</div>
						</div>
					</div>
				</div>
				<div className='col-auto'>
					<div className='d-flex align-items-center'>
						<span className='me-3'>{value}%</span>
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart.type}
							height={state.options.chart.height}
							width={state.options.chart.width}
							className='me-2'
						/>
						<Button color='info' isLight icon='Check' className='text-nowrap'>
							Duyệt
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const DashboardPage = () => {
	const { darkModeStatus, themeStatus } = useDarkMode();
	const { addToast } = useToasts();
	// departments
	const [dataDepartments, setDataDepartments] = useState([]);
	// mission
	const [missions, setMissions] = useState([]);
	const [missionReport, setMissionReport] = useState({});
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [itemEdit, setItemEdit] = useState({});

	// task
	const [tasksSolved, setTasksSolved] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [taskReport, setTaskReport] = useState({});
	const [editModalStatusTask, setEditModalStatusTask] = useState(false);
	const [taskEdit, setTaskEdit] = useState({});

	// subtask
	const [subtasks, setSubTasks] = useState([]);
	const [subTaskReport, setSubTaskReport] = useState({});
	const [editModalStatusSubTask, setEditModalStatusSubTask] = useState(false);
	const [subtaskEdit, setSubTaskEdit] = useState({});

	// select department
	const [departmentSelect, setDepartmentSelect] = useState(1);

	const columns = [
		{
			title: 'Tên mục tiêu',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`${demoPages.mucTieu.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian bắt đầu',
			id: 'startTime',
			key: 'startTime',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Thời gian kết thúc',
			id: 'endTime',
			key: 'endTime',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Giá trị KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI thực tế',
			id: 'currentKPI',
			key: 'currentKPI',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI đã hoàn thành',
			id: 'completeKPI',
			key: 'completeKPI',
			type: 'number',
			align: 'center',
		},
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<div className='d-flex align-items-center'>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Edit'
							onClick={() => handleOpenEditForm(item)}
						/>
					</div>,
					['admin'],
				),
		},
	];

	const columnTasks = [
		{
			title: 'Tên công việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`${demoPages.quanLyCongViec.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian dự kiến',
			id: 'estimateDate',
			key: 'estimateDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Giá trị KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI thực tế',
			id: 'currentKpi',
			key: 'currentKpi',
			type: 'number',
			render: (item) => <span>{item.currentKPI}</span>,
			align: 'center',
		},
		{
			title: 'Độ ưu tiên',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							[`border-${themeStatus}`],
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`Cấp ${item.priority}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'number',
			render: (item) => (
				<Button
					isLink
					color={formatColorStatus(item.status)}
					icon='Circle'
					className='text-nowrap'>
					{FORMAT_TASK_STATUS(item.status)}
				</Button>
			),
		},
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) =>
				verifyPermissionHOC(
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						isDisable={item.status === 4 || item.status === 7 || item.status === 3}
						onClick={() => handleOpenEditTaskForm(item)}
					/>,
					['admin'],
				),
		},
	];

	const columnSubTasks = [
		{
			title: 'Tên đầu việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`${demoPages.quanLyCongViec.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian dự kiến',
			id: 'estimateDate',
			key: 'estimateDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Giá trị KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
		},
		{
			title: 'Độ ưu tiên',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							[`border-${themeStatus}`],
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`Cấp ${item.priority}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'number',
			render: (item) => (
				<Button
					isLink
					color={formatColorStatus(item.status)}
					icon='Circle'
					className='text-nowrap'>
					{FORMAT_TASK_STATUS(item.status)}
				</Button>
			),
		},
		{
			title: '',
			id: 'action',
			key: 'action',
			render: (item) => (
				<Button
					isOutline={!darkModeStatus}
					color='success'
					isLight={darkModeStatus}
					className='text-nowrap mx-2'
					icon='Edit'
					isDisable={item.status === 4 || item.status === 7 || item.status === 3}
					onClick={() => handleOpenEditSubTaskForm(item)}
				/>
			),
		},
	];

	// all department
	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllDepartments();
			const result = await response.data;
			setDataDepartments(
				result
					.reverse()
					.concat({
						id: 1,
						name: 'Tất cả',
					})
					.reverse(),
			);
		};
		fetchData();
	}, []);

	// get all misisons
	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllMission();
			const result = await response.data;
			setMissions(result);
		};
		const fetchDataReport = async () => {
			const response = await getReportMisson();
			const result = await response.data;
			setMissionReport(result);
		};
		fetchData();
		fetchDataReport();
	}, []);

	// task resolved
	useEffect(() => {
		const fetchDataTaskSolved = async () => {
			const response = await getAllTasksByStatus(3);
			const result = await response.data;
			setTasksSolved(result);
		};
		fetchDataTaskSolved();
	}, []);

	// task by department
	useEffect(() => {
		const fetchDataTaskByDepartment = async () => {
			const response = await getAllTasks({ departmentId: departmentSelect });
			const result = await response.data;
			setTasks(result);
		};
		const fetchDataReportTaskByDepartment = async () => {
			const response = await getReportTask({ departmentId: departmentSelect });
			const result = await response.data;
			setTaskReport(result);
		};
		fetchDataTaskByDepartment();
		fetchDataReportTaskByDepartment();
	}, [departmentSelect]);

	// subtask
	useEffect(() => {
		const fetchDataSubtasks = async () => {
			const response = await getAllSubTasksByUser();
			const result = await response.data;
			setSubTasks(result);
		};
		const fetchDataSubtasksReport = async () => {
			const response = await getReportSubTask();
			const result = await response.data;
			setSubTaskReport(result);
		};
		fetchDataSubtasks();
		fetchDataSubtasksReport();
	}, []);

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

	// form mission modal
	const handleOpenEditForm = (item) => {
		setEditModalStatus(true);
		setItemEdit({ ...item });
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
	};

	const handleSubmitMissionForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				const result = await response.data;
				const newMissions = [...missions];
				setMissions(
					newMissions.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleCloseEditForm();
				handleShowToast(
					`Cập nhật mục tiêu!`,
					`mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				const result = await response.data;
				const newMissions = [...missions];
				newMissions.push(result);
				setMissions(newMissions);
				handleCloseEditForm();
				handleShowToast(`Thêm mục tiêu`, `mục tiêu ${result.name} được thêm thành công!`);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`Thêm mục tiêu`, `Thêm mục tiêu không thành công!`);
			}
		}
	};

	// form task modal
	const handleOpenEditTaskForm = (item) => {
		setEditModalStatusTask(true);
		setTaskEdit({ ...item });
	};

	const handleCloseEditTaskForm = () => {
		setEditModalStatusTask(false);
		setTaskEdit(null);
	};
	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				const newTasks = [...tasks];
				setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
				handleCloseEditForm();
				handleShowToast(
					`Cập nhật công việc!`,
					`Công việc ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`Cập nhật công việc`, `Cập nhật công việc không thành công!`);
			}
		} else {
			try {
				const response = await addNewTask({ ...data });
				const result = await response.data;
				const newTasks = [...tasks];
				newTasks.push(result);
				setTasks(newTasks);
				handleCloseEditForm();
				handleShowToast(`Thêm công việc`, `Công việc ${result.name} được thêm thành công!`);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`Thêm công việc`, `Thêm công việc không thành công!`);
			}
		}
	};

	// subtask form modal
	const handleOpenEditSubTaskForm = (item) => {
		setEditModalStatusSubTask(true);
		setSubTaskEdit({ ...item });
	};

	const handleCloseEditSubtaskForm = () => {
		setEditModalStatusSubTask(false);
		setSubTaskEdit(null);
	};
	const handleSubmitSubTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateSubtask(data);
				const result = await response.data;
				const newSubtasks = [...subtasks];
				setSubTasks(
					newSubtasks.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleCloseEditForm();
				handleShowToast(
					`Cập nhật đầu việc!`,
					`Đầu việc ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setSubTasks(subtasks);
				handleShowToast(`Cập nhật đầu việc`, `Cập nhật đầu việc không thành công!`);
			}
		} else {
			try {
				const response = await addNewSubtask({ ...data });
				const result = await response.data;
				const newSubtasks = [...subtasks];
				newSubtasks.push(result);
				setSubTasks(newSubtasks);
				handleCloseEditForm();
				handleShowToast(`Thêm đầu việc`, `Đầu việc ${result.name} được thêm thành công!`);
			} catch (error) {
				setSubTasks(subtasks);
				handleShowToast(`Thêm đầu việc`, `Thêm đầu việc không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid overflow-hidden'>
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<MissionChartReport data={missionReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê công việc theo phòng ban
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<CardActions>
											<Dropdown>
												<DropdownToggle hasIcon={false}>
													<Button
														color='primary'
														icon='Circle'
														className='text-nowrap'>
														{
															dataDepartments.filter(
																(item) =>
																	item.id === departmentSelect,
															)[0]?.name
														}
													</Button>
												</DropdownToggle>
												<DropdownMenu>
													{dataDepartments?.map((item) => (
														<DropdownItem
															key={item?.id}
															onClick={() =>
																setDepartmentSelect(item.id)
															}>
															<div>{item?.name}</div>
														</DropdownItem>
													))}
												</DropdownMenu>
											</Dropdown>
										</CardActions>,
										['admin'],
									)}
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={taskReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin', 'manager'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={subTaskReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager', 'user'],
					)}
				</div>
				{verifyPermissionHOC(
					<div className='row mt-4'>
						<div className='col-xxl-8'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh sách mục tiêu</CardLabel>
										</CardTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<CardActions>
											<Button
												color='info'
												icon='Plus'
												tag='button'
												onClick={() => handleOpenEditForm(null)}>
												Thêm mục tiêu
											</Button>
										</CardActions>,
										['admin'],
									)}
								</CardHeader>
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columns}
										data={missions}
									/>
								</div>
								{!missions?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										Không có mục tiêu!
									</Alert>
								)}
							</Card>
						</div>
						<div className='col-xxl-4'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='ContactSupport' iconColor='secondary'>
										<CardTitle tag='h4' className='h5'>
											Công việc chờ duyệt
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Chờ duyệt
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										{tasksSolved.map((task) => (
											<TaskSolved
												key={task.id}
												id={task.id}
												name={task.name}
												to={`${demoPages.quanLyCongViec.path}/${task.id}`}
												color='warning'
												departmentUser={`${task.departments[0]?.name} - ${task.users[0]?.name}`}
												value={task.progress}
											/>
										))}
									</div>
								</CardBody>
							</Card>
						</div>
					</div>,
					['admin'],
				)}
				<div className='row mt-4'>
					<div className='col-xxl-12 col-xl-12 h-100'>
						<Card className='h-100'>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Danh sách công việc theo phòng ban</CardLabel>
									</CardTitle>
								</CardLabel>
								{verifyPermissionHOC(
									<CardActions className='d-flex align-items-center'>
										<Button
											color='info'
											icon='Plus'
											tag='button'
											onClick={() => handleOpenEditTaskForm(null)}>
											Thêm công việc
										</Button>
										<Dropdown>
											<DropdownToggle hasIcon={false}>
												<Button
													color='primary'
													icon='Circle'
													className='text-nowrap'>
													{
														dataDepartments.filter(
															(item) => item.id === departmentSelect,
														)[0]?.name
													}
												</Button>
											</DropdownToggle>
											<DropdownMenu>
												{dataDepartments.map((item) => (
													<DropdownItem
														key={item?.id}
														onClick={() =>
															setDepartmentSelect(item.id)
														}>
														<div>{item?.name}</div>
													</DropdownItem>
												))}
											</DropdownMenu>
										</Dropdown>
									</CardActions>,
									['admin'],
								)}
							</CardHeader>
							<div className='p-4'>
								<TableCommon
									className='table table-modern mb-0'
									columns={columnTasks}
									data={tasks}
								/>
							</div>
							{!tasks?.length && (
								<Alert color='warning' isLight icon='Report' className='mt-3'>
									Không có công việc!
								</Alert>
							)}
						</Card>
					</div>
				</div>
				<div className='row mt-4'>
					<div className='col-xxl-12 col-xl-12 h-100'>
						<Card className='h-100'>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Đầu việc của tôi</CardLabel>
									</CardTitle>
								</CardLabel>
								{verifyPermissionHOC(
									<CardActions className='d-flex align-items-center'>
										<Button
											color='info'
											icon='Plus'
											tag='button'
											onClick={() => handleOpenEditSubTaskForm(null)}>
											Thêm đầu việc
										</Button>
									</CardActions>,
									['admin'],
								)}
							</CardHeader>
							<div className='p-4'>
								<TableCommon
									className='table table-modern mb-0'
									columns={columnSubTasks}
									data={subtasks}
								/>
							</div>
							{!tasks?.length && (
								<Alert color='warning' isLight icon='Report' className='mt-3'>
									Không có đầu việc!
								</Alert>
							)}
						</Card>
					</div>
				</div>
				<MissionFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitMissionForm}
					item={itemEdit}
				/>
				<TaskFormModal
					show={editModalStatusTask}
					onClose={handleCloseEditTaskForm}
					onSubmit={handleSubmitTaskForm}
					item={taskEdit}
					isShowMission={!taskEdit?.id}
				/>
				<TaskDetailForm
					show={editModalStatusSubTask}
					item={subtaskEdit}
					onClose={handleCloseEditSubtaskForm}
					onSubmit={handleSubmitSubTaskForm}
				/>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
