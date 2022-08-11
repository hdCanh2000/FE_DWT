// eslint-disable react/no-array-index-key
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import toast from 'react-hot-toast';
import { useToasts } from 'react-toast-notifications';
import Dropdown, {
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from '../../../components/bootstrap/Dropdown';
import { updateSubtasks, getAllSubtasks, updateStatusPendingTask } from './services';
import Chart from '../../../components/extras/Chart';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
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
import {
	calcKPICompleteOfTask,
	calcProgressSubtask,
	calcProgressTask,
	calcTotalKPIOfTask,
	calcTotalSubtaskByStatus,
} from '../../../utils/function';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import Alert from '../../../components/bootstrap/Alert';
import ModalShowListCommon from '../../common/ComponentCommon/ModalShowListCommon';
import { formatDateFromMiliseconds } from '../../../utils/utils';

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
	const [openListInfoModal, setOpenListInfoModal] = useState(false);
	const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
		title: '',
		subTitle: '',
		status: null,
		type: 1,
		isShowNote: false,
	});

	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: ['Chờ chấp nhận', 'Đang thực hiện', 'Đã hoàn thành', 'Chờ xác nhận', 'Huỷ', 'Đóng'],
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

	const columns = [
		{
			title: 'ID',
			id: 'id',
			key: 'id',
			type: 'number',
			align: 'right',
		},
		{
			title: 'Tên công việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`/cong-viec-${task?.id}/dau-viec/${item?.id}`}>
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
					<div className='flex-shrink-0 me-3'>{`${calcProgressSubtask(item)}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={calcProgressSubtask(item)}
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
							`border-light`,
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
				<Dropdown>
					<DropdownToggle hasIcon={false}>
						<Button
							isLink
							color={formatColorStatus(item.status)}
							icon='Circle'
							className='text-nowrap'>
							{FORMAT_TASK_STATUS(item.status)}
						</Button>
					</DropdownToggle>
					<DropdownMenu>
						{Object.keys(TASK_STATUS_MANAGE).map((key) => (
							<DropdownItem
								key={key}
								onClick={() =>
									handleOpenConfirmStatusTask(
										item,
										TASK_STATUS_MANAGE[key].value,
										2,
									)
								}>
								<div>
									<Icon icon='Circle' color={TASK_STATUS_MANAGE[key].color} />
									{TASK_STATUS_MANAGE[key].name}
								</div>
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			),
		},
		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isDisable={item?.status === 4 || item?.status === 7 || item.status === 3}
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenModal(item, 'edit')}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenConfirm(item)}
					/>
				</>
			),
		},
	];

	const columnsPending = [
		{
			title: 'Ngày dự kiến',
			id: 'estimateDate',
			key: 'estimateDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Lời nhắn',
			id: 'name',
			key: 'note',
		},
		{
			title: 'Người yêu cầu xác nhận',
			id: 'user',
			key: 'user',
			render: (item) => <span>{item?.user?.name}</span>,
		},
		{
			title: 'Tên đầu việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`/quan-ly-cong-viec/cong-viec/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
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
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						onClick={() => handleOpenConfirmStatusTask(item, 4, 2)}
						icon='Edit'>
						Xác nhận
					</Button>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						onClick={() => handleOpenConfirmStatusTask(item, 5, 2)}
						icon='Trash'>
						Từ chối
					</Button>
				</>
			),
		},
	];

	// Data
	React.useEffect(() => {
		const fetchSubtasks = async (id) => {
			const res = await getAllSubtasks(id);
			setTask(res.data);
			setTask({
				...res.data,
				departments: [res.data?.department]?.concat(res.data?.departmentsRelated),
				users: [res.data?.user]?.concat(res.data?.usersRelated),
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
		const newSubTasks = task?.subtasks.filter((item) => item.id !== valueDelete.id);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
		});

		try {
			const respose = await updateSubtasks(parseInt(params?.id, 10), newData);
			const result = await respose.data;
			setTask(result);
			navigate(`/cong-viec/${task?.id}`);
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
						...items,
						status: newStatus,
				  }
				: item;
		});
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, {
			subtasks: newSubTasks,
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

	React.useEffect(() => {
		setState({
			series: [
				calcTotalSubtaskByStatus(task, 0),
				calcTotalSubtaskByStatus(task, 2),
				calcTotalSubtaskByStatus(task, 4),
				calcTotalSubtaskByStatus(task, 3),
				calcTotalSubtaskByStatus(task, 6),
				calcTotalSubtaskByStatus(task, 7),
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
		if (data.status === 1 && (status === 1 || status === 3 || status === 8)) {
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

	const handleOpenConfirmStatusTask = (item, nextStatus, type = 1, isShowNote = false) => {
		setOpenConfirmModalStatus(true);
		setTaskEdit({ ...item });
		setInfoConfirmModalStatus({
			title: `Xác nhận ${FORMAT_TASK_STATUS(nextStatus)} công việc`.toUpperCase(),
			subTitle: item?.name,
			status: nextStatus,
			type, // 1 task, 2 subtask,
			isShowNote,
		});
	};

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setTaskEdit(null);
	};

	// Modal hiển thị thông tin note
	const handleOpenListInfoModal = () => {
		setOpenListInfoModal(true);
	};

	const handleCloseListInfoModal = () => {
		setOpenListInfoModal(false);
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
									isDisable={task?.status === 4 || task?.status === 7}
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
									<CardActions className='d-flex'>
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
										<Button
											isOutline={!darkModeStatus}
											color='dark'
											isLight={darkModeStatus}
											className='text-nowrap mx-2 shadow-none'
											icon='Info'
											onClick={() => handleOpenListInfoModal()}
										/>
									</CardActions>
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
													<div className='d-flex align-items-center pb-3'>
														<div className='flex-grow-1'>
															<div className='fw-bold fs-3 mb-0'>
																{calcProgressTask(task)}%
																<div>
																	<Progress
																		isAutoColor
																		value={calcProgressTask(
																			task,
																		)}
																		height={10}
																	/>
																</div>
															</div>
															<div className='fs-5 mt-2'>
																<span className='fw-bold text-danger fs-5 me-2'>
																	{calcTotalSubtaskByStatus(
																		task,
																		4,
																	)}
																</span>
																trên tổng số
																<span className='fw-bold text-danger fs-5 mx-2'>
																	{task?.subtasks?.length}
																</span>
																đầu việc.
															</div>
														</div>
													</div>
													<div className='row d-flex align-items-end pb-3'>
														<div className='col col-sm-5 text-start'>
															<div className='fw-bold fs-4 mb-10'>
																{task?.kpiValue}
															</div>
															<div className='text-muted'>
																KPI được giao
															</div>
															<div className='fw-bold fs-4 mb-10 mt-4'>
																{calcTotalKPIOfTask(task)}
															</div>
															<div className='text-muted'>
																KPI thực tế
															</div>
														</div>
														<div className='col col-sm-7'>
															<div className='fw-bold fs-4 mb-10'>
																{calcKPICompleteOfTask(task)}
															</div>
															<div className='text-muted'>
																Kpi thực tế đã hoàn thành
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
														<CardTitle>Thống kê công việc</CardTitle>
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
																value: calcTotalSubtaskByStatus(
																	task,
																	4,
																),
															},
															{
																label: 'Đang thực hiện',
																value: calcTotalSubtaskByStatus(
																	task,
																	2,
																),
															},
															{
																label: 'Chờ xét duyệt',
																value: calcTotalSubtaskByStatus(
																	task,
																	3,
																),
															},
															{
																label: 'Chờ chấp nhận',
																value: calcTotalSubtaskByStatus(
																	task,
																	0,
																),
															},
															{
																label: 'Từ chối',
																value: calcTotalSubtaskByStatus(
																	task,
																	5,
																),
															},
															{
																label: 'Huỷ',
																value: calcTotalSubtaskByStatus(
																	task,
																	6,
																),
															},
															{
																label: 'Đóng',
																value: calcTotalSubtaskByStatus(
																	task,
																	7,
																),
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
									title='Thông tin công việc'
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
															WebkitLineClamp: '2',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															display: '-webkit-box',
															WebkitBoxOrient: 'vertical',
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
														`${task?.estimateDate} ${task.estimateTime}`,
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
														`${task?.deadlineDate} ${task.deadlineTime}`,
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
												<div key={key?.keyName}>
													<div className='fw-bold fs-5 mb-1'>
														{key?.keyName}
													</div>
													<div className='mt-n2' style={{ fontSize: 14 }}>
														{key?.keyValue}
													</div>
												</div>
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
											.map((item) => {
												return (
													<RelatedActionCommonItem
														key={item?.id}
														type={item?.type}
														time={item?.time}
														username={
															item?.user?.name
																? item?.user?.name
																: item?.user
														}
														id={item?.taskId}
														taskName={item?.taskName}
														prevStatus={item?.prevStatus}
														nextStatus={item?.nextStatus}
													/>
												);
											})}
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
									task.subtasks?.filter((item) => item.status !== 0).length
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
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columns}
										data={task.subtasks?.filter((item) => item.status !== 3)}
									/>
								</div>
								<div className='p-4'>
									{!task.subtasks?.filter((item) => item.status !== 3)
										?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Không có công việc thuộc mục tiêu này!
										</Alert>
									)}
								</div>
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
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columnsPending}
										data={task.subtasks?.filter((item) => item.status === 3)}
									/>
								</div>
								<div className='p-4'>
									{!task?.subtasks?.filter((item) => item.status === 3)
										?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Không có công việc đang chờ xác nhận!
										</Alert>
									)}
								</div>
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
					isShowNote={infoConfirmModalStatus.isShowNote}
					title={infoConfirmModalStatus.title}
					subTitle={infoConfirmModalStatus.subTitle}
					status={infoConfirmModalStatus.status}
				/>
				<ModalShowListCommon
					show={openListInfoModal}
					onClose={handleCloseListInfoModal}
					title='Thông tin ghi chú'
					columns={[
						{
							title: 'Ghi chú',
							id: 'note',
							key: 'note',
							type: 'text',
							align: 'left',
							render: (item) => <span className='fs-5'>{item.note}</span>,
						},
						{
							title: 'Ngày ghi chú',
							id: 'time',
							key: 'time',
							type: 'text',
							align: 'center',
							render: (item) => (
								<span className='fs-5'>{formatDateFromMiliseconds(item.time)}</span>
							),
						},
					]}
					data={
						task?.notes
							?.sort((a, b) => b.time - a.time)
							?.filter((note) => note.note !== '') || []
					}
				/>
			</Page>
		</PageWrapper>
	);
};
export default TaskDetailPage;
