// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import Icon from '../../../components/icon/Icon';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	addNewTask,
	deleteMissionById,
	deleteTaskById,
	getAllTaksByMissionID,
	getMissionById,
	updateMissionById,
	updateTaskByID,
} from './services';
import {
	calcKPICompleteOfMission,
	calcProgressMission,
	calcProgressTask,
	calcTotalCurrentKPIOfMission,
	calcTotalKPIOfTask,
	calcTotalTaskByStatus,
} from '../../../utils/function';
import Button from '../../../components/bootstrap/Button';
import MissionAlertConfirm from './MissionAlertConfirm';
import TaskAlertConfirm from './TaskAlertConfirm';
import TaskFormModal from './TaskFormModal';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import {
	FORMAT_TASK_STATUS,
	formatColorStatus,
	formatColorPriority,
	TASK_STATUS_MANAGE,
} from '../../../utils/constants';
import Progress from '../../../components/bootstrap/Progress';
import Chart from '../../../components/extras/Chart';
import '../TaskDetail/styleTaskDetail.scss';
import MissionFormModal from './MissionFormModal';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import Popovers from '../../../components/bootstrap/Popovers';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';

const chartOptions = {
	chart: {
		type: 'donut',
		height: 320,
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

const MissionDetailPage = () => {
	const [mission, setMission] = useState({});
	const [tasks, setTasks] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [editModalMissionStatus, setEditModalMissionStatus] = useState(false);
	const [openConfirmMissionModal, setOpenConfirmMissionModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [missionEdit, setMissionEdit] = useState({});
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
		title: '',
		subTitle: '',
		status: null,
		isShowNote: false,
	});
	const params = useParams();
	const navigate = useNavigate();
	const { id } = params;

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
				<Link className='text-underline' to={`/cong-viec/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian dự kiến',
			id: 'estimate_date',
			key: 'estimate_date',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadline_date',
			key: 'deadline_date',
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
					<div className='flex-shrink-0 me-3'>{`${calcProgressTask(item)}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={calcProgressTask(item)}
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
			id: 'kpi_value',
			key: 'kpi_value',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI thực tế',
			id: 'current_kpi',
			key: 'current_kpi',
			type: 'number',
			render: (item) => <span>{calcTotalKPIOfTask(item)}</span>,
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
									handleOpenConfirmStatusTask(item, TASK_STATUS_MANAGE[key].value)
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
						icon='Edit'
						isDisable={item.status === 4 || item.status === 7 || item.status === 3}
						onClick={() => handleOpenEditForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenConfirmModal(item)}
					/>
				</>
			),
		},
	];

	const columnsPending = [
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
				<Link className='text-underline' to={`/quan-ly-cong-viec/cong-viec/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadline_date',
			key: 'deadline_date',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${calcProgressTask(item)}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={calcProgressTask(item)}
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
			id: 'kpi_value',
			key: 'kpi_value',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI thực tế',
			id: 'current_kpi',
			key: 'current_kpi',
			type: 'number',
			render: (item) => <span>{calcTotalKPIOfTask(item)}</span>,
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
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Check'
						onClick={() => handleOpenConfirmStatusTask(item, 4)}>
						Duyệt
					</Button>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenConfirmStatusTask(item, 5)}>
						Từ chối
					</Button>
				</>
			),
		},
	];

	useEffect(() => {
		async function fetchDataMissionByID() {
			const response = await getMissionById(id);
			const result = await response.data;
			setMission(result);
		}
		fetchDataMissionByID();
	}, [id]);

	useEffect(() => {
		async function fetchDataTaskByMissionID() {
			const response = await getAllTaksByMissionID(id);
			const result = await response.data;
			setTasks(result);
			// setTaskLogs(result.filter((item) => item?.logs?.length > 0)?.map((item) => item.logs));
		}
		fetchDataTaskByMissionID();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const { themeStatus, darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	const handleClearValueForm = () => {
		setItemEdit({
			id: null,
			name: '',
			description: '',
			kpi_value: '',
			estimate_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			estimate_time: '08:00',
			deadline_date: moment().add(0, 'days').format('YYYY-MM-DD'),
			deadline_time: '08:00',
			status: 0,
		});
		setMissionEdit({
			name: '',
			description: '',
			kpi_value: '',
			start_time: moment().add(0, 'days').format('YYYY-MM-DD'),
			end_time: moment().add(0, 'days').format('YYYY-MM-DD'),
			status: 1,
		});
	};

	// confirm modal
	const handleOpenConfirmModal = (item) => {
		setOpenConfirmModal(true);
		setItemEdit({ ...item });
	};

	const handleCloseConfirmModal = () => {
		setOpenConfirmModal(false);
		setItemEdit(null);
	};

	// confirm mission modal
	const handleOpenConfirmMissionModal = (item) => {
		setOpenConfirmMissionModal(true);
		setMissionEdit({ ...item });
	};

	const handleCloseConfirmMissionModal = () => {
		setOpenConfirmMissionModal(false);
		setMissionEdit(null);
	};

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

	const handleDeleteItem = async (taskId) => {
		try {
			await deleteTaskById(taskId);
			const newState = [...tasks];
			setTasks(newState.filter((item) => item.id !== taskId));
			handleCloseConfirmModal();
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu thành công!`);
		} catch (error) {
			handleCloseConfirmModal();
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu không thành công!`);
		}
	};

	const handleDeleteMission = async (missionId) => {
		try {
			await deleteMissionById(missionId);
			handleCloseConfirmModal();
			navigate('/muc-tieu/danh-sach');
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu thành công!`);
		} catch (error) {
			handleCloseConfirmModal();
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu không thành công!`);
		}
	};

	// form modal
	const handleOpenEditForm = (item) => {
		setEditModalStatus(true);
		setItemEdit({ ...item });
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
	};

	// form mission modal
	const handleOpenEditMissionForm = (item) => {
		setEditModalMissionStatus(true);
		setMissionEdit({ ...item });
	};

	const handleCloseEditMissionForm = () => {
		setEditModalMissionStatus(false);
		setMissionEdit(null);
	};

	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				const newTasks = [...tasks];
				setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
				try {
					const missionClone = { ...mission };
					const newMission = await updateMissionById(missionClone);
					setMission(newMission.data);
				} catch (error) {
					setMission(mission);
				}
				handleClearValueForm();
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
				const response = await addNewTask({
					...data,
					mission_id: parseInt(params.id, 10),
				});
				const result = await response.data;
				const newTasks = [...tasks];
				newTasks.push(result);
				setTasks(newTasks);
				try {
					const missionClone = { ...mission };
					const newMission = await updateMissionById(missionClone);
					setMission(newMission.data);
				} catch (error) {
					setMission(mission);
				}
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(`Thêm công việc`, `Công việc ${result.name} được thêm thành công!`);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`Thêm công việc`, `Thêm công việc không thành công!`);
			}
		}
	};
	const handleSubmitMissionForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				const result = await response.data;
				setMission(result);
				handleClearValueForm();
				handleCloseEditMissionForm();
				handleShowToast(
					`Cập nhật mục tiêu!`,
					`Mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setMission(mission);
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		}
	};

	const handleUpdateStatus = async (status, data) => {
		const checkValid = prevIsValidClickChangeStatus(data, status);
		if (!checkValid) return;
		try {
			const newData = { ...data };
			newData.status = status;
			const response = await updateTaskByID(newData);
			const result = await response.data;
			setTasks(tasks.map((item) => (item.id === data.id ? { ...result } : item)));
			handleClearValueForm();
			handleCloseEditForm();
			handleCloseConfirmStatusTask();
			handleShowToast(
				`Cập nhật công việc!`,
				`Công việc ${result.name} được cập nhật thành công!`,
			);
		} catch (error) {
			setTasks(tasks);
			handleShowToast(`Cập nhật công việc`, `Cập nhật công việc không thành công!`);
		}
	};

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

	// ------------			Modal confirm khi thay đổi trạng thái		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	const handleOpenConfirmStatusTask = (item, nextStatus, isShowNote = false) => {
		setOpenConfirmModalStatus(true);
		setItemEdit({ ...item });
		setInfoConfirmModalStatus({
			title: `Xác nhận ${FORMAT_TASK_STATUS(nextStatus)} công việc`.toUpperCase(),
			subTitle: item?.name,
			status: nextStatus,
			isShowNote,
		});
	};

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setItemEdit(null);
	};

	return (
		<PageWrapper title={`${mission?.name}`}>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Quay lại
					</Button>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid' className='overflow-hidden'>
				<div className='row mb-4 pb-4'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-4 fw-bold py-3'>{mission?.name}</div>
							<div>
								<Button
									isOutline={!darkModeStatus}
									color='primary'
									isLight={darkModeStatus}
									className='text-nowrap mx-2'
									icon='Edit'
									onClick={() => handleOpenEditMissionForm(mission)}>
									Sửa
								</Button>
								<Button
									isOutline={!darkModeStatus}
									color='danger'
									isLight={darkModeStatus}
									className='text-nowrap mx-2'
									icon='Trash'
									onClick={() => handleOpenConfirmMissionModal(mission)}>
									Xoá
								</Button>
							</div>
						</div>
					</div>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary h-100 mb-0'>
							<CardHeader className='py-2'>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Tổng kết
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='py-2'>
								<div className='row h-100'>
									<div className='col-md-5 mb-4'>
										<Card
											className='h-50 bg-l25-primary transition-base rounded-2 mb-4'
											shadow='sm'>
											<CardHeader className='bg-transparent py-2'>
												<CardLabel icon='Activity' iconColor='primary'>
													<CardTitle tag='h4' className='h5'>
														Tiến độ mục tiêu
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className='d-flex align-items-center pb-3'>
													<div className='flex-grow-1'>
														<div className='fw-bold fs-3 mb-0'>
															{calcProgressMission(mission, tasks)}%
															<div>
																<Progress
																	isAutoColor
																	value={calcProgressMission(
																		mission,
																		tasks,
																	)}
																	height={10}
																/>
															</div>
														</div>
														<div className='fs-5 mt-2'>
															<span className='fw-bold text-danger fs-5 me-2'>
																{calcTotalTaskByStatus(tasks, 4)}
															</span>
															cv hoàn thành trên tổng số
															<span className='fw-bold text-danger fs-5 mx-2'>
																{tasks?.length}
															</span>
															cv.
														</div>
													</div>
												</div>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col col-sm-5 text-start'>
														<div className='fw-bold fs-4 mb-10'>
															{mission?.kpi_value}
														</div>
														<div className='text-muted'>
															KPI được giao
														</div>
														<div className='fw-bold fs-4 mb-10 mt-4'>
															{calcTotalCurrentKPIOfMission(
																mission,
																tasks,
															)}
														</div>
														<div className='text-muted'>
															KPI thực tế
														</div>
													</div>
													<div className='col col-sm-7'>
														<div className='fw-bold fs-4 mb-10 mt-4'>
															{calcKPICompleteOfMission(
																mission,
																tasks,
															)}
														</div>
														<div className='text-muted'>
															Kpi thực tế đã hoàn thành
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<CardInfoCommon
											className='mb-4 pb-4 h-50'
											shadow='lg'
											title='Phòng ban phụ trách'
											icon='LayoutTextWindow'
											iconColor='info'
											isScrollable={mission?.departments?.length > 5}
											data={mission?.departments?.map((department) => {
												return {
													icon: 'TrendingFlat',
													color: 'info',
													children: (
														<div
															key={department?.name}
															className='fw-bold fs-5 mb-1'>
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
													<CardTitle>Thống kê công việc</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												{/* 	Report Component	 */}
												<ReportCommon
													col={4}
													data={[
														{
															label: 'Số công việc',
															value: tasks?.length,
														},
														{
															label: 'Đã hoàn thành',
															value: calcTotalTaskByStatus(tasks, 4),
														},
														{
															label: 'Đang thực hiện',
															value: calcTotalTaskByStatus(tasks, 2),
														},
														{
															label: 'Chờ xét duyệt',
															value: calcTotalTaskByStatus(tasks, 3),
														},
														{
															label: 'Chờ chấp nhận',
															value: calcTotalTaskByStatus(tasks, 0),
														},
														{
															label: 'Từ chối',
															value: calcTotalTaskByStatus(tasks, 5),
														},
														{
															label: 'Huỷ',
															value: calcTotalTaskByStatus(tasks, 6),
														},
														{
															label: 'Đóng',
															value: calcTotalTaskByStatus(tasks, 7),
														},
													]}
												/>
												{tasks?.length > 0 ? (
													<div className='row align-items-center'>
														<div className='col-xl-12 col-md-12'>
															<Chart
																series={[
																	calcTotalTaskByStatus(tasks, 0),
																	calcTotalTaskByStatus(tasks, 2),
																	calcTotalTaskByStatus(tasks, 4),
																	calcTotalTaskByStatus(tasks, 3),
																	calcTotalTaskByStatus(tasks, 6),
																	calcTotalTaskByStatus(tasks, 7),
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
								style={{ minHeight: 250 }}
								title='Thông tin mục tiêu'
								icon='Stream'
								iconColor='primary'
								data={[
									{
										icon: 'Pen',
										color: 'primary',
										children: (
											<Popovers desc={mission?.description} trigger='hover'>
												<div
													className='fs-5'
													style={{
														WebkitLineClamp: '2',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														WebkitBoxOrient: 'vertical',
													}}>
													{mission?.description}
												</div>
											</Popovers>
										),
									},
									{
										icon: 'ClockHistory',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Ngày bắt đầu:</span>
												{moment(`${mission?.start_time}`).format(
													'DD-MM-YYYY',
												)}
											</div>
										),
									},
									{
										icon: 'CalendarCheck',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Ngày kết thúc:</span>
												{moment(`${mission?.end_time}`).format(
													'DD-MM-YYYY',
												)}
											</div>
										),
									},
								]}
							/>

							<CardInfoCommon
								className='transition-base w-100 rounded-2 mb-4 pb-4'
								shadow='lg'
								style={{ minHeight: 250 }}
								title='Chỉ số key'
								icon='ShowChart'
								iconColor='danger'
								isScrollable={mission?.keys?.length > 3}
								data={mission?.keys?.map((key) => {
									return {
										icon: 'DoneAll',
										color: 'danger',
										children: (
											<div>
												<div className='fw-bold fs-5 mb-1'>
													{key?.key_name}
												</div>
												<div className='mt-n2' style={{ fontSize: 14 }}>
													{key?.key_value}
												</div>
											</div>
										),
									};
								})}
							/>
							<Card style={{ minHeight: 240 }} shadow='lg' className='mb-0'>
								<CardHeader className='py-2 transition-base w-100 rounded-2'>
									<CardLabel icon='NotificationsActive' iconColor='warning'>
										<CardTitle>Hoạt động gần đây</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody isScrollable className='py-2'>
									{mission?.logs
										?.slice()
										.reverse()
										.map((item) => (
											<RelatedActionCommonItem
												type={item?.type}
												time={moment(`${item?.time}`).format(
													'DD/MM/YYYY HH.mm',
												)}
												username={item?.user}
												id={item.mission_id}
												taskName={item.mission_name}
												prevStatus={item?.prev_status}
												nextStatus={item?.next_status}
											/>
										))}
								</CardBody>
							</Card>
						</Card>
					</div>
					<div className='col-md-12' style={{ marginTop: 50 }}>
						<Card>
							<Tabs defaultActiveKey='ListTask' id='uncontrolled-tab-example'>
								<Tab
									eventKey='ListTask'
									title={`Danh sách công việc (${
										tasks.filter((item) => item.status !== 3)?.length || 0
									})`}
									className='mb-3'>
									<Card>
										<CardHeader>
											<CardLabel icon='Task' iconColor='danger'>
												<CardTitle>
													<CardLabel>Danh sách công việc</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='Plus'
													tag='button'
													onClick={() => handleOpenEditForm(null)}>
													Thêm công việc
												</Button>
											</CardActions>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={tasks.filter((item) => item.status !== 3)}
											/>
										</div>
									</Card>
									<div className='p-4'>
										{!tasks.filter((item) => item.status !== 3)?.length && (
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
								<Tab
									eventKey='ListPendingTask'
									title={`Công việc chờ xác nhận (${
										tasks.filter((item) => item.status === 3)?.length || 0
									})`}
									className='mb-3'>
									<Card stretch>
										<CardHeader>
											<CardLabel icon='ContactSupport' iconColor='secondary'>
												<CardTitle>
													<CardLabel>
														Danh sách công việc chờ xác nhận
													</CardLabel>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columnsPending}
												data={tasks.filter((item) => item.status === 3)}
											/>
										</div>
									</Card>
									<div className='p-4'>
										{!tasks.filter((item) => item.status === 3)?.length && (
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
				</div>
				<TaskAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleDeleteItem(itemEdit?.id)}
					title='Xoá công việc'
					content={`Xác nhận xoá công việc <strong>${itemEdit?.name}</strong> ?`}
				/>
				<MissionAlertConfirm
					openModal={openConfirmMissionModal}
					onCloseModal={handleCloseConfirmMissionModal}
					onConfirm={() => handleDeleteMission(missionEdit?.id)}
					title='Xoá mục tiêu'
					content={`Xác nhận xoá mục tiêu <strong>${missionEdit?.name}</strong> ?`}
				/>
				<TaskFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitTaskForm}
					item={itemEdit}
				/>
				<MissionFormModal
					show={editModalMissionStatus}
					onClose={handleCloseEditMissionForm}
					onSubmit={handleSubmitMissionForm}
					item={missionEdit}
				/>
				<ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={handleUpdateStatus}
					item={itemEdit}
					isShowNote={infoConfirmModalStatus.isShowNote}
					title={infoConfirmModalStatus.title}
					subTitle={infoConfirmModalStatus.subTitle}
					status={infoConfirmModalStatus.status}
				/>
			</Page>
		</PageWrapper>
	);
};

export default MissionDetailPage;
