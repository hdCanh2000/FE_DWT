// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
	calcTotalTaskByStatus,
	calculateTotalSubTasksInTasks,
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
	STATUS,
	FORMAT_TASK_STATUS,
	formatColorStatus,
	formatColorPriority,
} from '../../../utils/constants';
import Progress from '../../../components/bootstrap/Progress';
import Chart from '../../../components/extras/Chart';
import '../TaskDetail/styleTaskDetail.scss';
import MissionFormModal from './MissionFormModal';

const chartOptions = {
	chart: {
		type: 'donut',
		height: 350,
	},
	stroke: {
		width: 0,
	},
	labels: ['Đang thực hiện', 'Chờ xét duyệt', 'Đã hoàn thành', 'Quá hạn/Thất bại'],
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
	const [tasksPending, setTasksPeding] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [editModalMissionStatus, setEditModalMissionStatus] = useState(false);
	const [openConfirmMissionModal, setOpenConfirmMissionModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [missionEdit, setMissionEdit] = useState({});
	const params = useParams();
	const navigate = useNavigate();
	const { id } = params;

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
			setTasksPeding(result.filter((item) => item.status === 2 || item.status === 3));
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
			try {
				const missionClone = { ...mission };
				missionClone.current_kpi_value = mission.current_kpi_value - itemEdit.kpi_value;
				const newMission = await updateMissionById(missionClone);
				setMission(newMission.data);
			} catch (error) {
				setMission(mission);
			}
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
				// update thì giá trị curent kpi = ?
				try {
					const missionClone = { ...mission };
					const temp =
						itemEdit?.kpi_value > data.kpi_value
							? mission.current_kpi_value - (itemEdit.kpi_value - data.kpi_value)
							: mission.current_kpi_value + (data.kpi_value - itemEdit.kpi_value);
					missionClone.current_kpi_value = temp;
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
				const response = await addNewTask(data);
				const result = await response.data;
				const newTasks = [...tasks];
				newTasks.push(result);
				setTasks(newTasks);
				try {
					const missionClone = { ...mission };
					missionClone.current_kpi_value = mission.current_kpi_value + data.kpi_value;
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
					`mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setMission(mission);
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		}
	};

	const handleUpdateStatus = async (status, data) => {
		try {
			const newData = { ...data };
			newData.status = status;
			const response = await updateTaskByID(newData);
			const result = await response.data;
			const newTasks = [...tasks];
			const newTasksPending = [...tasksPending];
			setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
			setTasksPeding(
				newTasksPending
					.map((item) => (item.id === data.id ? { ...result } : item))
					.filter((item) => item.status === 2 || item.status === 3),
			);
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
						<Card className='shadow-3d-primary h-100 mb-4 pb-4'>
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
											className='bg-l25-primary transition-base rounded-2 mb-4'
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='Activity' iconColor='primary'>
													<CardTitle tag='h4' className='h5'>
														Tiến độ mục tiêu
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
															{calcProgressMission(mission, tasks)}%
															<span className='text-info fs-5 fw-bold ms-3'>
																{calcTotalTaskByStatus(tasks, 1)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {tasks?.length} công việc (
															{calculateTotalSubTasksInTasks(tasks)}{' '}
															đầu việc).
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
															{mission?.current_kpi_value}
														</div>
														<div className='text-muted'>
															KPI thực tế
														</div>
													</div>
													<div className='col col-sm-7'>
														<div className='fw-bold fs-4 mb-10'>
															{calcKPICompleteOfMission(
																mission,
																tasks,
															)}
															/{mission?.current_kpi_value}
														</div>
														<div className='text-muted'>
															Kpi đã hoàn thành
														</div>
														<div>
															<Progress
																isAutoColor
																value={calcKPICompleteOfMission(
																	mission,
																	tasks,
																)}
																height={20}
															/>
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
											}-danger-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														<Icon icon='Lightning' color='danger' />
														&nbsp; Công việc bị huỷ/thất bại
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
															{Math.round(
																(calcTotalTaskByStatus(tasks, 3) *
																	100) /
																	tasks.length,
															)}
															%
															<span className='text-danger fs-5 fw-bold ms-3'>
																{calcTotalTaskByStatus(tasks, 3)}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {tasks?.length} công việc.
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
											style={{ minHeight: 200 }}>
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
													{mission?.keys?.map((item, index) => (
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
																	{tasks?.length}
																</div>
																<div className='text-muted'>
																	Số công việc
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{calcTotalTaskByStatus(
																		tasks,
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
																	{calcTotalTaskByStatus(
																		tasks,
																		0,
																	)}
																</div>
																<div className='text-muted'>
																	Đang thực hiện
																</div>
															</div>
															<div className='col'>
																<div className='fw-bold fs-2 mb-10'>
																	{calcTotalTaskByStatus(
																		tasks,
																		2,
																	)}
																</div>
																<div className='text-muted'>
																	Chờ xét duyệt
																</div>
															</div>
														</div>
													</CardBody>
												</Card>
												<div className='row align-items-center'>
													<div className='col-xl-12 col-md-12'>
														<Chart
															series={[
																calcTotalTaskByStatus(tasks, 0),
																calcTotalTaskByStatus(tasks, 2),
																calcTotalTaskByStatus(tasks, 1),
																calcTotalTaskByStatus(tasks, 3),
															]}
															options={chartOptions}
															type={chartOptions.chart.type}
															height={chartOptions.chart.height}
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
						<Card className='mb-4 shadow-3d-info' style={{ height: 400 }}>
							<CardHeader>
								<CardLabel icon='LayoutTextWindow' iconColor='info'>
									<CardTitle>Phòng ban phụ trách</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='pt-0'>
								<div className='row g-5'>
									{mission?.departments?.map((department) => (
										<div className='col-12 ms-5'>
											<div
												className='d-flex align-items-center'
												key={department.id}>
												<div className='flex-shrink-0'>
													<Icon icon='Award' size='2x' color='info' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{department.name}
													</div>
													<div
														className='text-muted'
														style={{ fontSize: 14 }}>
														{department.slug}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardBody>
						</Card>
						<Card className='shadow-3d-info h-50 mb-0'>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle>Thông tin mục tiêu</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody isScrollable>
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
													{mission.description}
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
													<span className='me-2'>Ngày bắt đầu:</span>
													{moment(`${mission?.start_time}`).format(
														'DD-MM-YYYY',
													)}
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
													<span className='me-2'>Ngày kết thúc:</span>
													{moment(`${mission?.end_time}`).format(
														'DD-MM-YYYY',
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-12' style={{ marginTop: 50 }}>
						<Card>
							<Tabs defaultActiveKey='ListTask' id='uncontrolled-tab-example'>
								<Tab
									eventKey='ListTask'
									title='Danh sách công việc'
									className='mb-3'>
									<Card style={{ minHeight: '80vh' }}>
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
										<CardBody className='table-responsive'>
											<table
												className='table table-modern mb-0'
												style={{ fontSize: 14 }}>
												<thead>
													<tr>
														<th align='center'>STT</th>
														<th align='center'>Tên công việc</th>
														<th align='center'>Thời gian dự kiến</th>
														<th align='center'>Thời hạn hoàn thành</th>
														<th align='center'>Tiến độ công việc</th>
														<th align='center'>Giá trị KPI</th>
														<th align='center'>Độ ưu tiên</th>
														<th align='center'>Trạng thái</th>
														<th align='center'>Số đầu việc</th>
														<td />
													</tr>
												</thead>
												<tbody>
													{tasks?.map((item, index) => (
														<tr key={item.id}>
															<td>{index + 1}</td>
															<td className='cursor-pointer'>
																<Link
																	className='text-underline'
																	to={`/quan-ly-cong-viec/cong-viec/${item?.id}`}>
																	{item?.name}
																</Link>
															</td>
															<td align='center'>
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
															<td align='center'>
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
															<td align='center'>
																<div className='d-flex align-items-center'>
																	<div className='flex-shrink-0 me-3'>
																		{`${calcProgressTask(
																			item,
																		)}%`}
																	</div>
																	<Progress
																		className='flex-grow-1'
																		isAutoColor
																		value={calcProgressTask(
																			item,
																		)}
																		style={{
																			height: 10,
																		}}
																	/>
																</div>
															</td>
															<td align='center'>
																{item?.kpi_value}
															</td>
															<td>
																<div className='d-flex align-items-center'>
																	<span
																		style={{
																			paddingRight: '1rem',
																			paddingLeft: '1rem',
																		}}
																		className={classNames(
																			'badge',
																			'border border-2',
																			[
																				`border-${themeStatus}`,
																			],
																			'bg-success',
																			'pt-2 pb-2 me-2',
																			`bg-${formatColorPriority(
																				item.priority,
																			)}`,
																		)}>
																		<span className=''>{`Cấp ${item.priority}`}</span>
																	</span>
																</div>
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
															<td align='center'>
																{item?.subtasks?.length || 0}
															</td>
															<td>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	icon='Edit'
																	onClick={() =>
																		handleOpenEditForm(item)
																	}>
																	Sửa
																</Button>
																<Button
																	isOutline={!darkModeStatus}
																	color='danger'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	icon='Trash'
																	onClick={() =>
																		handleOpenConfirmModal(item)
																	}>
																	Xoá
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
											{!tasks?.length && (
												<Alert
													color='warning'
													isLight
													icon='Report'
													className='mt-3'>
													Không có công việc thuộc mục tiêu này!
												</Alert>
											)}
										</CardBody>
									</Card>
								</Tab>
								<Tab
									eventKey='ListPendingTask'
									title='Công việc chờ xác nhận'
									className='mb-3'>
									<Card style={{ minHeight: '80vh' }}>
										<CardHeader>
											<CardLabel icon='Task' iconColor='danger'>
												<CardTitle>
													<CardLabel>
														Danh sách công việc chờ xác nhận
													</CardLabel>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='table-responsive'>
											<table
												className='table table-modern mb-0'
												style={{ fontSize: 14 }}>
												<thead>
													<tr>
														<th align='center'>STT</th>
														<th align='center'>Tên công việc</th>
														<th align='center'>Thời gian dự kiến</th>
														<th align='center'>Thời hạn hoàn thành</th>
														<th align='center'>Tiến độ công việc</th>
														<th align='center'>Giá trị KPI</th>
														<th align='center'>KPI thực tế</th>
														<th align='center'>Độ ưu tiên</th>
														<th align='center'>Trạng thái</th>
														<td />
													</tr>
												</thead>
												<tbody>
													{tasksPending?.map((item, index) => (
														<tr key={item.id}>
															<td>{index + 1}</td>
															<td className='cursor-pointer'>
																<Link
																	className='text-underline'
																	to={`/quan-ly-cong-viec/cong-viec/${item?.id}`}>
																	{item?.name}
																</Link>
															</td>
															<td align='center'>
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
															<td align='center'>
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
															<td align='center'>
																<div className='d-flex align-items-center'>
																	<div className='flex-shrink-0 me-3'>
																		{`${calcProgressTask(
																			item,
																		)}%`}
																	</div>
																	<Progress
																		className='flex-grow-1'
																		isAutoColor
																		value={calcProgressTask(
																			item,
																		)}
																		style={{
																			height: 10,
																		}}
																	/>
																</div>
															</td>
															<td align='center'>
																{item?.kpi_value}
															</td>
															<td align='center'>
																{item?.current_kpi_value}
															</td>
															<td>
																<div className='d-flex align-items-center'>
																	<span
																		style={{
																			paddingRight: '1rem',
																			paddingLeft: '1rem',
																		}}
																		className={classNames(
																			'badge',
																			'border border-2',
																			[
																				`border-${themeStatus}`,
																			],
																			'bg-success',
																			'pt-2 pb-2 me-2',
																			`bg-${formatColorPriority(
																				item.priority,
																			)}`,
																		)}>
																		<span className=''>{`Cấp ${item.priority}`}</span>
																	</span>
																</div>
															</td>
															<td>
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
															</td>
															<td style={{ minWidth: 200 }}>
																<Button
																	isOutline={!darkModeStatus}
																	color='success'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	icon='Check'
																	onClick={() =>
																		handleUpdateStatus(1, item)
																	}>
																	Duyệt
																</Button>
																<Button
																	isOutline={!darkModeStatus}
																	color='danger'
																	isLight={darkModeStatus}
																	className='text-nowrap mx-2'
																	icon='Trash'
																	onClick={() =>
																		handleUpdateStatus(4, item)
																	}>
																	Từ chối
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
											{!tasksPending?.length && (
												<Alert
													color='warning'
													isLight
													icon='Report'
													className='mt-3'>
													Không có công việc đang chờ xác nhận!
												</Alert>
											)}
										</CardBody>
									</Card>
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
			</Page>
		</PageWrapper>
	);
};

export default MissionDetailPage;
