import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import _ from 'lodash';
import COLORS from '../../../common/data/enumColors';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Board from './board/Board';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Toasts from '../../../components/bootstrap/Toasts';
import { formatColorStatus, FORMAT_TASK_STATUS, STATUS } from '../../../utils/constants';
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
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import Popovers from '../../../components/bootstrap/Popovers';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
import Icon from '../../../components/icon/Icon';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';

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
	const [newWork, setNewWork] = React.useState();
	useEffect(() => {
		async function fetchDataTaskById() {
			const reponse = await getTaskById(taskid);
			const result = await reponse.data;
			const subtaskRes = result?.subtasks.filter((item) => item.id === parseInt(id, 10))[0];
			setNewWork(result.logs);
			setTask(result);
			setSubtask({
				...subtaskRes,
				departments: [subtaskRes?.department]?.concat(subtaskRes?.departments_related),
				users: [subtaskRes?.user]?.concat(subtaskRes?.users_related),
			});
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

	const handleClickChangeStatusSubtask = async (data, status) => {
		if (status === 4 || status === 5 || status === 6 || status === 7) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Đầu việc ${data.name} ${FORMAT_TASK_STATUS(
					data.status,
				)}!`,
				'Error',
				'danger',
			);
		}
		if (data.status === 4 || data.status === 5 || data.status === 6 || data.status === 7) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Đầu việc ${data.name} ${FORMAT_TASK_STATUS(
					data.status,
				)}!`,
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
				subtaskClone.status = status;
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
		const newWorks = JSON.parse(JSON.stringify(newWork));
		const newLogs = [
			...newWorks,
			{
				user: {
					id: task?.user?.id,
					name: task?.user?.name,
				},
				type: 2,
				prev_status: null,
				next_status: `Xóa`,
				subtask_id: subtasks.id,
				subtask_name: subtasks.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
			},
		];
		const newSubTasks = task?.subtasks?.filter((item) => item.id !== subtasks?.id);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
			current_kpi_value: totalKpiSubtask(newSubTasks),
			logs: newLogs,
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
						<Card className='shadow-3d-primary h-100 mb-0 pb-0'>
							<CardHeader className='py-2'>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Tổng kết
									</CardTitle>
								</CardLabel>
								<Dropdown>
									<DropdownToggle hasIcon={false}>
										<Button
											color='danger'
											icon='Report'
											className='text-nowrap'>
											Cập nhật trạng thái
										</Button>
									</DropdownToggle>
									<DropdownMenu>
										{Object.keys(STATUS).map((key) => (
											<DropdownItem
												key={key}
												onClick={() =>
													handleClickChangeStatusSubtask(
														subtask,
														STATUS[key].value,
													)
												}>
												<div>
													<Icon icon='Circle' color={STATUS[key].color} />
													{STATUS[key].name}
												</div>
											</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>
							</CardHeader>
							<CardBody className='py-2'>
								<div className='row h-100'>
									<div className='col-md-5'>
										<Card
											className='bg-l25-primary transition-base rounded-2 mb-4'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='Activity' iconColor='primary'>
													<CardTitle tag='h4' className='h5'>
														Tiến độ thực hiện
													</CardTitle>
													<CardSubTitle
														tag='h4'
														className={`h5 text-${formatColorStatus(
															subtask?.status,
														)}`}>
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
										<CardInfoCommon
											className='mb-4 pb-4'
											shadow='lg'
											style={{ minHeight: 320 }}
											title='Phòng ban phụ trách'
											icon='LayoutTextWindow'
											iconColor='info'
											data={subtask?.departments?.map((department) => {
												return {
													icon: 'TrendingFlat',
													color: 'info',
													children: (
														<div className='fw-bold fs-5 mb-1'>
															{department?.name}
														</div>
													),
												};
											})}
										/>
										<CardInfoCommon
											className='mb-4 pb-4'
											shadow='lg'
											style={{ minHeight: 320 }}
											title='Nhân viên phụ trách'
											icon='PersonCircle'
											iconColor='info'
											isScrollable
											data={subtask?.users?.map((department) => {
												return {
													icon: 'TrendingFlat',
													color: 'info',
													children: (
														<div className='fw-bold fs-5 mb-1'>
															{department?.name}
														</div>
													),
												};
											})}
										/>
									</div>
									<div className='col-md-7'>
										<Card className='h-100'>
											<CardHeader className='py-2'>
												<CardLabel icon='DoubleArrow' iconColor='success'>
													<CardTitle>Thống kê đầu việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												<ReportCommon
													data={[
														{
															label: 'Tổng số bước',
															value: calcTotalStepOfSubTask(subtask),
														},
														{
															label: 'Đã hoàn thành',
															value: calcTotalStepByStatus(
																subtask,
																1,
															),
														},
														{
															label: 'Đang thực hiện',
															value: calcTotalStepByStatus(
																subtask,
																0,
															),
														},
														{
															label: 'Huỷ/Quá hạn',
															value: calcTotalStepByStatus(
																subtask,
																3,
															),
														},
													]}
												/>
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
						<Card className='mb-0 h-100 shadow-3d-info'>
							<CardInfoCommon
								className='mb-4'
								shadow='lg'
								style={{ minHeight: 220 }}
								title='Thông tin đầu việc'
								icon='Stream'
								iconColor='primary'
								data={[
									{
										icon: 'Pen',
										color: 'primary',
										children: (
											<Popovers desc={subtask?.description} trigger='hover'>
												<div
													className='fs-5'
													style={{
														'-webkit-line-clamp': '2',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														'-webkit-box-orient': 'vertical',
													}}>
													{subtask?.description}
												</div>
											</Popovers>
										),
									},
									{
										icon: 'ClockHistory',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Thời gian dự kiến:</span>
												{moment(
													`${subtask?.estimate_date} ${subtask.estimate_time}`,
												).format('DD-MM-YYYY, HH:mm')}
											</div>
										),
									},
									{
										icon: 'CalendarCheck',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Hạn hoàn thành:</span>
												{moment(
													`${subtask?.deadline_date} ${subtask.deadline_time}`,
												).format('DD-MM-YYYY, HH:mm')}
											</div>
										),
									},
								]}
							/>
							{/* Chỉ số key */}
							<CardInfoCommon
								className='transition-base w-100 rounded-2 mb-4'
								shadow='lg'
								style={{ minHeight: 250 }}
								title='Chỉ số key'
								icon='ShowChart'
								iconColor='danger'
								data={subtask?.keys?.map((key) => {
									return {
										icon: 'DoneAll',
										color: 'danger',
										children: (
											<>
												<div className='fw-bold fs-5 mb-1'>
													{key?.key_value}
												</div>
												<div className='mt-n2' style={{ fontSize: 14 }}>
													{key?.key_name}
												</div>
											</>
										),
									};
								})}
							/>
							<Card className='h-100 mb-0' shadow='lg'>
								<CardHeader className='py-2'>
									<CardLabel icon='NotificationsActive' iconColor='warning'>
										<CardTitle tag='h4' className='h5'>
											Hoạt động gần đây
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='py-2'>
									{subtask?.logs
										?.slice()
										.reverse()
										.map((item) => (
											<RelatedActionCommonItem
												key={item?.id}
												type={item?.type}
												time={item?.time}
												username={item?.user?.name}
												id={
													item?.step_id ? item?.step_id : item?.subtask_id
												}
												taskName={
													item?.step_name
														? item?.step_name
														: item?.subtask_name
												}
												prevStatus={item?.prev_status}
												nextStatus={item?.next_status}
											/>
										))}
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
					id={subtask?.task_id}
					idEdit={subtask.id}
					newWork={newWork}
				/>
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
