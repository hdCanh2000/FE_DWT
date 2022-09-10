// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import {
	useNavigate,
	Link,
	createSearchParams,
	useSearchParams,
	useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Toasts from '../../../components/bootstrap/Toasts';
import Button from '../../../components/bootstrap/Button';
import { addNewMission, updateMissionById } from './services';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import MissionAlertConfirm from './MissionAlertConfirm';
import MissionFormModal from './MissionFormModal';
import Badge from '../../../components/bootstrap/Badge';
import Progress from '../../../components/bootstrap/Progress';
import Alert from '../../../components/bootstrap/Alert';
import useDarkMode from '../../../hooks/useDarkMode';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import MissionChartReport from '../../dashboard/admin/MissionChartReport';
import TaskChartReport from '../../dashboard/admin/TaskChartReport';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchMissionList, fetchMissionReport } from '../../../redux/slice/missionSlice';
import { fetchTaskListLates, fetchTaskReport } from '../../../redux/slice/taskSlice';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';

const Item = ({
	id,
	name,
	teamName,
	percent,
	dueDate,
	departmentsRelated = [],
	usersRelated = [],
	...props
}) => {
	const navigate = useNavigate();
	const handleOnClickToProjectPage = useCallback(
		() => navigate(`${demoPages.jobsPage.subMenu.mission.path}/${id}`),
		[id, navigate],
	);
	return (
		<div className='col-md-6 col-xl-4 col-sm-12' {...props}>
			<Card stretch onClick={handleOnClickToProjectPage} className='cursor-pointer'>
				<CardHeader>
					<CardLabel icon='Ballot'>
						<CardTitle>{name}</CardTitle>
						<CardSubTitle>{`Phụ trách: ${teamName}`}</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<div className='row g-2 align-items-center'>
						<div className='col-auto mb-3'>
							<span>Hạn hoàn thành:</span>
						</div>
						<div className='col-auto mb-3'>
							<small
								style={{ fontSize: 14 }}
								className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
								{moment(`${dueDate}`).format('DD-MM-YYYY')}
							</small>
						</div>
					</div>
					{departmentsRelated?.length > 0 && (
						<div className='row g-2 align-items-center'>
							<div className='col-auto mt-2'>
								<span>Phòng ban:</span>
							</div>
							{departmentsRelated?.map((k, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div key={index} className='col-auto mt-2'>
									<Badge
										isLight
										color='primary'
										className='px-3 py-3'
										style={{ fontSize: 14 }}>
										{k?.name}
									</Badge>
								</div>
							))}
						</div>
					)}
					{usersRelated?.length > 0 && (
						<div className='row g-2 mt-2 align-items-center'>
							<div className='col-auto mt-2'>
								<span>Nhân viên:</span>
							</div>
							{usersRelated?.map((k, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div key={index} className='col-auto mt-2'>
									<Badge
										isLight
										color='danger'
										className='px-3 py-3'
										style={{ fontSize: 14 }}>
										{k?.name}
									</Badge>
								</div>
							))}
						</div>
					)}
					<div className='row mt-2'>
						<div className='col-md-12'>
							{percent}%
							<Progress isAutoColor value={percent} height={10} />
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

const MissionPage = () => {
	const { addToast } = useToasts();
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [departmentSelect] = useState(1);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const missions = useSelector((state) => state.mission?.missions);
	const missionReport = useSelector((state) => state.mission?.missionReport);
	const latestTasks = useSelector((state) => state.task?.taskLates);
	const taskReport = useSelector((state) => state.task?.taskReport);
	const toggleFormEdit = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const navigateToDetailPage = useCallback(
		(page) => navigate(`${demoPages.jobsPage.subMenu.target.path}/${page}`),
		[navigate],
	);
	console.log(demoPages,'demoPages');
	useEffect(() => {
		dispatch(fetchMissionList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchMissionReport());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchTaskListLates());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchTaskReport(departmentSelect));
	}, [departmentSelect, dispatch]);

	const handleOpenFormEdit = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const columns = [
		{
			title: 'Tên mục tiêu',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link className='text-underline' to={`${demoPages.quanLyCongViec.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian bắt đầu',
			id: 'startTime',
			key: 'startTime',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Thời gian kết thúc',
			id: 'endTime',
			key: 'endTime',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ mục tiêu',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
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
			id: 'currentKPI',
			key: 'currentKPI',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI đã hoàn thành',
			id: 'completeKPI',
			key: 'completeKPI',
			type: 'number',
			align: 'center',
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
							icon='Edit'
							onClick={() => handleOpenFormEdit(item)}>
							Sửa
						</Button>
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2'
							icon='Close'
							onClick={() => handleOpenConfirmModal(item)}>
							Đóng
						</Button>
					</div>,
					['admin'],
				),
		},
	];

	// confirm modal
	const handleOpenConfirmModal = () => {
		setOpenConfirmModal(true);
	};

	const handleCloseConfirmModal = () => {
		setOpenConfirmModal(false);
	};

	const handleCloseItem = async (data) => {
		if (data.status === 1) {
			try {
				const newData = data;
				newData.status = 0;
				await updateMissionById(data);
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseConfirmModal();
				handleShowToast(`Đóng mục tiêu`, `Đóng mục tiêu thành công!`);
			} catch (error) {
				handleCloseConfirmModal();
				handleShowToast(`Đóng mục tiêu`, `Đóng mục tiêu không thành công!`);
			}
		} else {
			try {
				const newData = data;
				newData.status = 1;
				await updateMissionById(data);
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseConfirmModal();
				handleShowToast(`Mở mục tiêu`, `Mở mục tiêu thành công!`);
			} catch (error) {
				handleCloseConfirmModal();
				handleShowToast(`Mở mục tiêu`, `Mở mục tiêu không thành công!`);
			}
		}
	};

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

	const handleSubmitMissionForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateMissionById(data);
				const result = await response.data;
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseForm();
				handleShowToast(
					`Cập nhật mục tiêu!`,
					`mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				const result = await response.data;
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseForm();
				handleShowToast(`Thêm mục tiêu`, `mục tiêu ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm mục tiêu`, `Thêm mục tiêu không thành công!`);
			}
		}
	};

	const handleClickSwitchView = (view) => {
		navigate({
			pathname: location.pathname,
			search: `?${createSearchParams({
				view,
			})}`,
		});
	};

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.target.text}>
			<Page container='fluid'>
				{missions?.length > 0 && (
					<div className='row'>
						<div className='col-12'>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='display-6 fw-bold py-3'>Danh sách mục tiêu</div>
								<div>
									<Button
										size='lg'
										className='rounded-0'
										color='info'
										icon='CardList'
										onClick={() => handleClickSwitchView(1)}
									/>
									<Button
										size='lg'
										className='rounded-0'
										color='primary'
										icon='Table'
										onClick={() => handleClickSwitchView(2)}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-4'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<MissionChartReport data={missionReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-8'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê công việc thuộc mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={taskReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-12'>
							<Card className='mb-8'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê công việc thuộc mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={taskReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager'],
					)}
				</div>
				{parseInt(searchParams.get('view'), 10) === 1 || !searchParams.get('view') ? (
					<div className='row'>
						{missions?.map((item) => (
							<div className='col-md-6 col-xl-4 col-sm-12' key={item?.id}>
								<Card stretch className='cursor-pointer'>
									<CardHeader className='bg-transparent py-0'>
										<CardLabel
											icon='StarOutline'
											className='pt-4 pb-2 w-100 align-items-start'
											onClick={() => navigateToDetailPage(item?.id)}>
											<CardTitle tag='h4' className='h4'>
												{item?.name}
											</CardTitle>
											<CardSubTitle style={{ fontSize: 14 }} className='mt-2'>
												<div className='d-flex'>
													<div className='me-2'>
														Số CV:
														<span className='text-danger fw-bold ps-2'>
															{item?.totalTask || 0}
														</span>
													</div>
													<div className='me-2'>
														Giá trị KPI:
														<span className='text-danger fw-bold ps-2'>
															{item?.kpiValue || 0}
														</span>
													</div>
													<div>
														KPI thực tế:
														<span className='text-danger fw-bold ps-2'>
															{item.currentKPI}
														</span>
													</div>
												</div>
												<div className='d-flex '>
													<div>
														Trạng thái:
														<span
															className={
																item.status === 1
																	? 'text-success fw-bold ps-2'
																	: 'text-danger fw-bold ps-2'
															}>
															{item.status === 1
																? 'ACTIVE'
																: 'IN ACTIVE'}
														</span>
													</div>
												</div>
											</CardSubTitle>
										</CardLabel>
										{verifyPermissionHOC(
											<CardActions>
												<Dropdown>
													<DropdownToggle hasIcon={false}>
														<Button
															color='dark'
															isLink
															hoverShadow='default'
															icon='MoreHoriz'
															aria-label='More Actions'
														/>
													</DropdownToggle>
													<DropdownMenu isAlignmentEnd>
														<DropdownItem>
															<Button
																disabled={item.status === 0}
																icon='Edit'
																tag='button'
																onClick={() =>
																	handleOpenFormEdit(item)
																}>
																Sửa mục tiêu
															</Button>
														</DropdownItem>
														<DropdownItem>
															<Button
																icon={
																	item.status === 0
																		? 'Check'
																		: 'Close'
																}
																tag='button'
																onClick={() =>
																	handleOpenFormDelete(item)
																}>
																{item.status === 0
																	? 'Mở mục tiêu'
																	: 'Đóng mục tiêu'}
															</Button>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</CardActions>,
											['admin'],
										)}
									</CardHeader>
									<CardBody
										className='pt-2 pb-4'
										onClick={() => navigateToDetailPage(item?.id)}>
										<div className='row'>
											<div className='col-md-12'>
												<div className='d-flex align-items-center jusify-content-start'>
													<small
														style={{ fontSize: 14 }}
														className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
														{moment(`${item?.startTime}`).format(
															'DD-MM-YYYY',
														)}
													</small>
													<span style={{ fontSize: 14 }} className='px-2'>
														-
													</span>
													<small
														style={{ fontSize: 14 }}
														className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
														{moment(`${item?.endTime}`).format(
															'DD-MM-YYYY',
														)}
													</small>
												</div>
											</div>
										</div>
										<div className='row'>
											{item?.departments.slice(0, 6)?.map((k, index) => (
												// eslint-disable-next-line react/no-array-index-key
												<div key={index} className='col-auto mt-2'>
													<Badge
														isLight
														color='primary'
														className='px-3 py-3'
														style={{ fontSize: 14 }}>
														{k?.name}
													</Badge>
												</div>
											))}
										</div>
										<div className='row mt-4'>
											<div className='col-md-12'>
												{item.progress}
												%
												<Progress
													isAutoColor
													value={item.progress}
													height={10}
												/>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						))}
						{verifyPermissionHOC(
							<div className='col-md-12 col-xl-4 col-sm-12'>
								<Card stretch>
									<CardBody className='d-flex align-items-center justify-content-center'>
										<Button
											color='info'
											size='lg'
											isLight
											className='w-100 h-100'
											icon='AddCircle'
											onClick={() => handleOpenFormEdit(null)}>
											Thêm mục tiêu
										</Button>
									</CardBody>
								</Card>
							</div>,
							['admin'],
						)}
					</div>
				) : (
					<div className='row'>
						<div className='col-12'>
							<Card>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel>Danh sách mục tiêu</CardLabel>
										</CardTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<CardActions>
											<Button
												color='info'
												icon='Plus'
												tag='button'
												onClick={() => handleOpenFormEdit(null)}>
												Thêm mục tiêu
											</Button>
										</CardActions>,
										['admin'],
									)}
								</CardHeader>
								<div className='p-4'>
									<TableCommon
										className='table table-modern mb-0'
										columns={columns}
										data={missions}
									/>
								</div>
								{!missions?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										Không có mục tiêu!
									</Alert>
								)}
							</Card>
						</div>
					</div>
				)}
				<div className='row mt-4'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Công việc mới cập nhật</div>
					</div>
					{latestTasks?.map((item) => {
						return (
							<Item
								key={item?.id}
								keys={item?.keys}
								departmentsRelated={item?.departments?.slice(1)}
								usersRelated={item?.users?.slice(1)}
								id={item?.id}
								name={item?.name}
								teamName={`${item?.departments[0]?.name} - ${item?.users[0]?.name}`}
								dueDate={`${item?.deadlineDate}`}
								percent={item.progress || 0}
								data-tour='project-item'
							/>
						);
					})}
				</div>
				<MissionAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleCloseItem(itemEdit)}
					title={itemEdit?.status === 1 ? 'Đóng mục tiêu' : 'Mở mục tiêu'}
					content={
						itemEdit?.status === 1
							? `Xác nhận đóng mục tiêu <strong>${itemEdit?.name}</strong> ?`
							: `Xác nhận mở mục tiêu <strong>${itemEdit?.name}</strong> ?`
					}
				/>
				<MissionFormModal
					show={toggleFormEdit}
					onClose={handleCloseForm}
					onSubmit={handleSubmitMissionForm}
					item={itemEdit}
				/>
			</Page>
		</PageWrapper>
	);
};

export default MissionPage;
