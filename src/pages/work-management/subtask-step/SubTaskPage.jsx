import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import COLORS from '../../../common/data/enumColors';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Board from './board/Board';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { addStepIntoSubtask, getTaskById } from './services';
import {
	calcKPICompleteOfSubtask,
	calcProgressSubtask,
	calcTotalStepByStatus,
	calcTotalStepOfSubTask,
} from '../../../utils/function';
import Progress from '../../../components/bootstrap/Progress';

const SubTaskPage = () => {
	const params = useParams(); // taskid, id
	const { taskid, id } = params;
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

	return (
		<PageWrapper title={subtask?.name}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>{subtask?.name}</div>
					</div>
				</div>
				<div className='row mb-4'>
					<div className='col-lg-4 mt-4'>
						<Card className='shadow-3d-info mb-4 h-50'>
							<CardBody isScrollable>
								<div className='row g-3 mb-4'>
									<div className='col-12 d-flex justify-content-center'>
										<h2 className='mb-0 fw-bold'>Phòng ban phụ trách</h2>
									</div>
									<div className='col-12'>
										<div className='row g-2'>
											<div className='col-12 mb-0'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='LayoutTextWindow'
															size='3x'
															color='info'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{subtask?.department?.name}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 14 }}>
															{subtask?.department?.slug}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='row g-3 mt-4'>
									<div className='col-12 d-flex justify-content-center'>
										<h2 className='mb-0 fw-bold'>Phòng ban liên quan</h2>
									</div>
									<div className='col-12'>
										<div className='row g-2'>
											{subtask?.departments_related?.map((department) => (
												<div className='col-12 mb-4' key={department.id}>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon='LayoutTextWindow'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{department?.name}
															</div>
															<div
																className='text-muted'
																style={{ fontSize: 14 }}>
																{department?.slug}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card className='shadow-3d-info mt-4 h-50'>
							<CardBody isScrollable>
								<div className='row g-3 mb-4'>
									<div className='col-12 d-flex justify-content-center'>
										<h2 className='mb-0 fw-bold'>Nhân viên phụ trách</h2>
									</div>
									<div className='col-12'>
										<div className='row g-2'>
											<div className='col-12 mb-0'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='LayoutTextWindow'
															size='3x'
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
															{subtask?.user?.name}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='row g-3 mt-4'>
									<div className='col-12 d-flex justify-content-center'>
										<h2 className='mb-0 fw-bold'>Nhân viên liên quan</h2>
									</div>
									<div className='col-12'>
										<div className='row g-2'>
											{subtask?.users_related?.map((user) => (
												<div className='col-12 mb-4' key={user.id}>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon='LayoutTextWindow'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{user?.name}
															</div>
															<div
																className='text-muted'
																style={{ fontSize: 14 }}>
																{user?.name}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8 mt-4'>
						<Card className='shadow-3d-primary h-100 mb-4'>
							<CardHeader>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Thông tin đầu việc
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-5'>
										<Card
											className='bg-l25-primary transition-base rounded-2 mb-4'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='EmojiEmotions' iconColor='primary'>
													<CardTitle tag='h4' className='h5'>
														Thông số đầu việc
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='d-flex align-items-center pb-3'>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcProgressSubtask(subtask)}%
														</div>
														<Progress
															isAutoColor
															value={calcProgressSubtask(subtask)}
															height={20}
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
												<div className='d-flex align-items-center pb-3'>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcKPICompleteOfSubtask(subtask)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															KPI thực tế đạt được
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className='bg-l50-secondary transition-base rounded-2 mb-0'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='BarChart' iconColor='danger'>
													<CardTitle tag='h4' className='h5'>
														Thống kê đầu việc
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='d-flex align-items-center justify-content-start pb-3'>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcTotalStepOfSubTask(subtask)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															Tổng số bước
														</div>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcTotalStepByStatus(subtask, 1)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															Đã hoàn thành
														</div>
													</div>
												</div>
												<div className='d-flex align-items-center justify-content-start pb-3'>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcTotalStepByStatus(subtask, 0)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															Đang thực hiện
														</div>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-3 mb-0'>
															{calcTotalStepByStatus(subtask, 3)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															Quá hạn/Thất bại
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-md-7'>
										<Card className='shadow-3d-info h-100 mb-4 bg-l10-success'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='Stream' iconColor='warning'>
													<CardTitle>Thông tin đầu việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody isScrollable>
												<div className='row g-2'>
													<div className='col-12 mb-4'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Dash'
																	size='2x'
																	color='danger'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	{subtask.name}
																</div>
															</div>
														</div>
													</div>
													<div className='col-12 mb-4'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Dash'
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
																	icon='Dash'
																	size='2x'
																	color='danger'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	<span className='me-2'>
																		Giá trị KPI:{' '}
																	</span>
																	{subtask.kpi_value}
																</div>
															</div>
														</div>
													</div>
													<div className='col-12 mb-4'>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Dash'
																	size='2x'
																	color='danger'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	<span className='me-2'>
																		Thời gian dự kiến hoàn
																		thành:
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
																	icon='Dash'
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
									<div className='col-md-12'>
										<Card
											className='h-100 bg-l25-info transition-base rounded-2 mt-4'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='ShowChart' iconColor='secondary'>
													<CardTitle>Chỉ số key</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='row g-4 align-items-center mb-4'>
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
