// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import toast, { Toaster } from 'react-hot-toast';
import Dropdown, {
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from '../../../components/bootstrap/Dropdown';
import { updateSubtasks, getAllSubtasks } from './services';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { STATUS, FORMAT_TASK_STATUS, formatColorStatus } from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import TaskDetailForm from './TaskDetailForm/TaskDetailForm';
import ComfirmSubtask from './TaskDetailForm/ComfirmSubtask';
import useDarkMode from '../../../hooks/useDarkMode';
import './styleTaskDetail.scss';

const TaskDetailPage = () => {
	// State
	const [task, setTask] = useState({});
	const { darkModeStatus } = useDarkMode();
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [idEdit, setIdEdit] = useState(0);
	const [title, setTitle] = useState();
	const params = useParams();
	const [subtask, setSubTask] = React.useState();
	const [openConfirm, set0penConfirm] = React.useState(false);
	const [deletes, setDeletes] = React.useState({});
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: [
			'Đang thực hiện',
			'Chờ xét duyệt',
			'Đã hoàn thành',
			'Quá hạn / thất bại',
			'Từ chối',
		],
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
				expandOnClick: true,
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '16px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 0,
							formatter(val) {
								return val;
							},
						},
						value: {
							show: true,
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 16,
							formatter(val) {
								return val;
							},
						},
					},
				},
			},
		},
		legend: {
			show: true,
			position: 'bottom',
		},
	};
	const [state, setState] = React.useState({
		series: [0, 0, 0, 0],
		options: chartOptions,
	});
	// Data
	function color(props) {
		if (props === 0) {
			return { name: 'Đang thực hiện', color: 'primary' };
		}
		if (props === 1) {
			return { name: 'Đã hoàn thành', color: 'success' };
		}
		if (props === 2) {
			return { name: 'Chờ duyệt', color: 'danger' };
		}
		if (props === 3) {
			return { name: 'Quá hạn / thất bại', color: 'dark' };
		}
		if (props === 4) {
			return { name: 'Quá hạn / thất bại', color: 'warning' };
		}
		return 'light';
	}

	function priority(props) {
		if (props === 1) {
			return 'dark';
		}
		if (props === 2) {
			return 'success';
		}
		if (props === 3) {
			return 'primary';
		}
		if (props === 4) {
			return 'danger';
		}
		if (props === 5) {
			return 'warning';
		}
		return 'light';
	}
	React.useEffect(() => {
		const fetchSubtasks = async (id) => {
			const res = await getAllSubtasks(id);
			setTask(res.data);
		};
		fetchSubtasks(parseInt(params?.id, 10));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	React.useEffect(() => {
		setSubTask(task.subtasks);
	}, [task]);

	// Handle
	const handleOpenModal = (id, titles) => {
		setEditModalStatus(true);
		setIdEdit(id);
		setTitle(titles);
	};
	const handleDelete = async (idDelete) => {
		const newSubTasks = subtask.filter((item) => item.id !== idDelete);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
			current_kpi_value: totalKpiSubtask(newSubTasks),
		});
		const respose = await updateSubtasks(parseInt(params?.id, 10), newData);
		const result = await respose.data;
		setTask(result);
	};
	const handleOpenConfirm = (item) => {
		setDeletes({
			id: item.id,
			name: item.name,
		});
		set0penConfirm(true);
	};
	const handleCloseComfirm = () => {
		setDeletes({});
		set0penConfirm(false);
	};
	const handleStatus = async (newStatus, items) => {
		const newSubTasks = task.subtasks.map((item) => {
			return item.id === items.id
				? {
						...item,
						status: newStatus,
				  }
				: item;
		});
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
			current_kpi_value: totalKpiSubtask(newSubTasks),
		});
		try {
			const respose = await updateSubtasks(parseInt(params?.id, 10), newData).then(
				toast.success('Cập nhật trạng thái thành công !'),
			);
			const result = await respose.data;
			setTask(result);
		} catch (error) {
			toast.error('Cập nhạt trạng thái thất bại !');
		}
	};
	const handleUpdateStatus = async (statuss, data) => {
		const newSubTasks = task.subtasks.map((item) => {
			return item.id === data.id
				? {
						...item,
						status: statuss,
				  }
				: item;
		});
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
		});
		try {
			const respose = await updateSubtasks(parseInt(params?.id, 10), newData).then(
				toast.success('Thay đổi trạng thái thành công!'),
			);
			const result = await respose.data;
			setTask(result);
		} catch (error) {
			toast.error('Thay đổi trạng thái thất bại !');
		}
	};
	// funtion caculator

	// phần trăm hòan thành subtask
	const progressSubtask = (subtasks) => {
		const length = subtasks?.steps.length;
		let count = 0;
		subtasks?.steps.forEach((element) => {
			if (element.status === 1) {
				count += 1;
			}
		});
		return (count / length).toFixed(2) * 100;
	};
	// số đầu việc Quá hạn / thất bại của 1 task
	const totalFailSubtask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let total = 0;
		// eslint-disable-next-line consistent-return
		subtasks.forEach((item) => {
			if (item.status === 3) {
				total += 1;
			}
		});
		return total;
	};
	// phầm trăm số đầu việc xem xét / bế tắc trên task
	const progressAllSubtask = (a, b) => {
		return (a / b).toFixed(2) * 100;
	};
	// số đầu việc hoàn thành trên task
	const totalSuccessSubtaskOfTask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let total = 0;
		// eslint-disable-next-line consistent-return
		subtasks.forEach((item) => {
			if (item.status === 1) {
				total += 1;
			}
		});
		return total;
	};
	// phần trăm hoàn thành task theo subtask
	const progressTaskBySubtask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		const total = totalSuccessSubtaskOfTask(tasks);
		const lengthSubtask = subtasks.length;
		return (total / lengthSubtask).toFixed(2) * 100;
	};
	// Số kpi đã được giao
	const totalKpiSubtask = (newSubtask) => {
		if (_.isEmpty(newSubtask)) return 0;
		let totalKpi = 0;
		newSubtask.forEach((item) => {
			totalKpi += item.kpi_value;
		});
		return totalKpi;
	};

	// Số kpi được giao đã hoàn thành
	const totalKpiSubtaskSuccess = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let totalKpi = 0;
		subtasks.forEach((item) => {
			if (item.status === 1) {
				totalKpi += item.kpi_value;
			}
		});
		return totalKpi;
	};
	// phầm trăm kpi đã được giao trên task
	const progressKpi = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const totalKpi = totalKpiSubtaskSuccess(task);
		return (totalKpi / totalKpiSubtask(tasks?.subtasks)).toFixed(2) * 100;
	};
	// Số đầu đang chờ xét duyệt
	const totalPendingSubtaskOfTask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let total = 0;
		// eslint-disable-next-line consistent-return
		subtasks.forEach((item) => {
			if (item.status === 2) {
				total += 1;
			}
		});
		return total;
	};
	// Số đầu việc đang thực hiện
	const subtasksDangThucHien = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		let total = 0;
		tasks?.subtasks?.forEach((item) => {
			if (item?.status === 0) {
				total += 1;
			}
		});
		return total;
	};
	React.useEffect(() => {
		setState({
			series: [
				subtasksDangThucHien(task),
				totalPendingSubtaskOfTask(task),
				totalSuccessSubtaskOfTask(task),
				totalFailSubtask(task),
			],
			options: chartOptions,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task]);
	return (
		<PageWrapper title={`${task?.name}`}>
			<Toaster />
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='display-4 fw-bold py-3'>{task?.name}</div>
					</div>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary'>
							<CardHeader>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Tổng kết
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-5'>
										{/* Tiến độ công việc */}
										<Card
											className={`bg-l${
												darkModeStatus ? 'o25' : '25'
											}-primary bg-l${
												darkModeStatus ? 'o50' : '10'
											}-primary-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Activity' color='success' />
														&nbsp; Tiến độ công việc
														<div
															className='text-muted'
															style={{
																fontSize: '12px',
																marginLeft: '1 vw',
															}}>
															&emsp;&emsp;&ensp;
															{FORMAT_TASK_STATUS(task.status)}
														</div>
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='d-flex align-items-center pb-3'>
													<div className='flex-shrink-0'>
														<Icon
															icon='EmojiEmotions'
															size='4x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{progressTaskBySubtask(task)}%
															<span className='text-info fs-5 fw-bold ms-3'>
																{totalSuccessSubtaskOfTask(task)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {task?.subtasks?.length}{' '}
															đầu việc .
														</div>
													</div>
												</div>
												<div className='row d-flex align-items-center pb-3'>
													<div className='col col-sm-5 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{task?.kpi_value}
														</div>
														<div className='text-muted'>
															KPI được giao
														</div>
														<div className='fw-bold fs-4 mb-10'>
															{totalKpiSubtask(task?.subtasks)}
														</div>
														<div className='text-muted'>
															KPI Thực tế
														</div>
													</div>
													<div className='col col-sm-7'>
														<div className='fw-bold fs-4 mb-10'>
															{totalKpiSubtaskSuccess(task)}/
															{totalKpiSubtask(task?.subtasks)}
														</div>
														<div className='text-muted'>
															Kpi đã hoàn thành
														</div>
														<div>
															<Progress
																isAutoColor
																value={progressKpi(task)}
																height={20}
															/>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										{/* Đầu việc bị hủy / thất bại */}
										<Card
											className={`bg-l${
												darkModeStatus ? 'o25' : '25'
											}-danger bg-l${
												darkModeStatus ? 'o50' : '10'
											}-danger-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Lightning' color='danger' />
														&nbsp; Đầu việc bị huỷ/thất bại
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='d-flex align-items-center pb-3'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Healing'
															size='4x'
															color='danger'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{progressAllSubtask(
																totalFailSubtask(task),
																task?.subtasks?.length,
															)}
															%
															<span className='text-danger fs-5 fw-bold ms-3'>
																{totalFailSubtask(task)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {task?.subtasks?.length}{' '}
															đầu việc .
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										{/* Chỉ số key */}
										<Card
											className={`bg-l${
												darkModeStatus ? 'o25' : '25'
											}-warning bg-l${
												darkModeStatus ? 'o50' : '10'
											}-warning-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='ShowChart' color='danger' />
														&nbsp; Chỉ số key
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='row g-4 align-items-center'>
													{task?.keys?.map((item) => (
														<div
															className='col-xl-6'
															key={item.key_name}>
															<div
																className={classNames(
																	'd-flex align-items-center rounded-2 p-3',
																	{
																		'bg-l10-warning':
																			!darkModeStatus,
																		'bg-lo25-warning':
																			darkModeStatus,
																	},
																)}>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='DoneAll'
																		size='3x'
																		color='warning'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-5 mb-0'>
																		{item.key_value}
																	</div>
																	<div className='text-muted mt-n2 truncate-line-1'>
																		{item.key_name}
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-md-7'>
										{/* Thống kê công việc */}
										<Card className='h-60'>
											<CardHeader>
												<CardLabel>
													<CardTitle>Thống kê công việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<Card
													className={`bg-l${
														darkModeStatus ? 'o25' : '25'
													}-success bg-l${
														darkModeStatus ? 'o50' : '10'
													}-success-hover transition-base rounded-2 mb-4`}
													shadow='sm'
													style={{ width: '90%', marginLeft: '5%' }}>
													<CardBody>
														<div className='row'>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{task?.subtasks?.length}
																</div>
																<div className='text-muted'>
																	Số đầu việc
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{totalSuccessSubtaskOfTask(
																		task,
																	)}
																</div>
																<div className='text-muted'>
																	Đã hoàn thành
																</div>
															</div>
														</div>
														<div className='row'>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{subtasksDangThucHien(task)}
																</div>
																<div className='text-muted'>
																	Đang thực hiện
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{totalPendingSubtaskOfTask(
																		task,
																	)}
																</div>
																<div className='text-muted'>
																	Chờ duyệt
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
												<div className='row align-items-center'>
													<div className='col-xl-12 col-md-12'>
														<Chart
															series={state?.series}
															options={state?.options}
															type={state?.options?.chart?.type}
															height={state?.options?.chart?.height}
														/>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-4'>
						{/* Phòng ban */}
						<Card style={{ height: '430px' }}>
							<CardBody style={{ paddingTop: '5vh', paddingLeft: '2vw' }}>
								<CardLabel icon='LayoutTextWindow' iconColor='info'>
									<CardTitle>Chịu trách nhiệm chính</CardTitle>
								</CardLabel>
								<br />
								<div className='col-12 ms-5'>
									<div className='d-flex align-items-center'>
										<div className='flex-shrink-0'>
											<Icon icon='Award' size='2x' color='info' />
										</div>
										<div className='ms-2'>
											<div className='flex-grow-1 fs-6 fw-bold'>
												{task?.department?.name}
											</div>
											<div className='text-muted'>{task?.user?.name}</div>
										</div>
									</div>
								</div>
								<br />
								<CardLabel icon='JustifyLeft' iconColor='info'>
									<CardTitle>Có liên quan</CardTitle>
								</CardLabel>
								<br />
								<div className='col-12 ms-5'>
									<div>
										<div className='flex-grow-1 fs-6 fw-bold'>Phòng ban</div>
										{task?.departments_related?.map((item) => {
											return (
												<div
													className='d-flex align-items-center'
													style={{ paddingBottom: '10px' }}
													key={item?.name}>
													<div className='flex-shrink-0'>
														<Icon
															icon='ArrowRightShort'
															size='2x'
															color='info'
														/>
													</div>
													<div className='ms-2'>
														<div className='text-muted'>
															{item?.name}
														</div>
													</div>
												</div>
											);
										})}
									</div>
									<div style={{ marginBottom: '10%' }}>
										<div className='flex-grow-1 fs-6 fw-bold'>Nhân viên</div>
										{task?.users_related?.map((item) => {
											return (
												<div
													className='d-flex align-items-center'
													style={{ paddingBottom: '10px' }}
													key={item?.name}>
													<div className='flex-shrink-0'>
														<Icon
															icon='ArrowRightShort'
															size='2x'
															color='info'
														/>
													</div>
													<div className='ms-2'>
														<div className='text-muted'>
															{item?.name}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</CardBody>
						</Card>
						{/* Thông tin công việc */}
						<Card style={{ height: '360px' }}>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle>Thông tin công việc</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row fs-6'>
									<div className=' fw-bold ms-3'>
										<span className='text-info fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp; Tên công việc : {task?.name}
									</div>
									<br />
									<div className=' fw-bold ms-3'>
										<span className='text-info fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp; Mô tả : {task?.description}
									</div>
									<br />
									<div className=' fw-bold ms-3'>
										<span className='text-info fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp; Giá trị Kpi : {task?.kpi_value}
									</div>
									<br />
									<div className='fw-bold ms-3'>
										<span className='text-info fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp; Ngày bắt đầu :{' '}
										{moment(task?.estimate_date).format('DD-MM-YYYY')}
									</div>
									<br />
									<div className=' fw-bold ms-3'>
										<span className='text-info fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp; Ngày kết thúc :{' '}
										{moment(task?.deadline_date).format('DD-MM-YYYY')}
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					{/* Tổng kết */}
					<Card style={{ width: '98.6%', marginLeft: '0.7%' }}>
						<Tabs defaultActiveKey='DetailSubtask' id='uncontrolled-tab-example'>
							<Tab
								eventKey='DetailSubtask'
								title='Danh sách đầu việc'
								className='mb-3'>
								{/* Danh sách đầu việc */}
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh sách đầu việc</CardLabel>
										</CardTitle>
									</CardLabel>
									<Button
										color='success'
										size='lg'
										isLight
										className='w-30 h-100'
										onClick={() => handleOpenModal(0, 'add')}
										icon='AddCircle'>
										Thêm đầu việc
									</Button>
								</CardHeader>
								<CardBody
									isScrollable
									style={{ textAlign: 'center', minHeight: '60vh' }}>
									<div>
										<table className='table table-modern mb-0'>
											<thead>
												<tr>
													<th>STT</th>
													<th>Tên đầu việc</th>
													<th>Thời gian dự kiến</th>
													<th>Hạn hoàn thành</th>
													<th>Tiến độ đầu việc</th>
													<th>Giá trị kpi</th>
													<th>Độ ưu tiên</th>
													<th>Trạng thái</th>
													<th>Hành động</th>
												</tr>
											</thead>
											<tbody>
												{subtask ? (
													''
												) : (
													<tr style={{ textAlign: 'center' }}>
														<td>Chưa có đầu việc nào</td>
													</tr>
												)}
												{subtask
													?.filter(
														(item) =>
															item.status === 0 ||
															item.status === 1 ||
															item.status === 4,
													)
													.map((item, index) => (
														<tr key={item.id}>
															<td>{index + 1}</td>
															<td>
																<div>
																	<div>
																		<Link
																			className='text-underline'
																			to={`/quan-ly-cong-viec/cong-viec-${task?.id}/dau-viec/${item?.id}`}>
																			{item.name}
																		</Link>
																	</div>
																	<div className='small text-muted'>
																		{item.departmnent?.name}
																	</div>
																</div>
															</td>
															<td>
																{moment(
																	`${item.estimate_date} ${item.estimate_time}`,
																).format('DD-MM-YYYY, HH:mm')}
															</td>
															<td>
																{moment(
																	`${item.deadline_date} ${item.deadline_time}`,
																).format('DD-MM-YYYY, HH:mm')}
															</td>
															<td>
																{progressSubtask(item)} %
																<Progress
																	isAutoColor
																	value={progressSubtask(item)}
																	height={10}
																/>
															</td>
															<td>{item.kpi_value}</td>
															<td>
																<span
																	style={{
																		paddingRight: '1rem',
																		paddingLeft: '1rem',
																	}}
																	className={classNames(
																		'badge',
																		'border border-2',
																		// [`border-${themeStatus}`],
																		'bg-success',
																		'pt-2 pb-2 me-2',
																		`bg-${priority(
																			item.priority,
																		)}`,
																	)}>
																	<span className=''>{`Cấp ${item.priority}`}</span>
																</span>
															</td>
															<td>
																<Dropdown>
																	<DropdownToggle hasIcon={false}>
																		<Button
																			isLink
																			color={formatColorStatus(
																				item.status,
																			)}
																			icon='Circle'
																			className='text-nowrap'>
																			{FORMAT_TASK_STATUS(
																				item.status,
																			)}
																		</Button>
																	</DropdownToggle>
																	<DropdownMenu>
																		{Object.keys(STATUS).map(
																			(key) => (
																				<DropdownItem
																					key={key}
																					onClick={() =>
																						handleUpdateStatus(
																							STATUS[
																								key
																							].value,
																							item,
																						)
																					}>
																					<div>
																						<Icon
																							icon='Circle'
																							color={
																								STATUS[
																									key
																								]
																									.color
																							}
																						/>
																						{
																							STATUS[
																								key
																							].name
																						}
																					</div>
																				</DropdownItem>
																			),
																		)}
																	</DropdownMenu>
																</Dropdown>
															</td>
															<td style={{ width: '270px' }}>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	icon='Edit'
																	onClick={() =>
																		handleOpenModal(
																			item.id,
																			'edit',
																		)
																	}>
																	Sửa
																</Button>
																<Button
																	isOutline={!darkModeStatus}
																	color='danger'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2 '
																	icon='Delete'
																	onClick={() =>
																		handleOpenConfirm(item)
																	}>
																	Xóa
																</Button>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</CardBody>
							</Tab>
							<Tab eventKey='SubmitSubtask' title='Đầu việc chờ xác nhận'>
								<CardHeader>
									<CardLabel icon='ContactSupport' iconColor='secondary'>
										<CardTitle tag='h4' className='h5'>
											Đầu việc chờ xác nhận
										</CardTitle>
										{/* <CardSubTitle tag='h5' className='h6'>
											Người kiểm duyệt : {task?.user?.name}
										</CardSubTitle> */}
									</CardLabel>
								</CardHeader>
								<CardBody
									isScrollable
									style={{ textAlign: 'center', minHeight: '60vh' }}>
									<div>
										<table className='table table-modern mb-0 align-middle'>
											<thead>
												<tr>
													<th>Ngày dự kiến</th>
													<th>Lời nhắn</th>
													<th>Người yêu cầu xác nhận</th>
													<th>Tên đầu việc</th>
													<th>Hạn nộp</th>
													<th>KPI</th>
													<th>Trạng thái</th>
													<th>Hành động</th>
												</tr>
											</thead>
											<tbody>
												{subtask ? (
													''
												) : (
													<tr style={{ textAlign: 'center' }}>
														<td>Chưa có đầu việc nào</td>
													</tr>
												)}
												{subtask
													?.filter(
														(item) =>
															item.status === 2 || item.status === 3,
													)
													.map((item) => (
														<tr key={item.id}>
															<td>
																<div className='d-flex align-items-center'>
																	<span className='text-nowrap'>
																		{moment(
																			`${item.estimate_date} ${item.estimate_time}`,
																		).format(
																			'DD-MM-YYYY, HH:mm',
																		)}
																	</span>
																</div>
															</td>
															<td>{item.name}</td>
															<td>{item?.user?.name}</td>
															<td>{item.name}</td>
															<td>
																<div className='d-flex align-items-center'>
																	<span className='text-nowrap'>
																		{moment(
																			`${item.deadline_date} ${item.deadline_time}`,
																		).format(
																			'DD-MM-YYYY, HH:mm',
																		)}
																	</span>
																</div>
															</td>
															<td>{item?.kpi_value}</td>
															<td>
																<Icon
																	icon='Circle'
																	color={color(item.status).color}
																/>
																{color(item.status).name}
															</td>
															<td style={{ width: '270px' }}>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	onClick={() =>
																		handleStatus(1, item)
																	}
																	icon='Edit'>
																	Xác nhận
																</Button>
																<Button
																	isOutline={!darkModeStatus}
																	color='danger'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2 '
																	onClick={() =>
																		handleStatus(4, item)
																	}
																	icon='Trash'>
																	Từ chối
																</Button>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</CardBody>
							</Tab>
						</Tabs>
					</Card>
				</div>
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseComfirm}
					onConfirm={() => handleDelete(deletes?.id)}
					title='Xoá Đầu việc'
					content={`Xác nhận xoá đầu việc <strong>${deletes?.name}</strong> ?`}
				/>
				<TaskDetailForm
					title={title}
					setTask={setTask}
					task={task}
					setEditModalStatus={setEditModalStatus}
					editModalStatus={editModalStatus}
					id={parseInt(params?.id, 10)}
					idEdit={idEdit}
				/>
			</Page>
		</PageWrapper>
	);
};
export default TaskDetailPage;
