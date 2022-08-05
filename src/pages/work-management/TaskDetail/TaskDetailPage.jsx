// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import toast from 'react-hot-toast';
import { useToasts } from 'react-toast-notifications';
import Dropdown, {
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from '../../../components/bootstrap/Dropdown';
import Alert from '../../../components/bootstrap/Alert';
import { updateSubtasks, getAllSubtasks, updateStatusPendingTask } from './services';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import {
	FORMAT_TASK_STATUS,
	formatColorStatus,
	formatColorPriority,
	TASK_STATUS,
	TASK_STATUS_MANAGE,
} from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import TaskDetailForm from './TaskDetailForm/TaskDetailForm';
import ComfirmSubtask from './TaskDetailForm/ComfirmSubtask';
import useDarkMode from '../../../hooks/useDarkMode';
import './styleTaskDetail.scss';
import TaskAlertConfirm from '../mission/TaskAlertConfirm';
import TaskFormModal from '../mission/TaskFormModal';
import { deleteTaskById, updateTaskByID } from '../mission/services';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
import Toasts from '../../../components/bootstrap/Toasts';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import Popovers from '../../../components/bootstrap/Popovers';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';

const TaskDetailPage = () => {
	// State
	const [task, setTask] = useState({});
	const { darkModeStatus } = useDarkMode();
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [idEdit, setIdEdit] = useState(0);
	const [title, setTitle] = useState();
	const params = useParams();
	const [openConfirm, set0penConfirm] = React.useState(false);
	const [deletes, setDeletes] = React.useState({});
	const [editModalTaskStatus, setEditModalTaskStatus] = useState(false);
	const [taskEdit, setTaskEdit] = useState({});
	const [openConfirmTaskModal, setOpenConfirmTaskModal] = useState(false);
	const [newWork, setNewWork] = React.useState([]);
	const navigate = useNavigate();
	const { addToast } = useToasts();
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
		title: '',
		subTitle: '',
		status: null,
		type: 1,
	});

	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Chờ xác nhận', 'Đã hoàn thành', 'Huỷ', 'Từ chối'],
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
	React.useEffect(() => {
		const fetchSubtasks = async (id) => {
			const res = await getAllSubtasks(id);
			// setTask(res.data);
			setTask({
				...res.data,
				departments: [res.data?.department]?.concat(res.data?.departments_related),
				users: [res.data?.user]?.concat(res.data?.users_related),
			});
		};
		fetchSubtasks(parseInt(params?.id, 10));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	React.useEffect(() => {
		setNewWork(task?.logs);
	}, [task]);
	// Handle
	const handleOpenModal = (items, titles) => {
		setEditModalStatus(true);
		setIdEdit(items.id);
		setTitle(titles);
	};
	// show toast
	const handleShowToast = (titleToast, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={titleToast} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};
	const handleDelete = async (valueDelete) => {
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
				subtask_id: valueDelete.id,
				subtask_name: valueDelete.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
			},
		];
		const newSubTasks = task?.subtasks.filter((item) => item.id !== valueDelete.id);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
			current_kpi_value: totalKpiSubtask(newSubTasks),
			logs: newLogs,
		});

		try {
			const respose = await updateSubtasks(parseInt(params?.id, 10), newData);
			const result = await respose.data;
			setTask(result);
			navigate(`/quan-ly-cong-viec/cong-viec/${task?.id}`);
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu ${valueDelete?.name} thành công!`);
		} catch (error) {
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu ${valueDelete?.name} thất bại!`);
		}
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
		const checkValid = prevIsValidClickChangeStatus(items, newStatus);
		if (!checkValid) return;
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
			handleCloseConfirmStatusTask();
		} catch (error) {
			toast.error('Cập nhật trạng thái thất bại !');
		}
	};
	// eslint-disable-next-line no-unused-vars
	const handleUpdateStatus = async (statuss, data) => {
		const newWorks = JSON.parse(JSON.stringify(newWork));
		const newLogs = [
			...newWorks,
			{
				user: {
					id: task?.user?.id,
					name: task?.user?.name,
				},
				type: 1,
				prev_status: `${FORMAT_TASK_STATUS(data.status)}`,
				next_status: `${FORMAT_TASK_STATUS(statuss)}`,
				subtask_id: data.id,
				subtask_name: data.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
			},
		];
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
			logs: newLogs,
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

	// ------------------	UPDATE AND DELETE TASK	-------------------
	// form task modal
	const handleOpenEditTaskForm = (item) => {
		setEditModalTaskStatus(true);
		setTaskEdit({ ...item });
	};

	const handleCloseEditTaskForm = () => {
		setEditModalTaskStatus(false);
		setTaskEdit(null);
	};

	// // confirm task modal
	const handleOpenConfirmTaskModal = (item) => {
		setOpenConfirmTaskModal(true);
		setTaskEdit({ ...item });
	};

	const handleCloseConfirmTaskModal = () => {
		setOpenConfirmTaskModal(false);
		setTaskEdit(null);
	};

	const handleDeleteTask = async (taskId) => {
		try {
			await deleteTaskById(taskId);
			handleCloseConfirmTaskModal();
			navigate(-1);
			toast.success('Xoá công việc thành công!');
		} catch (error) {
			handleCloseConfirmTaskModal();
			toast.error('Xoá công việc không thành công. Vui lòng thử lại!');
		}
	};

	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				setTask(result);
				toast.success('Cập nhật công việc thành công!');
				handleCloseEditTaskForm();
			} catch (error) {
				setTask(task);
				toast.error('Cập nhật công việc không thành công. Xin vui lòng thử lại!');
			}
		}
	};

	// funtion caculator

	// phần trăm hòan thành subtask
	const progressSubtask = (subtasks) => {
		let length = subtasks?.steps.length;
		let count = 0;
		subtasks?.steps.forEach((element) => {
			if (element.status === 1) {
				count += 1;
			}
		});
		if (!length) length = 1;
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
	// const progressAllSubtask = (a, b) => {
	// 	if (!b) b = 1;
	// 	return (a / b).toFixed(2) * 100;
	// };
	// số đầu việc hoàn thành trên task
	const totalSuccessSubtaskOfTask = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		const { subtasks } = tasks;
		if (_.isEmpty(subtasks)) return 0;
		let total = 0;
		// eslint-disable-next-line consistent-return
		subtasks.forEach((item) => {
			if (item.status === 4) {
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
			if (item.status === 4) totalKpi += item.kpi_value;
		});
		return totalKpi;
	};
	// Số đầu đang chờ xét duyệt
	const totalPendingSubtaskOfTask = (tasks) => {
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
	// Số đầu việc đang thực hiện
	const subtasksDangThucHien = (tasks) => {
		if (_.isEmpty(tasks)) return 0;
		let total = 0;
		tasks?.subtasks?.forEach((item) => {
			if (item?.status === 2) {
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

	// --------------	  Xử lý chức năng thay đổi trạng thái	  	----------------
	// --------------	  Handle change status task	  	----------------

	const prevIsValidClickChangeStatus = (data, status) => {
		if (data.status === 0 && (status === 3 || status === 6 || status === 8)) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} ${FORMAT_TASK_STATUS(
					data.status,
				)}!`,
				'Error',
				'danger',
			);
			return false;
		}
		if (data.status === 1 && (status === 1 || status === 3 || status === 6 || status === 8)) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} chưa được thực hiện!`,
				'Error',
				'danger',
			);
			return false;
		}
		if (data.status === 2 && (status === 1 || status === 2)) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} đang được thực hiện!`,
				'Error',
				'danger',
			);
			return false;
		}
		if (
			data.status === 3 &&
			(status === 1 || status === 8 || status === 3 || status === 6 || status === 8)
		) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} ${FORMAT_TASK_STATUS(
					data.status,
				)}!`,
				'Error',
				'danger',
			);
			return false;
		}
		if (data.status === 6 && status !== 2) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} đã bị huỷ!`,
				'Error',
				'danger',
			);
			return false;
		}
		if (data.status === 8 && (status === 1 || status === 8)) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Công việc ${data.name} đang tạm dừng!`,
				'Error',
				'danger',
			);
			return false;
		}
		return true;
	};

	const handleClickChangeStatusTask = async (status, data) => {
		const checkValid = prevIsValidClickChangeStatus(data, status);
		if (!checkValid) return;
		try {
			const taskClone = { ...data };
			taskClone.status = status;
			const response = await updateStatusPendingTask(taskClone);
			const result = await response.data;
			setTask(result);
			handleCloseConfirmStatusTask();
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Cập nhật trạng thái công việc ${result.name} thành công!`,
			);
		} catch (error) {
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Xin vui lòng thử lại!`,
				'Error',
				'danger',
			);
		}
	};

	// ------------			Modal confirm khi thay đổi trạng thái		----------------------
	// ------------			Moal Confirm when change status task		----------------------
	// handleStatus(4, item)

	const handleOpenConfirmStatusTask = (item, nextStatus, type = 1) => {
		setOpenConfirmModalStatus(true);
		setTaskEdit({ ...item });
		setInfoConfirmModalStatus({
			title: `Xác nhận ${FORMAT_TASK_STATUS(nextStatus)} công việc`.toUpperCase(),
			subTitle: item?.name,
			status: nextStatus,
			type, // 1 task, 2 subtask
		});
	};

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setTaskEdit(null);
	};

	return (
		<PageWrapper title={task?.name}>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Quay lại
					</Button>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid' className='overflow-hidden'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-4 fw-bold py-3'>{task?.name}</div>
							<div>
								<Button
									isOutline={!darkModeStatus}
									color='primary'
									isLight={darkModeStatus}
									className='text-nowrap mx-2'
									icon='Edit'
									onClick={() => handleOpenEditTaskForm(task)}>
									Sửa
								</Button>
								<Button
									isOutline={!darkModeStatus}
									color='danger'
									isLight={darkModeStatus}
									className='text-nowrap mx-2'
									icon='Trash'
									onClick={() => handleOpenConfirmTaskModal(task)}>
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
									<Dropdown>
										<DropdownToggle hasIcon={false}>
											<Button
												color='danger'
												icon='Report'
												className='text-nowrap'>
												Cập nhật trạng thái công việc
											</Button>
										</DropdownToggle>
										<DropdownMenu>
											{Object.keys(TASK_STATUS).map((key) => (
												<DropdownItem
													key={key}
													onClick={() =>
														handleOpenConfirmStatusTask(
															task,
															TASK_STATUS[key].value,
														)
													}>
													<div>
														<Icon
															icon='Circle'
															color={TASK_STATUS[key].color}
														/>
														{TASK_STATUS[key].name}
													</div>
												</DropdownItem>
											))}
										</DropdownMenu>
									</Dropdown>
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
															Tiến độ thực hiện
														</CardTitle>
														<CardSubTitle
															tag='h4'
															className={`h5 text-${formatColorStatus(
																task?.status,
															)}`}>
															{FORMAT_TASK_STATUS(task.status)}
														</CardSubTitle>
													</CardLabel>
												</CardHeader>
												<CardBody className='py-2'>
													<div className='row d-flex align-items-end pb-3'>
														<div className='col-12 text-start'>
															<div className='fw-bold fs-3 mb-0'>
																{progressTaskBySubtask(task)}%
															</div>
															<div
																className='text-muted'
																style={{ fontSize: 15 }}>
																{totalSuccessSubtaskOfTask(task)}{' '}
																trên tổng số{' '}
																{task?.subtasks?.length} đầu việc.
															</div>
															<Progress
																isAutoColor
																value={progressTaskBySubtask(task)}
																height={10}
																size='lg'
															/>
														</div>
													</div>
													<div className='row d-flex align-items-end pb-3'>
														<div className='col col-sm-6 text-start'>
															<div className='fw-bold fs-4 mb-10'>
																{task?.kpi_value}
															</div>
															<div className='text-muted'>
																Giá trị KPI
															</div>
														</div>
														<div className='col col-sm-6 text-start'>
															<div className='fw-bold fs-4 mb-10'>
																{totalKpiSubtask(task?.subtasks)}
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
												style={{ minHeight: 300 }}
												title='Phòng ban phụ trách'
												icon='LayoutTextWindow'
												iconColor='info'
												data={task?.departments?.map((department) => {
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
												style={{ minHeight: 300 }}
												title='Nhân viên phụ trách'
												icon='PersonCircle'
												iconColor='info'
												isScrollable
												data={task?.users?.map((user) => {
													return {
														icon: 'TrendingFlat',
														color: 'info',
														children: (
															<div className='fw-bold fs-5 mb-1'>
																{user?.name}
															</div>
														),
													};
												})}
											/>
										</div>
										<div className='col-md-7'>
											<Card className='h-100'>
												<CardHeader className='py-2'>
													<CardLabel
														icon='DoubleArrow'
														iconColor='success'>
														<CardTitle>Thống kê đầu việc</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody className='py-2'>
													<ReportCommon
														data={[
															{
																label: 'Tổng số đầu việc',
																value: task?.subtasks?.length,
															},
															{
																label: 'Đã hoàn thành',
																value: totalSuccessSubtaskOfTask(
																	task,
																),
															},
															{
																label: 'Đang thực hiện',
																value: totalPendingSubtaskOfTask(
																	task,
																),
															},
															{
																label: 'Huỷ/Quá hạn',
																value: totalFailSubtask(task),
															},
														]}
													/>
													{task?.subtasks?.length > 0 ? (
														<div className='row align-items-center'>
															<div
																className='col-xl-12 col-md-12'
																style={{ marginTop: '25%' }}>
																<Chart
																	series={state?.series}
																	options={state?.options}
																	type={
																		state?.options?.chart?.type
																	}
																	height={
																		state?.options?.chart
																			?.height
																	}
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
												<Popovers desc={task?.description} trigger='hover'>
													<div
														className='fs-5'
														style={{
															'-webkit-line-clamp': '2',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															display: '-webkit-box',
															'-webkit-box-orient': 'vertical',
														}}>
														{task?.description}
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
														`${task?.estimate_date} ${task.estimate_time}`,
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
														`${task?.deadline_date} ${task.deadline_time}`,
													).format('DD-MM-YYYY, HH:mm')}
												</div>
											),
										},
									]}
								/>
								{/* Chỉ số key */}
								<CardInfoCommon
									isScrollable
									className='transition-base w-100 rounded-2 mb-4'
									shadow='lg'
									style={{ minHeight: 315 }}
									title='Chỉ số key'
									icon='ShowChart'
									iconColor='danger'
									data={task?.keys?.map((key) => {
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
								<Card style={{ minHeight: '38%' }}>
									<CardHeader>
										<CardLabel icon='NotificationsActive' iconColor='warning'>
											<CardTitle tag='h4' className='h5'>
												Hoạt động gần đây
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody isScrollable>
										{task?.logs
											?.slice()
											.reverse()
											.map((item) => (
												<RelatedActionCommonItem
													key={item?.id}
													type={item?.type}
													time={item?.time}
													username={item?.user?.name}
													id={
														item?.subtask_id
															? item?.subtask_id
															: item?.task_id
													}
													taskName={
														item?.subtask_name
															? item?.subtask_name
															: item?.task_name
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

					{/* Tổng kết */}
					<Card>
						<Tabs defaultActiveKey='DetailSubtask' id='uncontrolled-tab-example'>
							<Tab
								eventKey='DetailSubtask'
								title={`Danh sách đầu việc (${
									task.subtasks?.filter(
										(item) =>
											item.status === 1 ||
											item.status === 0 ||
											item.status === 4,
									).length
								})`}
								className='mb-3'>
								{/* Danh sách đầu việc */}
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh sách đầu việc </CardLabel>
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
												{task?.subtasks?.filter(
													(item) =>
														item.status === 1 ||
														item.status === 0 ||
														item.status === 4,
												).length === 0 ? (
													<tr>
														<td colSpan='8'>
															<Alert
																color='warning'
																isLight
																icon='Report'
																className='mt-3'>
																Không có đầu việc thuộc danh sách
																này !
															</Alert>
														</td>
													</tr>
												) : (
													''
												)}
												{task?.subtasks
													?.filter(
														(item) =>
															item.status === 0 ||
															item.status === 1 ||
															item.status === 2 ||
															item.status === 4 ||
															item.status === 5 ||
															item.status === 6 ||
															item.status === 7 ||
															item.status === 8,
													)
													.map((item) => (
														<tr key={item.id}>
															<td>#{item.id}</td>
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
																		`bg-${formatColorPriority(
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
																		{Object.keys(
																			TASK_STATUS_MANAGE,
																		).map((key) => (
																			<DropdownItem
																				key={key}
																				onClick={() =>
																					handleOpenConfirmStatusTask(
																						item,
																						TASK_STATUS_MANAGE[
																							key
																						].value,
																						2,
																					)
																				}>
																				<div>
																					<Icon
																						icon='Circle'
																						color={
																							TASK_STATUS_MANAGE[
																								key
																							].color
																						}
																					/>
																					{
																						TASK_STATUS_MANAGE[
																							key
																						].name
																					}
																				</div>
																			</DropdownItem>
																		))}
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
																			item,
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
							<Tab
								eventKey='SubmitSubtask'
								title={`Đầu việc chờ xác nhận (${
									task?.subtasks?.filter((item) => item.status === 3).length
								})`}>
								<CardHeader>
									<CardLabel icon='ContactSupport' iconColor='secondary'>
										<CardTitle tag='h4' className='h5'>
											Đầu việc chờ xác nhận
										</CardTitle>
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
												{task?.subtasks?.filter((item) => item.status === 3)
													.length === 0 ? (
													<tr>
														<td colSpan='8'>
															<Alert
																color='warning'
																isLight
																icon='Report'
																className='mt-3'>
																Không có đầu việc thuộc danh sách
																này !
															</Alert>
														</td>
													</tr>
												) : (
													''
												)}
												{task?.subtasks
													?.filter((item) => item.status === 3)
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
																	color={formatColorStatus(
																		item.status,
																	)}
																/>
																{FORMAT_TASK_STATUS(item.status)}
															</td>
															<td style={{ width: '270px' }}>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	onClick={() =>
																		handleOpenConfirmStatusTask(
																			item,
																			4,
																			2,
																		)
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
																		handleOpenConfirmStatusTask(
																			item,
																			5,
																			2,
																		)
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
					onConfirm={() => handleDelete(deletes)}
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
					newWork={newWork}
					setNewWork={setNewWork}
				/>
				<TaskFormModal
					show={editModalTaskStatus}
					onClose={handleCloseEditTaskForm}
					onSubmit={handleSubmitTaskForm}
					item={taskEdit}
				/>
				<TaskAlertConfirm
					openModal={openConfirmTaskModal}
					onCloseModal={handleCloseConfirmTaskModal}
					onConfirm={() => handleDeleteTask(taskEdit?.id)}
					title='Xoá công việc'
					content={`Xác nhận xoá công việc <strong>${taskEdit?.name}</strong> ?`}
				/>
				<ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={
						infoConfirmModalStatus.type === 1
							? handleClickChangeStatusTask
							: handleStatus
					}
					item={taskEdit}
					title={infoConfirmModalStatus.title}
					subTitle={infoConfirmModalStatus.subTitle}
					status={infoConfirmModalStatus.status}
				/>
			</Page>
		</PageWrapper>
	);
};
export default TaskDetailPage;
