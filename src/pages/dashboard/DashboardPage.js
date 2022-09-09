import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { dashboardMenu, demoPages } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import useDarkMode from '../../hooks/useDarkMode';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Progress from '../../components/bootstrap/Progress';
import { getAllDepartments } from '../work-management/mission/services';
import { FORMAT_TASK_STATUS, formatColorStatus, formatColorPriority } from '../../utils/constants';
import Alert from '../../components/bootstrap/Alert';
import {
	getAllSubTasksByUser,
	getAllTasksByDepartment,
	getReportMisson,
	getReportSubTask,
	getReportSubTaskDepartment,
	getReportTask,
} from './services';
import MissionChartReport from './admin/MissionChartReport';
import TaskChartReport from './admin/TaskChartReport';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';

const DashboardPage = () => {
	const { darkModeStatus, themeStatus } = useDarkMode();
	const navigate = useNavigate();
	const handleOnClickToMissionListPage = useCallback(
		() => navigate(`../${demoPages.jobsPage.subMenu.mucTieu.path}`),
		[navigate],
	);
	// departments
	const [dataDepartments, setDataDepartments] = useState([]);
	// mission
	const [missionReport, setMissionReport] = useState({});

	// task
	const [tasks, setTasks] = useState([]);
	const [taskReport, setTaskReport] = useState({});

	// subtask
	const [subtasks, setSubTasks] = useState([]);
	const [subTaskReport, setSubTaskReport] = useState({});
	const [subTaskReportDepartment, setSubTaskReportDepartment] = useState({});

	// select department
	const [departmentSelect, setDepartmentSelect] = useState(1);

	const columnTasks = [
		{
			title: 'Tên công việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.nhiemVu.path}/${item.id}`}>
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
	];

	const columnSubTasks = [
		{
			title: 'Tên đầu việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.nhiemVu.path}/${item.id}`}>
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
		const fetchDataReport = async () => {
			const response = await getReportMisson();
			const result = await response.data;
			setMissionReport(result);
		};
		fetchDataReport();
	}, []);

	// task by department
	useEffect(() => {
		const fetchDataTaskByDepartment = async () => {
			const response = await getAllTasksByDepartment(departmentSelect, { type: 2 });
			const result = await response.data;
			setTasks(result);
		};
		const fetchDataReportTaskByDepartment = async () => {
			const response = await getReportTask({ departmentId: departmentSelect });
			const result = await response.data;
			setTaskReport(result);
		};
		fetchDataReportTaskByDepartment();
		fetchDataTaskByDepartment();
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
		const fetchDataSubtasksReportDepartment = async () => {
			const response = await getReportSubTaskDepartment();
			const result = await response.data;
			setSubTaskReportDepartment(result);
		};
		fetchDataSubtasks();
		fetchDataSubtasksReport();
		fetchDataSubtasksReportDepartment();
	}, []);

	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid overflow-hidden'>
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-8'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
									<CardActions>
										<Button
											icon='ArrowForwardIos'
											aria-label='Read More'
											hoverShadow='default'
											rounded={1}
											color={darkModeStatus ? 'dark' : null}
											onClick={handleOnClickToMissionListPage}
										/>
									</CardActions>
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
											Thống kê công việc
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
											Thống kê đầu việc của phòng
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={subTaskReportDepartment} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager'],
					)}
				</div>
				<div className='row mt-4'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc cá nhân
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
						['manager', 'admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-12'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc cá nhân
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
						['user'],
					)}
				</div>
				{verifyPermissionHOC(
					<>
						<div className='row mt-4'>
							<div className='col-xxl-12 col-xl-12 h-100'>
								<Card className='h-100'>
									<CardHeader>
										<CardLabel icon='Task' iconColor='danger'>
											<CardTitle>
												<CardLabel>
													Danh sách công việc đang thực hiện
												</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columnTasks}
											data={tasks}
										/>
									</div>
									{!tasks?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
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
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columnSubTasks}
											data={subtasks}
										/>
									</div>
									{!tasks?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Không có đầu việc!
										</Alert>
									)}
								</Card>
							</div>
						</div>
					</>,
					['user'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
