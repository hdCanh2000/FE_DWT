import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
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
			const subtaskRes = result?.subtasks.filter((item) => item.id === parseInt(id, 10))[0];
			setTask(result);
			setSubtask(subtaskRes);
			handleShowToast(
				`Báo đầu việc chờ duyệt!`,
				`Báo đầu việc ${subtaskRes.name} thành công!`,
			);
		} catch (error) {
			setSubtask(subtask);
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
				<div className='row'>
					<div className='d-flex justify-content-between align-items-center'>
						<div className='display-4 fw-bold py-3'>{subtask?.name}</div>
					</div>
				</div>
				<div className='row mb-4'>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary h-100 mb-4 pb-4'>
							<CardHeader>
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
							<CardBody>
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
											<CardBody>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col-12 text-start'>
														<div className='fw-bold fs-3 mb-0'>
															{calcProgressSubtask(subtask)}%
														</div>
														<Progress
															isAutoColor
															value={calcProgressSubtask(subtask)}
															height={10}
															size='lg'
														/>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															trên tổng số{' '}
															{calcTotalStepOfSubTask(subtask)} bước
														</div>
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
											className={`bg-l${
												darkModeStatus ? 'o25' : '25'
											}-danger bg-l${
												darkModeStatus ? 'o50' : '10'
											}-danger-hover transition-base rounded-2 mb-4 h-25`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Lightning' color='danger' />
														&nbsp; Số bước Quá hạn/Huỷ
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
															{/* {calcTotalStepByStatus(subtask, 1)}% */}
															{Math.round(
																(calcTotalStepByStatus(subtask, 3) *
																	100) /
																	// eslint-disable-next-line no-unsafe-optional-chaining
																	subtask?.steps?.length,
															) || 0}
															%
															<span className='text-danger fs-5 fw-bold ms-3'>
																{calcTotalStepByStatus(subtask, 3)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {subtask?.steps?.length}{' '}
															bước.
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
											shadow='sm'
											style={{ minHeight: 260 }}>
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
													{subtask?.keys?.map((item, index) => (
														// eslint-disable-next-line react/no-array-index-key
														<div className='col-xl-6' key={index}>
															<div
																className={classNames(
																	'd-flex align-items-center rounded-2 p-3 bg-l25-light',
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
																		className='text-muted mt-n2 truncate-line-1'
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
									</div>
									<div className='col-md-7'>
										<Card className='h-100'>
											<CardHeader>
												<CardLabel icon='DoubleArrow' iconColor='success'>
													<CardTitle>Thống kê đầu việc</CardTitle>
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
																		2,
																	)}
																</div>
																<div className='text-muted'>
																	Dự kiến
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
						<Card className='mb-4 shadow-3d-info h-100'>
							<CardBody className='pt-0 mb-4'>
								<Card className='mb-4 h-50' shadow='lg'>
									<CardHeader>
										<CardLabel icon='LayoutTextWindow' iconColor='info'>
											<CardTitle>Phòng ban phụ trách</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='row g-5'>
										<div className='col-12 ms-5'>
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
									<CardHeader className='mt-4'>
										<CardLabel icon='LayoutTextWindow' iconColor='info'>
											<CardTitle>Phòng ban liên quan</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='row g-5'>
										<div className='col-12 ms-5'>
											{subtask?.departments_related?.map((department) => (
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
											))}
										</div>
									</div>
								</Card>
								<Card className='mb-4 h-50' shadow='lg'>
									<CardBody className='pt-0'>
										<CardHeader>
											<CardLabel icon='PersonCircle' iconColor='info'>
												<CardTitle>Nhân viên phụ trách</CardTitle>
											</CardLabel>
										</CardHeader>
										<div className='row g-5'>
											<div className='col-12 ms-5'>
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
														<div
															className='text-muted'
															style={{ fontSize: 14 }}>
															{subtask?.user?.slug}
														</div>
													</div>
												</div>
											</div>
										</div>
										<CardHeader className='mt-4'>
											<CardLabel icon='PersonCircle' iconColor='info'>
												<CardTitle>Nhân viên liên quan</CardTitle>
											</CardLabel>
										</CardHeader>
										<div className='row g-5'>
											<div className='col-12 ms-5'>
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
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-12' style={{ marginTop: 50 }}>
						<Card className='shadow-3d-info h-100 mb-0'>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle tag='h4' className='h5'>
										Thông tin đầu việc
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
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
													{FORMAT_TASK_STATUS(subtask?.status)}
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
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
