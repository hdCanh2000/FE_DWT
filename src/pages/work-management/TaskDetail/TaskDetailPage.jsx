// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../components/bootstrap/Dropdown';
import { updateSubtasks, getAllSubtasks } from './services';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardSubTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import TaskDetailForm from './TaskDetailForm/TaskDetailForm';
import ComfirmSubtask from './TaskDetailForm/ComfirmSubtask';
import useDarkMode from '../../../hooks/useDarkMode';

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
	// const [subtaskPending, setSubTaskPending] = useState({});
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Chờ xét duyệt', 'Đã hoàn thành', 'Xem xét / Bế tắc'],
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
							fontSize: '24px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 0,
							formatter(val) {
								return val;
							},
						},
						value: {
							show: true,
							fontSize: '16px',
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
			return { name: "Đang thực hiện", color: "primary" }
		}
		if (props === 1) {
			return { name: "Đã hoàn thành", color: "success" }
		}
		if (props === 2) {
			return { name: "Bế tắc", color: "danger" }
		}
		if (props === 3) {
			return { name: "Xem xét", color: "warning" }
		}
		return 'light'
	}

	function priority(props) {
		if (props === 1) {
			return "success"
		}
		if (props === 2) {
			return "primary"
		}
		if (props === 3) {
			return "danger"
		}
		if (props === 4) {
			return "warning"
		}
		if (props === 5) {
			return "warning"
		}
		return 'light'
	}
	React.useEffect(() => {
		const fetchSubtasks = async (id) => {
			const res = await getAllSubtasks(id);
			setTask(res.data);

		}
		fetchSubtasks(parseInt(params?.id, 10));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// React.useEffect(() => {
	// 	task?.subtasks?.map((item) => {
	// 		if (item.status === 2) {
	// 			setSubTaskPending({
	// 				...subtaskPending,
	// 				item,
	// 			})
	// 		}
	// 		return 0
	// 	})
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [task])
	React.useEffect(() => {
		setSubTask(task.subtasks)
	}, [task]);

	// Handle
	const handleOpenModal = (id, titles) => {
		setEditModalStatus(true);
		setIdEdit(id);
		setTitle(titles);
	}

	const handleDelete = async (idDelete) => {
		const newSubTasks = subtask.filter((item) => item.id !== idDelete);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, { subtasks: newSubTasks });
		const respose = await updateSubtasks(parseInt(params?.id, 10), newData);
		const result = await respose.data;
		setTask(result);
	}
	const handleOpenConfirm = (item) => {
		setDeletes({
			id: item.id,
			name: item.name
		});
		set0penConfirm(true);
	}
	const handleCloseComfirm = () => {
		setDeletes({});
		set0penConfirm(false);
	}
	// funtion caculator 

	// phần trăm hòan thành subtask
	const progressSubtask = (subtasks) => {
		const length = subtasks?.steps.length;
		let count = 0;
		subtasks?.steps.forEach(element => {
			if (element.status === 1) {
				count += 1
			}
		});
		return ((count / length).toFixed(2)) * 100;
	}
	// số đầu việc xem xét/ bế tắc của 1 task
	const totalFailSubtask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let total = 0;
		// eslint-disable-next-line consistent-return
		subtasks.forEach((item) => {
			if (item.status === 2 || item.status === 3) {
				total += 1;
			}
		});
		return total;
	}
	// phầm trăm số đầu việc xem xét / bế tắc trên task 
	const progressAllSubtask = (a, b) => {
		return ((a / b).toFixed(2)) * 100;
	}
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
	}
	// phần trăm hoàn thành task theo subtask
	const progressTaskBySubtask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		const total = totalSuccessSubtaskOfTask(tasks)
		const lengthSubtask = subtasks.length;
		return ((total / lengthSubtask).toFixed(2)) * 100;
	}
	// Số kpi đã được giao
	const totalKpiSubtask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let totalKpi = 0;
		subtasks.forEach((item) => {
			totalKpi += item.kpi_value;
		})
		return totalKpi;
	}
	// phầm trăm kpi đã được giao trên task
	const progressKpi = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const totalKpi = totalKpiSubtask(task)
		return ((totalKpi / tasks.kpi_value).toFixed(2)) * 100;
	}
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
	}
	// Số đầu việc đang thực hiện
	const subtasksDangThucHien = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		const leng = subtasks.length;
		return (leng - (totalPendingSubtaskOfTask(tasks) + totalSuccessSubtaskOfTask(tasks) + totalFailSubtask(tasks)))
	}
	React.useEffect(() => {
		setState({
			series: [
				subtasksDangThucHien(task),
				totalPendingSubtaskOfTask(task),
				totalSuccessSubtaskOfTask(task),
				totalFailSubtask(task)],
			options: chartOptions,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [task])
	const date = Date.now();
	console.log(date);
	return (
		<PageWrapper title={`${task?.name}`}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='display-4 fw-bold py-3'>{task?.name}</div>
					</div>
					<div className='col-lg-4'>
						<Card>
							<CardBody>
								<CardLabel icon='Stream' iconColor='success'>
									<CardTitle>Phòng ban</CardTitle>
								</CardLabel>
								<br />
								<div className='col-12'>
									<div className='d-flex align-items-center'>
										<div className='flex-shrink-0'>
											<Icon icon='LayoutTextWindow' size='3x' color='info' />
										</div>
										<div className='flex-grow-1 ms-3'>
											<div className='fw-bold fs-2 mb-0'>
												{task?.department?.name}
											</div>
										</div>
									</div>
								</div>
								<div className='col-12'>
									<div className='d-flex align-items-center'>
										<div className='flex-shrink-0'>
											<Icon icon='TextLeft' size='3x' color='info' />
										</div>
										<div className='flex-grow-1 ms-3'>
											{task?.departments_related?.map((item) => {
												return (
													<div key={item.id} className='fw-bold fs-5 mb-0'>
														{item.name}
													</div>
												)
											})}
										</div>
									</div>
								</div>
								<br />
								<CardLabel icon='Stream' iconColor='success'>
									<CardTitle>Nhân viên</CardTitle>
								</CardLabel>
								<br />
								<div className='row g-2'>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-shrink-0'>
												<Icon icon='LayoutTextWindow' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-2 mb-0'>
													{task?.user?.name}
												</div>
											</div>
										</div>
									</div>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-shrink-0'>
												<Icon icon='TextLeft' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												{task?.users_related?.map((item) => {
													return (
														<div key={item.id} className='fw-bold fs-5 mb-0'>
															{item.name}
														</div>
													)
												})}
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card style={{ height: '360px' }}>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle>Thông tin công việc</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className=' fs-5 fw-bold ms-3'>
										<span className='text-info fs-5 fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp;
										Tên công việc : {task?.name}
									</div>
									<br />
									<div className=' fs-5 fw-bold ms-3'>
										<span className='text-info fs-5 fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp;
										Mô tả : {task?.description}
									</div>
									<br />
									<div className=' fs-5 fw-bold ms-3'>
										<span className='text-info fs-5 fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp;
										Giá trị Kpi : {task?.kpi_value}
									</div>
									<br />
									<div className=' fs-5 fw-bold ms-3'>
										<span className='text-info fs-5 fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp;
										Ngày bắt đầu : {moment(task?.estimate_date).format('DD-MM-YYYY')}
									</div>
									<br />
									<div className=' fs-5 fw-bold ms-3'>
										<span className='text-info fs-5 fw-bold ms-3'>
											<Icon icon='TrendingFlat' />
										</span>
										&nbsp;
										Ngày kết thúc : {moment(task?.deadline_date).format('DD-MM-YYYY')}
									</div>
								</div>
							</CardBody>
						</Card>
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
										<Card
											className={`bg-l${darkModeStatus ? 'o25' : '25'
												}-primary bg-l${darkModeStatus ? 'o50' : '10'
												}-primary-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Activity' color='success' />&nbsp;
														Tiến độ công việc
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
															trên tổng số {task?.subtasks?.length} đầu việc .
														</div>
													</div>
												</div>
												<div className='row d-flex align-items-center pb-3'>
													<div className='col col-sm-5 text-start'>
														<div className='fw-bold fs-2 mb-10'>
															{task?.kpi_value}
														</div>
														<div className='text-muted'>
															KPI
														</div>
													</div>
													<div className='col col-sm-7'>
														<div className='text-muted'>
															{totalKpiSubtask(task)}
														</div>
														<div>
															<Progress isAutoColor value={progressKpi(task)} height={20} />
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className={`bg-l${darkModeStatus ? 'o25' : '25'
												}-danger bg-l${darkModeStatus ? 'o50' : '10'
												}-danger-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Lightning' color='danger' />&nbsp;
														Đầu việc bị huỷ/thất bại
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
															{progressAllSubtask(totalFailSubtask(task), task?.subtasks?.length)}%
															<span className='text-danger fs-5 fw-bold ms-3'>
																{totalFailSubtask(task)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {task?.subtasks?.length} đầu việc .
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className={`bg-l${darkModeStatus ? 'o25' : '25'
												}-warning bg-l${darkModeStatus ? 'o50' : '10'
												}-warning-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='ShowChart' color='danger' />&nbsp;
														Chỉ số key
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='row g-4 align-items-center'>
													{task?.keys?.map((item) => (
														<div className='col-xl-6' key={item.key_name}>
															<div
																className={classNames(
																	'd-flex align-items-center rounded-2 p-3',
																	{
																		'bg-l10-warning': !darkModeStatus,
																		'bg-lo25-warning': darkModeStatus,
																	},
																)}>
																<div className='flex-shrink-0'>
																	<Icon icon='DoneAll' size='3x' color='warning' />
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-3 mb-0'>{item.key_value}</div>
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
										<Card className='h-60'>
											<CardHeader>
												<CardLabel>
													<CardTitle>Thống kê công việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<Card
													className={`bg-l${darkModeStatus ? 'o25' : '25'
														}-success bg-l${darkModeStatus ? 'o50' : '10'
														}-success-hover transition-base rounded-2 mb-4`}
													shadow='sm' style={{ width: '90%', marginLeft: '5%' }}>
													<CardBody>
														<div className='row'>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{task?.subtasks?.length}
																</div>
																<div className='text-muted'>
																	Số công việc
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{totalSuccessSubtaskOfTask(task)}
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
																	{totalFailSubtask(task)}
																</div>
																<div className='text-muted'>
																	Bế tắc/ Xem xét
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
												<div className='row align-items-center'>
													<div className='col-xl-8 col-md-12'>
														<Chart
															series={state?.series}
															options={state?.options}
															type={state?.options?.chart?.type}
															height={state?.options?.chart?.height}
														/>
													</div>
													<div className='col-xl-4 col-md-12'>
														<div className='row'>
															<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
																<div className='d-flex align-items-center justify-content-center'>
																	<div className='p-4' style={{ background: '#6C5DD3' }} />
																	<span style={{ marginLeft: '1rem' }}>{subtasksDangThucHien(task)} đầu việc ({progressAllSubtask(subtasksDangThucHien(task), task?.subtasks?.length)}%)</span>
																</div>
															</div>
															<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
																<div className='d-flex align-items-center justify-content-center'>
																	<div className='p-4' style={{ background: '#FFA2C0' }} />
																	<span style={{ marginLeft: '1rem' }}>{totalPendingSubtaskOfTask(task)} đầu việc ({progressAllSubtask(totalPendingSubtaskOfTask(task), task?.subtasks?.length)}%)</span>
																</div>
															</div>
															<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
																<div className='d-flex align-items-center justify-content-center'>
																	<div className='p-4' style={{ background: '#46BCAA' }} />
																	<span style={{ marginLeft: '1rem' }}>{totalSuccessSubtaskOfTask(task)} đầu việc ({progressAllSubtask(totalSuccessSubtaskOfTask(task), task?.subtasks?.length)}%)</span>
																</div>
															</div>
															<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
																<div className='d-flex align-items-center justify-content-center'>
																	<div className='p-4' style={{ background: 'blue' }} />
																	<span style={{ marginLeft: '1rem' }}>{totalFailSubtask(task)} đầu việc ({progressAllSubtask(totalFailSubtask(task), task?.subtasks?.length)}%)</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<Card>
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
						<CardBody isScrollable style={{ height: '300px' }}>
							<div className='table-responsive'>
								<table className='table table-modern mb-0 align-middle' style={{ textAlign: 'center' }}>
									<thead>
										<tr>
											<th>Ngày tạo</th>
											<th>Tên đầu việc</th>
											<th>Độ ưu tiên</th>
											<th>Giá trị kpi</th>
											<th>Hạn hoàn thành</th>
											<th>Tiến độ công việc</th>
											<th>Trạng thái</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>
										{subtask ? '' : <tr style={{ textAlign: 'center' }}><td>Chưa có đầu việc nào</td></tr>}
										{subtask?.map((item) => (
											<tr key={item.id}>
												<td>
													<div className='d-flex align-items-center'>
														<span className='text-nowrap'>
															{moment(
																`${item.estimate_date} ${item.estimate_time}`,
															).format('DD-MM-YYYY, HH:mm')}
														</span>
													</div>
												</td>
												<td>
													<div>
														<div>{item.name}</div>
														<div className='small text-muted'>
															{item.departmnent?.name}
														</div>
													</div>
												</td>
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
															`bg-${priority(item.priority)}`,
														)}>
														<span className=''>{`Cấp ${item.priority}`}</span>
													</span>
												</td>
												<td>{item.kpi_value}</td>
												<td>
													{moment(
														`${item.deadline_date} ${item.deadline_time}`,
													).format('DD-MM-YYYY, HH:mm')}
												</td>
												<td>
													<Progress isAutoColor value={progressSubtask(item)} height={10} />
												</td>
												<td>
													<Icon
														icon='Circle'
														color={color(item.status).color} />
													{color(item.status).name}
												</td>
												<td>
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button icon='MoreHoriz' />
														</DropdownToggle>
														<DropdownMenu isAlignmentEnd>
															<DropdownItem>
																<Button icon='Delete' onClick={() => handleOpenConfirm(item)}>
																	Delete
																</Button>

															</DropdownItem>
															<DropdownItem>
																<Button icon='Edit' onClick={() => handleOpenModal(item.id, 'edit')}>
																	Edit
																</Button>
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>
					<Card>
						<CardHeader>
							<CardLabel icon='ContactSupport' iconColor='secondary'>
								<CardTitle tag='h4' className='h5'>
									Đầu việc chờ xác nhận
								</CardTitle>
								<CardSubTitle tag='h5' className='h6'>
									Người kiểm duyệt : {task?.user?.name}
								</CardSubTitle>
							</CardLabel>
						</CardHeader>
						<CardBody isScrollable style={{ height: '300px' }}>
							<div className='table-responsive'>
								<table className='table table-modern mb-0 align-middle' style={{ textAlign: 'center' }}>
									<thead>
										<tr>
											<th>Ngày nộp</th>
											<th>Lời nhắn</th>
											<th>Người yêu cầu xác nhận</th>
											<th>Tên đầu việc</th>
											<th>Thời gian làm</th>
											<th>KPI</th>
											<th>Trạng thái</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>
										{subtask ? '' : <tr style={{ textAlign: 'center' }}><td>Chưa có đầu việc nào</td></tr>}
										{subtask?.map((item) => (
											<tr key={item.id}>
												<td>
													<div className='d-flex align-items-center'>
														<span className='text-nowrap'>
															{moment(
																`${item.estimate_date} ${item.estimate_time}`,
															).format('DD-MM-YYYY, HH:mm')}
														</span>
													</div>
												</td>
												<td>{item.name}</td>
												<td>{item?.user?.name}</td>
												<td>{item.name}</td>
												<td>20h</td>
												<td>{item?.kpi_value}</td>
												<td>
													<Icon
														icon='Circle'
														color={color(item.status).color} />
													{color(item.status).name}
												</td>
												<td>
													<Button
														isOutline={!darkModeStatus}
														color='success'
														isLight={darkModeStatus}
														className='text-nowrap mx-2'
														icon='Edit'>
														Xác nhận
													</Button>
													<Button
														isOutline={!darkModeStatus}
														color='danger'
														isLight={darkModeStatus}
														className='text-nowrap mx-2 '
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
			</Page >
		</PageWrapper >
	);
};
export default TaskDetailPage;