import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';
import COLORS from '../../../common/data/enumColors';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Board from './board/Board';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Toasts from '../../../components/bootstrap/Toasts';
import { FORMAT_TASK_STATUS } from '../../../utils/constants';
import { addStepIntoSubtask, getTaskById, updateStatusPendingSubtask } from './services';
import {
	calcKPICompleteOfSubtask,
	calcProgressSubtask,
	calcTotalStepByStatus,
	calcTotalStepOfSubTask,
} from '../../../utils/function';
import Progress from '../../../components/bootstrap/Progress';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import Chart from '../../../components/extras/Chart';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';
import { updateSubtasks } from '../TaskDetail/services';
import ComfirmSubtask from '../TaskDetail/TaskDetailForm/ComfirmSubtask';
import Timeline, { TimelineItem } from '../../../components/extras/Timeline';

const chartOptions = {
	chart: {
		type: 'donut',
		height: 350,
	},
	stroke: {
		width: 0,
	},
	labels: ['Đang thực hiện', 'Dự kiến', 'Đã hoàn thành', 'Quá hạn/Huỷ'],
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

const SubTaskPage = () => {
	const [boardData, setBoardData] = useState([
		{
			id: 1,
			title: 'Dự kiến',
			color: COLORS.INFO.name,
			icon: 'DoneOutline',
			status: 2,
			cards: [],
		},
		{
			id: 2,
			title: 'Đang thực hiện',
			color: COLORS.PRIMARY.name,
			icon: 'PendingActions',
			status: 0,
			cards: [],
		},
		{
			id: 3,
			title: 'Đã hoàn thành',
			color: COLORS.SUCCESS.name,
			icon: 'DoneAll',
			status: 1,
			cards: [],
		},
		{
			id: 4,
			title: 'Quá hạn/Huỷ',
			color: COLORS.DARK.name,
			icon: 'RateReview',
			status: 3,
			cards: [],
		},
	]);
	const [subtask, setSubtask] = useState({});
	const [task, setTask] = useState({});
	const { addToast } = useToasts();
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const params = useParams(); // taskid, id
	const { taskid, id } = params;
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirm, set0penConfirm] = React.useState(false);
	useEffect(() => {
		async function fetchDataTaskById() {
			const reponse = await getTaskById(taskid);
			const result = await reponse.data;
			const subtaskRes = result?.subtasks.filter((item) => item.id === parseInt(id, 10))[0];
			setTask(result);
			setSubtask(subtaskRes);
			setBoardData(
				boardData.map((item) => {
					return {
						...item,
						cards: subtaskRes?.steps
							?.filter((step) => step?.status === item?.status)
							?.map((step) => {
								if (step?.status === item?.status) {
									return {
										...step,
										id: step.id,
										name: step.name,
										description: step.description,
										label: '5 day left',
									};
								}
								return {};
							}),
					};
				}),
			);
		}
		fetchDataTaskById();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskid, id]);

	// show toast
	const handleShowToast = (title, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={title} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleAddStepIntoSubtask = async (data) => {
		try {
			const taskClone = { ...task };
			taskClone.subtasks = task.subtasks.map((item) =>
				item.id === data.id ? { ...data } : item,
			);
			const response = await addStepIntoSubtask(taskClone);
			const result = await response.data;
			setTask(result);
			const subtaskRes = result?.subtasks.filter((item) => item.id === parseInt(id, 10))[0];
			setSubtask(subtaskRes);
			setBoardData(
				boardData.map((item) => {
					return {
						...item,
						cards: subtaskRes?.steps
							?.filter((step) => step?.status === item?.status)
							?.map((step) => {
								if (step?.status === item?.status) {
									return {
										...step,
										id: step.id,
										name: step.name,
										description: step.description,
										label: '5 day left',
									};
								}
								return {};
							}),
					};
				}),
			);
		} catch (error) {
			setTask(task);
		}
	};

	const handleClickChangeStatusPending = async (data) => {
		if (data.status === 1) {
			handleShowToast(
				`Báo đầu việc chờ duyệt!`,
				`Thao tác không thành công. Đầu việc ${data.name} đã hoàn thành!`,
				'Error',
				'danger',
			);
		} else if (data.status === 2) {
			handleShowToast(
				`Báo đầu việc chờ duyệt!`,
				`Thao tác không thành công. Đầu việc ${data.name} đang chờ duyệt!`,
				'Error',
				'danger',
			);
		} else {
			try {
				const taskClone = { ...task };
				const subtaskClone = { ...data };
				subtaskClone.status = 2;
				const subtaskSubmit = taskClone?.subtasks?.map((item) =>
					item.id === data.id ? { ...subtaskClone } : item,
				);
				const taskSubmit = { ...taskClone };
				taskSubmit.subtasks = subtaskSubmit;
				const response = await updateStatusPendingSubtask(taskSubmit);
				const result = await response.data;
				const subtaskRes = result?.subtasks.filter(
					(item) => item.id === parseInt(id, 10),
				)[0];
				setTask(result);
				setSubtask(subtaskRes);
				handleShowToast(
					`Báo đầu việc chờ duyệt!`,
					`Báo đầu việc ${subtaskRes.name} thành công!`,
				);
			} catch (error) {
				setSubtask(subtask);
			}
		}
	};
	// Số kpi của subtask đã được giao
	const totalKpiSubtask = (newSubtask) => {
		if (_.isEmpty(newSubtask)) return 0;
		let totalKpi = 0;
		newSubtask.forEach((item) => {
			totalKpi += item.kpi_value;
		});
		return totalKpi;
	};

	// edit task
	const handleEditTask = () => {
		setEditModalStatus(true);
	};
	const handleOpenConfirm = () => {
		set0penConfirm(true);
	};
	const handleCloseConfirm = () => {
		set0penConfirm(false);
	};
	const handleDeleteSubTask = async (subtasks) => {
		const newSubTasks = task?.subtasks?.filter((item) => item.id !== subtasks?.id);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
			current_kpi_value: totalKpiSubtask(newSubTasks),
		});
		try {
			const respose = await updateSubtasks(task?.id, newData);
			const result = await respose.data;
			setTask(result);
			navigate(`/quan-ly-cong-viec/cong-viec/${task?.id}`);
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu thành công!`);
		} catch (error) {
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu thất bại!`);
		}
	};
	return (
		<PageWrapper title={subtask?.name}>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Quay lại
					</Button>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid' className='overflow-hidden'>
				<div className='col-12'>
					<div className='d-flex justify-content-between align-items-center'>
						<div className='display-4 fw-bold py-3'>{subtask?.name}</div>
						<div>
							<Button
								isOutline={!darkModeStatus}
								color='primary'
								isLight={darkModeStatus}
								className='text-nowrap mx-2'
								icon='Edit'
								onClick={handleEditTask}>
								Sửa
							</Button>
							<Button
								isOutline={!darkModeStatus}
								color='danger'
								isLight={darkModeStatus}
								className='text-nowrap mx-2'
								icon='Trash'
								onClick={handleOpenConfirm}>
								Xoá
							</Button>
						</div>
					</div>
				</div>
				<div className='row mb-4'>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary h-100 mb-4 pb-4'>
							<CardHeader className='py-2'>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Tổng kết
									</CardTitle>
								</CardLabel>
								<Button
									color='danger'
									icon='Report'
									isLight
									onClick={() => handleClickChangeStatusPending(subtask)}>
									Xác nhận hoàn thành
								</Button>
							</CardHeader>
							<CardBody className='py-2'>
								<div className='row g-4'>
									<div className='col-md-5'>
										<Card
											className='bg-l25-primary transition-base rounded-2 mb-4'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='Activity' iconColor='primary'>
													<CardTitle tag='h4' className='h5'>
														Thông tin đầu việc
													</CardTitle>
													<CardSubTitle tag='h4' className='h5'>
														{FORMAT_TASK_STATUS(subtask?.status)}
													</CardSubTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col-12 text-start'>
														<div className='fw-bold fs-3 mb-0'>
															{calcProgressSubtask(subtask)}%
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															trên tổng số{' '}
															{calcTotalStepOfSubTask(subtask)} bước
														</div>
														<Progress
															isAutoColor
															value={calcProgressSubtask(subtask)}
															height={10}
															size='lg'
														/>
													</div>
												</div>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col col-sm-6 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{subtask.kpi_value}
														</div>
														<div className='text-muted'>
															Giá trị KPI
														</div>
													</div>
													<div className='col col-sm-6 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{calcKPICompleteOfSubtask(subtask)}
														</div>
														<div className='text-muted'>
															KPI thực tế đạt được
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className='mb-4'
											shadow='lg'
											style={{ minHeight: 250 }}>
											<CardBody
												isScrollable
												className='py-2'
												style={{ overFlowX: 'hidden' }}>
												<CardLabel
													className='mt-2'
													icon='LayoutTextWindow'
													iconColor='info'>
													<CardTitle>Phòng ban phụ trách</CardTitle>
												</CardLabel>
												<div className='row g-5'>
													<div className='col-12 ps-5'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='TrendingFlat'
																	size='2x'
																	color='info'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{subtask?.department?.name}
																</div>
															</div>
														</div>
													</div>
												</div>
												<CardLabel
													className='mt-4'
													icon='LayoutTextWindow'
													iconColor='info'>
													<CardTitle>Phòng ban liên quan</CardTitle>
												</CardLabel>
												<div className='row g-5'>
													<div className='col-12 ps-5'>
														{subtask?.departments_related?.map(
															(department) => (
																<div className='d-flex align-items-center mb-2'>
																	<div className='flex-shrink-0'>
																		<Icon
																			icon='TrendingFlat'
																			size='2x'
																			color='info'
																		/>
																	</div>
																	<div className='flex-grow-1 ms-3'>
																		<div className='fw-bold fs-5 mb-0'>
																			{department?.name}
																		</div>
																	</div>
																</div>
															),
														)}
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className='mb-4'
											shadow='lg'
											style={{ minHeight: 250 }}>
											<CardBody isScrollable className='py-2'>
												<CardLabel
													className='mt-2'
													icon='PersonCircle'
													iconColor='info'>
													<CardTitle>Nhân viên phụ trách</CardTitle>
												</CardLabel>
												<div className='row g-5'>
													<div className='col-12 ps-5'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='TrendingFlat'
																	size='2x'
																	color='info'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{subtask?.user?.name}
																</div>
															</div>
														</div>
													</div>
												</div>
												<CardLabel
													className='mt-4'
													icon='PersonCircle'
													iconColor='info'>
													<CardTitle>Nhân viên liên quan</CardTitle>
												</CardLabel>
												<div className='row g-5'>
													<div className='col-12 ps-5'>
														{subtask?.users_related?.map((user) => (
															<div className='d-flex align-items-center mb-2'>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='TrendingFlat'
																		size='2x'
																		color='info'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-5 mb-0'>
																		{user?.name}
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-md-7'>
										<Card className='h-100'>
											<CardHeader className='py-2'>
												<CardLabel icon='DoubleArrow' iconColor='success'>
													<CardTitle>Thống kê đầu việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												<Card
													className={`bg-l${
														darkModeStatus ? 'o25' : '25'
													}-success bg-l${
														darkModeStatus ? 'o50' : '10'
													}-success-hover transition-base rounded-2 mb-4`}
													shadow='sm'>
													<CardBody>
														<div className='row'>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{calcTotalStepOfSubTask(
																		subtask,
																	)}
																</div>
																<div className='text-muted'>
																	Tổng số bước
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{calcTotalStepByStatus(
																		subtask,
																		1,
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
																	{calcTotalStepByStatus(
																		subtask,
																		0,
																	)}
																</div>
																<div className='text-muted'>
																	Đang thực hiện
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{calcTotalStepByStatus(
																		subtask,
																		3,
																	)}
																</div>
																<div className='text-muted'>
																	Quá hạn/Huỷ
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
												{subtask?.steps?.length > 0 ? (
													<div className='row align-items-center'>
														<div className='col-xl-12 col-md-12'>
															<Chart
																series={[
																	calcTotalStepByStatus(
																		subtask,
																		0,
																	),
																	calcTotalStepByStatus(
																		subtask,
																		2,
																	),
																	calcTotalStepByStatus(
																		subtask,
																		1,
																	),
																	calcTotalStepByStatus(
																		subtask,
																		3,
																	),
																]}
																options={chartOptions}
																type={chartOptions.chart.type}
																height={chartOptions.chart.height}
															/>
														</div>
													</div>
												) : null}
											</CardBody>
										</Card>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-4'>
						<Card className='mb-4 h-100 shadow-3d-info'>
							<Card className='mb-4' shadow='lg' style={{ minHeight: 250 }}>
								<CardHeader className='py-2'>
									<CardLabel icon='Stream' iconColor='warning'>
										<CardTitle>Thông tin đầu việc</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='py-2'>
									<div className='row g-2'>
										<div className='col-12 mb-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='TrendingFlat'
														size='2x'
														color='danger'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{subtask.description}
													</div>
												</div>
											</div>
										</div>
										<div className='col-12 mb-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='TrendingFlat'
														size='2x'
														color='danger'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														<span className='me-2'>
															Thời gian dự kiến hoàn thành:
														</span>
														{moment(
															`${subtask?.estimate_date} ${subtask.estimate_time}`,
														).format('DD-MM-YYYY, HH:mm')}
													</div>
												</div>
											</div>
										</div>
										<div className='col-12 mb-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='TrendingFlat'
														size='2x'
														color='danger'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														<span className='me-2'>
															Hạn thời gian hoàn thành:
														</span>
														{moment(
															`${subtask?.deadline_date} ${subtask.deadline_time}`,
														).format('DD-MM-YYYY, HH:mm')}
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
							{/* Chỉ số key */}
							<Card
								className='bg-l50-warning transition-base w-100 rounded-2 mb-4'
								shadow='sm'
								style={{ minHeight: 300 }}>
								<CardHeader className='bg-transparent py-2'>
									<CardLabel>
										<CardTitle tag='h4' className='h5'>
											<Icon icon='ShowChart' color='danger' />
											&nbsp; Chỉ số key
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='pt-0 pb-4'>
									<div className='row g-4 align-items-center justify-content-center'>
										{subtask?.keys?.map((item, index) => (
											// eslint-disable-next-line react/no-array-index-key
											<div className='col-xl-12 mb-0' key={index}>
												<div
													className={classNames(
														'd-flex align-items-center rounded-2 py-2 px-3 bg-l25-light',
													)}>
													<div className='flex-shrink-0'>
														<Icon
															icon='DoneAll'
															size='3x'
															color='warning'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{item?.key_value}
														</div>
														<div
															className='mt-n2'
															style={{ fontSize: 14 }}>
															{item?.key_name}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardBody>
							</Card>
							<Card className='h-100'>
								<CardHeader className='py-2'>
									<CardLabel icon='NotificationsActive' iconColor='warning'>
										<CardTitle tag='h4' className='h5'>
											Hoạt động gần đây
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='py-2'>
									<Timeline>
										{subtask?.logs?.map((log) => (
											<TimelineItem
												className='align-items-center'
												label={log.time}
												color='primary'>
												<span
													className='text-success fw-bold'
													style={{ fontSize: 14 }}>
													{log?.user?.name}
												</span>{' '}
												đã chuyển trạng thái công việc{' '}
												<span
													className='text-danger fw-bold'
													style={{ fontSize: 14 }}>
													{`#${log?.task_id}`}
												</span>{' '}
												từ{' '}
												<span
													className='text-primary fw-bold'
													style={{ fontSize: 14 }}>
													{log?.prev_status}
												</span>{' '}
												sang{' '}
												<span
													className='text-info fw-bold'
													style={{ fontSize: 14 }}>
													{log?.next_status}
												</span>
											</TimelineItem>
										))}
									</Timeline>
								</CardBody>
							</Card>
						</Card>
					</div>
				</div>
				<div className='row pt-4 mt-4'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Thông tin các bước</div>
					</div>
				</div>
				<div className='row mt-4'>
					<div className='col-12'>
						<Board
							subtask={subtask}
							onAddStep={handleAddStepIntoSubtask}
							data={boardData}
							setData={setBoardData}
						/>
					</div>
				</div>
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseConfirm}
					onConfirm={() => handleDeleteSubTask(subtask)}
					title='Xoá Đầu việc'
					content={`Xác nhận xoá đầu việc <strong>${subtask?.name}</strong> ?`}
				/>
				<TaskDetailForm
					setTask={setTask}
					task={task}
					setEditModalStatus={setEditModalStatus}
					editModalStatus={editModalStatus}
					id={parseInt(params?.id, 10)}
					idEdit={subtask.id}
				/>
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
