/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import useDarkMode from '../../../hooks/useDarkMode';
import { demoPages } from '../../../menu';
import { addNewTask, updateMissionById, updateTaskByID } from './services';
import Button from '../../../components/bootstrap/Button';
import MissionAlertConfirm from './MissionAlertConfirm';
import TaskAlertConfirm from './TaskAlertConfirm';
import TaskFormModal from './TaskFormModal';
import {
	FORMAT_TASK_STATUS,
	formatColorStatus,
	formatColorPriority,
} from '../../../utils/constants';
import Progress from '../../../components/bootstrap/Progress';
import Chart from '../../../components/extras/Chart';
import '../TaskDetail/styleTaskDetail.scss';
import MissionFormModal from './MissionFormModal';
import RelatedActionCommonItem from '../../common/ComponentCommon/RelatedActionCommon';
import ReportCommon from '../../common/ComponentCommon/ReportCommon';
import CardInfoCommon from '../../common/ComponentCommon/CardInfoCommon';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';
import SubHeaderCommon from '../../common/SubHeaders/SubHeaderCommon';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchMissionById } from '../../../redux/slice/missionSlice';
import { fetchTaskListByMissionId } from '../../../redux/slice/taskSlice';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import styles from './circle.module.css';

const chartOptions = {
	chart: {
		type: 'donut',
		height: 320,
	},
	stroke: {
		width: 0,
	},
	labels: [
		'Chờ chấp nhận',
		'Đang thực hiện',
		'Đã hoàn thành',
		'Chờ xét duyệt',
		'Huỷ',
		'Đóng',
		'Tạm dừng',
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
	const params = useParams();
	const navigate = useNavigate();
	const { id } = params;
	const dispatch = useDispatch();

	const mission = useSelector((state) => state.mission.mission);
	const tasks = useSelector((state) => state.task.tasksByMisson);
	const toggleFormEdit = useSelector((state) => state.toggleForm.open);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	// const handleOpenFormEdit = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [editModalMissionStatus, setEditModalMissionStatus] = useState(false);
	const [openConfirmMissionModal, setOpenConfirmMissionModal] = useState(false);
	const [missionEdit, setMissionEdit] = useState({});
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
		title: '',
		subTitle: '',
		status: null,
		isShowNote: false,
	});

	const columns = [
		{
			title: 'Tên nhiệm vụ',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian bắt đầu',
			id: 'startDate',
			key: 'startDate',
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
					<div className='flex-shrink-0 me-3'>{`${item?.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item?.progress}
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
			title: 'Độ ưu tiên',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
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
					<span className=''>{`Cấp ${item.priority ? item.priority : 1}`}</span>
				</span>
			),
			align: 'center',
		},
		// {
		// 	title: 'Trạng thái',
		// 	id: 'status',
		// 	key: 'status',
		// 	type: 'number',
		// 	align: 'center',
		// 	render: (item) => (
		// 		<Dropdown>
		// 			<DropdownToggle hasIcon={false}>
		// 				<Button
		// 					isLink
		// 					color={formatColorStatus(item.status)}
		// 					icon='Circle'
		// 					className='text-nowrap'>
		// 					{FORMAT_TASK_STATUS(item.status)}
		// 				</Button>
		// 			</DropdownToggle>
		// 			<DropdownMenu>
		// 				{Object.keys(renderStatusTask(item.status)).map((key) => (
		// 					<DropdownItem
		// 						key={uuidv4()}
		// 						onClick={() =>
		// 							handleOpenConfirmStatusTask(item, STATUS[key].value)
		// 						}>
		// 						<div>
		// 							<Icon icon='Circle' color={STATUS[key].color} />
		// 							{STATUS[key].name}
		// 						</div>
		// 					</DropdownItem>
		// 				))}
		// 			</DropdownMenu>
		// 		</Dropdown>
		// 	),
		// },
		{
			title: '',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOnClickToEditPage(item.id)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Close'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
		},
	];

	const columnsPending = [
		{
			title: 'Tên nhiệm vụ',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/${item.id}`}>
					{item.name}
				</Link>
			),
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
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item?.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item?.progress}
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
			title: 'KPI thực tế',
			id: 'currentKpi',
			key: 'currentKpi',
			type: 'number',
			render: (item) => <span>{item?.currentKPI}</span>,
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
						<span className=''>{`Cấp ${item.priority ? item.priority : 1}`}</span>
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
			render: (item) =>
				verifyPermissionHOC(
					<div className='d-flex align-items-center'>
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
					</div>,
					['admin'],
				),
		},
	];

	useEffect(() => {
		dispatch(fetchMissionById(id));
		dispatch(fetchTaskListByMissionId(id));
	}, [dispatch, id]);

	const { themeStatus, darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	const handleOnClickToActionPage = useCallback(
		() => navigate(`${demoPages.jobsPage.subMenu.mission.path}/them-moi`),
		[navigate],
	);

	const handleOnClickToEditPage = useCallback(
		(taskId) => navigate(`${demoPages.jobsPage.subMenu.mission.path}/cap-nhat/${taskId}`),
		[navigate],
	);

	const handleClearValueForm = () => {
		setMissionEdit({
			name: '',
			description: '',
			kpiValue: '',
			startTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			endTime: moment().add(0, 'days').format('YYYY-MM-DD'),
			status: 1,
		});
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

	const handleDeleteItem = async (data) => {
		try {
			const res = await updateTaskByID({ ...data, status: -1 });
			const result = await res.data;
			handleCloseForm();
			dispatch(fetchMissionById(id));
			dispatch(fetchTaskListByMissionId(id));
			handleShowToast(`Xoá nhiệm vụ`, `Xoá nhiệm vụ ${result.name} thành công!`);
		} catch (error) {
			handleShowToast(`Xoá nhiệm vụ`, `Xoá nhiệm vụ không thành công!`);
		}
	};

	const handleDeleteMission = async (data) => {
		try {
			const newData = { ...data };
			newData.status = -1;
			const response = await updateMissionById(newData);
			navigate('/muc-tieu');
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu ${response?.data?.name} thành công!`);
		} catch (error) {
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu không thành công!`);
		}
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
				handleClearValueForm();
				handleShowToast(
					`Cập nhật nhiệm vụ!`,
					`nhiệm vụ ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật nhiệm vụ`, `Cập nhật nhiệm vụ không thành công!`);
			}
		} else {
			try {
				const response = await addNewTask({
					...data,
					missionId: params.id,
				});
				const result = await response.data;
				handleClearValueForm();
				handleShowToast(`Thêm nhiệm vụ`, `nhiệm vụ ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm nhiệm vụ`, `Thêm nhiệm vụ không thành công!`);
			}
		}
	};
	const handleSubmitMissionForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				const result = await response.data;
				dispatch(fetchMissionById(id));
				handleClearValueForm();
				handleCloseEditMissionForm();
				handleShowToast(
					`Cập nhật mục tiêu!`,
					`Mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
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
			handleClearValueForm();
			handleCloseConfirmStatusTask();
			handleShowToast(
				`Cập nhật nhiệm vụ!`,
				`nhiệm vụ ${result.name} được cập nhật thành công!`,
			);
		} catch (error) {
			handleShowToast(`Cập nhật nhiệm vụ`, `Cập nhật nhiệm vụ không thành công!`);
		}
		setOpenConfirmMissionModal(false);
	};

	// ------------			Modal confirm khi thay đổi trạng thái		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	const handleOpenConfirmStatusTask = (item, nextStatus, isShowNote = false) => {
		setOpenConfirmModalStatus(true);
		setInfoConfirmModalStatus({
			title: `Xác nhận ${FORMAT_TASK_STATUS(nextStatus)} nhiệm vụ`.toUpperCase(),
			subTitle: item?.name,
			status: nextStatus,
			isShowNote,
		});
	};

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
	};

	return (
		<PageWrapper title={`${mission?.data?.name}`}>
			<SubHeaderCommon />
			<Page container='fluid' className='overflow-hidden'>
				<div className='row mb-4 pb-4'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-4 fw-bold py-3'>{mission?.data?.name}</div>
							{verifyPermissionHOC(
								<div>
									<Button
										isOutline={!darkModeStatus}
										color='primary'
										isLight={darkModeStatus}
										className='text-nowrap mx-2'
										icon='Edit'
										onClick={() => handleOpenEditMissionForm(mission?.data)}>
										Sửa
									</Button>
									<Button
										isOutline={!darkModeStatus}
										color='danger'
										isLight={darkModeStatus}
										className='text-nowrap mx-2'
										icon='Trash'
										onClick={() =>
											handleOpenConfirmMissionModal(mission?.data)
										}>
										Xoá
									</Button>
								</div>,
								['admin'],
							)}
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
															{mission?.report?.progress}%
															<div>
																<Progress
																	isAutoColor
																	value={
																		mission?.report?.progress
																	}
																	height={10}
																/>
															</div>
														</div>
														<div className='fs-5 mt-2'>
															<span className='fw-bold text-danger fs-5 me-2'>
																{mission?.report?.completed}
															</span>
															nv hoàn thành trên tổng số
															<span className='fw-bold text-danger fs-5 mx-2'>
																{mission?.report?.total}
															</span>
															nv.
														</div>
													</div>
												</div>
												<div className='row d-flex align-items-end pb-3'>
													<div className='col col-sm-5 text-start'>
														{/* <div className='fw-bold fs-4 mb-10'>
															{mission?.data?.kpiValue}
														</div>
														<div className='text-muted'>
															KPI được giao
														</div> */}
														<div className='fw-bold fs-4 mb-10 mt-4'>
															{mission?.report?.currentKPI}
														</div>
														<div className='text-muted'>
															KPI thực tế
														</div>
													</div>
													<div className='col col-sm-7'>
														<div className='fw-bold fs-4 mb-10 mt-4'>
															{mission?.report?.completeKPI}
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
											isScrollable={mission?.data?.departments?.length > 5}
											data={mission?.data?.departments?.map(
												(department, index) => {
													if (index === 0) {
														return {
															icon: 'TrendingFlat',
															color: 'info',
															children: (
																<div className='fw-bold fs-5 mb-1'>
																	{department?.name}{' '}
																	<i className='d-block'>
																		(Chịu trách nhiệm)
																	</i>
																</div>
															),
														};
													}
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
												},
											)}
										/>
									</div>
									<div className='col-md-7'>
										<Card className='h-100'>
											<CardHeader className='py-2'>
												<CardLabel icon='DoubleArrow' iconColor='success'>
													<CardTitle>Thống kê nhiệm vụ</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody className='py-2'>
												{/* 	Report Component	 */}
												<ReportCommon
													col={4}
													data={[
														{
															label: 'Số nhiệm vụ',
															value: mission?.report?.total,
														},
														{
															label: 'Đã hoàn thành',
															value: mission?.report?.completed,
														},
														{
															label: 'Đang thực hiện',
															value: mission?.report?.inprogress,
														},
														{
															label: 'Chờ xét duyệt',
															value: mission?.report?.solved,
														},
														{
															label: 'Chờ chấp nhận',
															value: mission?.report?.pending,
														},
														{
															label: 'Từ chối',
															value: mission?.report?.rejected,
														},
														{
															label: 'Huỷ',
															value: mission?.report?.cancel,
														},
														{
															label: 'Đóng',
															value: mission?.report?.closed,
														},
														{
															label: 'Tạm dừng',
															value: mission?.report?.onhold,
														},
													]}
												/>
												{tasks?.length > 0 ? (
													<div className='row align-items-center'>
														<div className='col-xl-12 col-md-12'>
															<Chart
																series={[
																	mission?.report?.pending,
																	mission?.report?.inprogress,
																	mission?.report?.completed,
																	mission?.report?.solved,
																	mission?.report?.cancel,
																	mission?.report?.closed,
																	mission?.report?.onhold,
																]}
																options={chartOptions}
																type={chartOptions.chart.type}
																height={chartOptions.chart.height}
															/>
														</div>
													</div>
												) : (
													<div
														className='row align-items-center'
														style={{ opacity: 0.5 }}>
														<div className='col-xl-12 col-md-12'>
															<center>
																<div className={styles.circle} />
																<br />
																<h2>
																	Chưa có công việc cho mục tiêu
																	này
																</h2>
															</center>
														</div>
													</div>
												)}
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
											<p
												className='fs-5'
												// eslint-disable-next-line react/no-danger
												dangerouslySetInnerHTML={{
													__html: mission?.data?.description,
												}}
											/>
										),
									},
									{
										icon: 'ClockHistory',
										color: 'primary',
										children: (
											<div className='fs-5'>
												<span className='me-2'>Ngày bắt đầu:</span>
												{moment(`${mission?.data?.startTime}`).format(
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
												{moment(`${mission?.data?.endTime}`).format(
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
								isScrollable={mission?.data?.keys?.length > 3}
								data={mission?.data?.keys?.map((key) => {
									return {
										icon: 'DoneAll',
										color: 'danger',
										children: (
											<div key={uuidv4()}>
												<div className='fw-bold fs-5 mb-1'>
													{key?.keyName}
												</div>
												<div
													className='mt-n2 fs-5'
													style={{ fontSize: 14 }}>
													{`${key?.keyType} ${key?.keyValue}`}
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
									{mission?.data?.logs
										?.slice()
										.reverse()
										.map((item) => (
											<RelatedActionCommonItem
												key={uuidv4()}
												type={item?.type}
												time={moment(`${item?.time}`).format(
													'DD/MM/YYYY HH.mm',
												)}
												username={item?.user}
												id={item.missionId}
												taskName={item.missionName}
												prevStatus={item?.prevStatus}
												nextStatus={item?.nextStatus}
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
									title={`Danh sách nhiệm vụ (${
										tasks.filter((item) => item.status !== 3)?.length || 0
									})`}
									className='mb-3'>
									<Card>
										<CardHeader>
											<CardLabel icon='Task' iconColor='danger'>
												<CardTitle>
													<CardLabel>Danh sách nhiệm vụ</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='Plus'
													tag='button'
													onClick={handleOnClickToActionPage}>
													Thêm nhiệm vụ
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
												Không có nhiệm vụ đang chờ xác nhận!
											</Alert>
										)}
									</div>
								</Tab>
								<Tab
									eventKey='ListPendingTask'
									title={`Nhiệm vụ chờ xác nhận (${
										tasks.filter((item) => item.status === 3)?.length || 0
									})`}
									className='mb-3'>
									<Card stretch>
										<CardHeader>
											<CardLabel icon='ContactSupport' iconColor='secondary'>
												<CardTitle>
													<CardLabel>
														Danh sách nhiệm vụ chờ xác nhận
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
												Không có nhiệm vụ đang chờ xác nhận!
											</Alert>
										)}
									</div>
								</Tab>
							</Tabs>
						</Card>
					</div>
				</div>
				<TaskAlertConfirm
					openModal={toggleFormDelete}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleDeleteItem(itemEdit)}
					title='Xoá nhiệm vụ'
					content={`Xác nhận xoá nhiệm vụ <strong>${itemEdit?.name}</strong> ?`}
				/>
				<TaskFormModal
					show={toggleFormEdit}
					onClose={handleCloseForm}
					onSubmit={handleSubmitTaskForm}
					item={itemEdit}
				/>
				<MissionAlertConfirm
					openModal={openConfirmMissionModal}
					onCloseModal={handleCloseConfirmMissionModal}
					onConfirm={() => handleDeleteMission(missionEdit)}
					title='Xoá mục tiêu'
					content={`Xác nhận xoá mục tiêu <strong>${missionEdit?.name}</strong> ?`}
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
