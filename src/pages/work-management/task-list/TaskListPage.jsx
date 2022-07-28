import classNames from 'classnames';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewTask, deleteTaskById, getAllTasks, updateTaskByID } from '../mission/services';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	formatColorPriority,
	formatColorStatus,
	FORMAT_TASK_STATUS,
	STATUS,
} from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import TaskFormModal from '../mission/TaskFormModal';
import MissionAlertConfirm from '../mission/MissionAlertConfirm';
import Progress from '../../../components/bootstrap/Progress';
import ExpandRow from './ExpandRow';
import { calculateProgressTaskBySteps } from '../../../utils/function';

const minWidth200 = {
	minWidth: 200,
};

const minWidth150 = {
	minWidth: 150,
};

const minWidth100 = {
	minWidth: 100,
};

// eslint-disable-next-line react/prop-types
const Item = ({ id, name, teamName, percent, dueDate }) => {
	const navigate = useNavigate();
	const handleOnClickToProjectPage = useCallback(
		() => navigate(`../${demoPages.quanLyCongViec.subMenu.danhSach.path}/${id}`),
		[id, navigate],
	);
	return (
		<div className='col-md-6 col-xl-4 col-sm-12'>
			<Card stretch onClick={handleOnClickToProjectPage} className='cursor-pointer'>
				<CardHeader>
					<CardLabel icon='Ballot'>
						<CardTitle>{name}</CardTitle>
						<CardSubTitle>{teamName}</CardSubTitle>
					</CardLabel>
					<CardActions>
						<small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
							{dueDate}
						</small>
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className='row'>
						<div className='col-md-6'>
							{percent}%
							<Progress isAutoColor value={percent} height={10} />
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

const TaskListPage = () => {
	const [tasks, setTasks] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [expandedRows, setExpandedRows] = useState([]);
	const [expandState, setExpandState] = useState({});
	const [switchView, setSwitchView] = useState(1);

	const { themeStatus, darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	const handleEpandRow = (event, userId) => {
		const currentExpandedRows = expandedRows;
		const isRowExpanded = currentExpandedRows.includes(userId);

		const obj = {};
		// eslint-disable-next-line no-unused-expressions
		isRowExpanded ? (obj[userId] = false) : (obj[userId] = true);
		setExpandState(obj);

		const newExpandedRows = isRowExpanded
			? currentExpandedRows.filter((id) => id !== userId)
			: currentExpandedRows.concat(userId);

		setExpandedRows(newExpandedRows);
	};

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

	// form modal
	const handleOpenEditForm = (item) => {
		setEditModalStatus(true);
		setItemEdit({ ...item });
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
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

	useEffect(() => {
		async function fetchDataMissionByID() {
			const response = await getAllTasks();
			const result = await response.data;
			setTasks(result);
		}
		fetchDataMissionByID();
	}, []);

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

	const handleSubmitTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateTaskByID(data);
				const result = await response.data;
				const newTasks = [...tasks];
				setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
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
				newTasks.unshift(result);
				setTasks(newTasks);
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(`Thêm công việc`, `Công việc ${result.name} được thêm thành công!`);
			} catch (error) {
				setTasks(tasks);
				handleShowToast(`Thêm công việc`, `Thêm công việc không thành công!`);
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
			setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
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
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.danhSach.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách công việc</div>
							<div>
								<Button
									size='lg'
									className='rounded-0'
									color='info'
									icon='CardList'
									onClick={() => setSwitchView(1)}
								/>
								<Button
									size='lg'
									className='rounded-0'
									color='primary'
									icon='Table'
									onClick={() => setSwitchView(0)}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12' style={{ marginTop: 50 }}>
						{switchView === 0 ? (
							<Card style={{ minHeight: '80vh' }} stretch>
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
								<CardBody className='table-responsive' isScrollable>
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th className='text-center'>STT</th>
												<th className='text-center'>Tên công việc</th>
												<th className='text-center'>Số đầu việc</th>
												<th className='text-center'>Phòng ban</th>
												<th className='text-center'>Nhân viên</th>
												<th className='text-center'>Thời gian dự tính</th>
												<th className='text-center'>Hạn hoàn thành</th>
												<th className='text-center'>Giá trị KPI</th>
												<th className='text-center'>Độ ưu tiên</th>
												<th className='text-center'>Trạng thái</th>
												<th className='text-center'>Tiến độ</th>
												<td />
											</tr>
										</thead>
										<tbody>
											{tasks?.map((item, index) => (
												<React.Fragment key={item.id}>
													<tr>
														<td>{index + 1}</td>
														<td
															className='cursor-pointer'
															style={minWidth200}>
															<Link
																className='text-underline'
																to={`/quan-ly-cong-viec/cong-viec/${item?.id}`}>
																{item?.name}
															</Link>
														</td>
														<td align='center' style={minWidth150}>
															<Button
																className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
																onClick={(event) =>
																	handleEpandRow(event, item.id)
																}>
																<Icon
																	color='info'
																	size='sm'
																	icon={`${
																		expandState[item.id]
																			? 'CaretUpFill'
																			: 'CaretDownFill'
																	}`}
																/>
																<span
																	className='mx-2'
																	style={{ color: '#0174EB' }}>
																	{item?.subtasks?.length || 0}
																</span>
															</Button>
														</td>
														<td
															style={minWidth200}
															className='text-center'>
															{item?.department?.name}
														</td>
														<td
															style={minWidth200}
															className='text-center'>
															{item?.user?.name}
														</td>
														<td align='center'>
															<div className='d-flex align-items-center'>
																<span
																	className='text-nowrap'
																	style={{
																		background: '#A25DDC',
																		color: '#fff',
																		padding:
																			'5px 30px 5px 30px',
																		borderRadius: '2rem',
																	}}>
																	{moment(
																		`${item.estimate_date} ${item.estimate_time}`,
																	).format('DD-MM-YYYY, HH:mm')}
																</span>
															</div>
														</td>
														<td align='center'>
															<div className='d-flex align-items-center'>
																<span
																	className='text-nowrap'
																	style={{
																		background: '#569CFB',
																		color: '#fff',
																		padding:
																			'5px 30px 5px 30px',
																		borderRadius: '2rem',
																	}}>
																	{moment(
																		`${item.deadline_date} ${item.deadline_time}`,
																	).format('DD-MM-YYYY, HH:mm')}
																</span>
															</div>
														</td>
														<td align='center' style={minWidth100}>
															{item?.kpi_value}
														</td>
														<td style={minWidth100}>
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
																						STATUS[key]
																							.value,
																						item,
																					)
																				}>
																				<div>
																					<Icon
																						icon='Circle'
																						color={
																							STATUS[
																								key
																							].color
																						}
																					/>
																					{
																						STATUS[key]
																							.name
																					}
																				</div>
																			</DropdownItem>
																		),
																	)}
																</DropdownMenu>
															</Dropdown>
														</td>
														<td style={minWidth150}>
															<div className='d-flex align-items-center'>
																<div className='flex-shrink-0 me-3'>
																	{`${75}%`}
																</div>
																<Progress
																	className='flex-grow-1'
																	isAutoColor
																	value={75}
																	style={{
																		height: 10,
																	}}
																/>
															</div>
														</td>
														<td style={minWidth200}>
															<Button
																isOutline={!darkModeStatus}
																color='success'
																isLight={darkModeStatus}
																className='text-nowrap mx-2'
																icon='Edit'
																onClick={() =>
																	handleOpenEditForm(item)
																}
															/>
															<Button
																isOutline={!darkModeStatus}
																color='danger'
																isLight={darkModeStatus}
																className='text-nowrap mx-2'
																icon='Trash'
																onClick={() =>
																	handleOpenConfirmModal(item)
																}
															/>
														</td>
													</tr>
													<tr>
														<td colSpan='10'>
															{expandedRows.includes(item.id) && (
																<ExpandRow
																	key={item.id}
																	subtasks={item.subtasks}
																/>
															)}
														</td>
													</tr>
												</React.Fragment>
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
						) : (
							<div className='row'>
								{tasks.map((item) => {
									return (
										<Item
											key={item.id}
											id={item.id}
											name={item?.name}
											teamName={item.departmnent?.name}
											dueDate={`${item.deadline_date}`}
											percent={
												calculateProgressTaskBySteps(item?.subtasks) || 0
											}
											data-tour='project-item'
										/>
									);
								})}
							</div>
						)}
					</div>
				</div>
				<MissionAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleDeleteItem(itemEdit?.id)}
					title='Xoá công việc'
					content={`Xác nhận xoá công việc <strong>${itemEdit?.name}</strong> ?`}
				/>
				<TaskFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitTaskForm}
					item={itemEdit}
				/>
			</Page>
		</PageWrapper>
	);
};

export default TaskListPage;

// import React, { useCallback, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Page from '../../../layout/Page/Page';
// import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
// import { demoPages } from '../../../menu';
// import SubHeader, {
// 	SubHeaderLeft,
// 	SubHeaderRight,
// 	SubheaderSeparator,
// } from '../../../layout/SubHeader/SubHeader';
// import Badge from '../../../components/bootstrap/Badge';
// import CommonAvatarTeam from '../../../components/common/CommonAvatarTeam';
// import CardAlert from '../../../components/CardAlert/CardAlert';
// import Card, {
// 	CardActions,
// 	CardBody,
// 	CardHeader,
// 	CardLabel,
// 	CardSubTitle,
// 	CardTitle,
// } from '../../../components/bootstrap/Card';
// import Button from '../../../components/bootstrap/Button';
// import Avatar, { AvatarGroup } from '../../../components/Avatar';
// import USERS from '../../../common/data/userDummyData';
// import Icon from '../../../components/icon/Icon';
// import Progress from '../../../components/bootstrap/Progress';
// import AddTaskForm from './AddTaskForm';

// // eslint-disable-next-line react/prop-types
// const Item = ({ name, teamName, attachCount, taskCount, percent, dueDate, ...props }) => {
// 	const navigate = useNavigate();
// 	const handleOnClickToProjectPage = useCallback(
// 		() => navigate(`../${demoPages.projectManagement.subMenu.itemID.path}/1`),
// 		[navigate],
// 	);
// 	return (
// 		<div className='col-md-6 col-xl-4 col-sm-12' {...props}>
// 			<Card stretch onClick={handleOnClickToProjectPage} className='cursor-pointer'>
// 				<CardHeader>
// 					<CardLabel icon='Ballot'>
// 						<CardTitle>{name}</CardTitle>
// 						<CardSubTitle>{teamName}</CardSubTitle>
// 					</CardLabel>
// 					<CardActions>
// 						<small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
// 							{dueDate}
// 						</small>
// 					</CardActions>
// 				</CardHeader>
// 				<CardBody>
// 					<div className='row g-2 mb-3'>
// 						<div className='col-auto'>
// 							<Badge color='light' isLight>
// 								<Icon icon='AttachFile' /> {attachCount}
// 							</Badge>
// 						</div>
// 						<div className='col-auto'>
// 							<Badge color='light' isLight>
// 								<Icon icon='TaskAlt' /> {taskCount}
// 							</Badge>
// 						</div>
// 					</div>
// 					<div className='row'>
// 						<div className='col-md-6'>
// 							{percent}%
// 							<Progress isAutoColor value={percent} height={10} />
// 						</div>
// 						<div className='col-md-6 d-flex justify-content-end'>
// 							<AvatarGroup>
// 								<Avatar
// 									srcSet={USERS.GRACE.srcSet}
// 									src={USERS.GRACE.src}
// 									userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
// 									color={USERS.GRACE.color}
// 								/>
// 								<Avatar
// 									srcSet={USERS.SAM.srcSet}
// 									src={USERS.SAM.src}
// 									userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
// 									color={USERS.SAM.color}
// 								/>
// 								<Avatar
// 									srcSet={USERS.CHLOE.srcSet}
// 									src={USERS.CHLOE.src}
// 									userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
// 									color={USERS.CHLOE.color}
// 								/>

// 								<Avatar
// 									srcSet={USERS.JANE.srcSet}
// 									src={USERS.JANE.src}
// 									userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
// 									color={USERS.JANE.color}
// 								/>
// 								<Avatar
// 									srcSet={USERS.JOHN.srcSet}
// 									src={USERS.JOHN.src}
// 									userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
// 									color={USERS.JOHN.color}
// 								/>
// 								<Avatar
// 									srcSet={USERS.RYAN.srcSet}
// 									src={USERS.RYAN.src}
// 									userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
// 									color={USERS.RYAN.color}
// 								/>
// 							</AvatarGroup>
// 						</div>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</div>
// 	);
// };

// const TaskListPage = () => {
// 	const dataWork = [
// 		{
// 			id: 1,
// 			label: 'Công việc của tôi',
// 			number: null,
// 			status: 1,
// 		},
// 		{
// 			id: 2,
// 			label: 'Công việc tôi giao',
// 			number: null,
// 			status: 2,
// 		},
// 		{
// 			id: 3,
// 			label: 'Công việc được giao',
// 			number: null,
// 			status: 3,
// 		},
// 		{
// 			id: 4,
// 			label: 'Công việc chờ duyệt',
// 			number: null,
// 			status: 4,
// 		},
// 	];

// 	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
// 	const handleUpcomingEdit = () => {
// 		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
// 	};

// 	return (
// 		<PageWrapper title={demoPages.quanLyCongViec.subMenu.danhSach.text}>
// 			<SubHeader>
// 				<SubHeaderLeft>
// 					<strong className='fs-5'>Chào Bảo</strong>
// 					<SubheaderSeparator />
// 					<span>
// 						Bạn đang họp cùng{' '}
// 						<Badge color='info' isLight>
// 							2 phòng ban
// 						</Badge>{' '}
// 						với tổng cộng{' '}
// 						<Badge color='success' isLight>
// 							5 công việc
// 						</Badge>
// 						liên quan đến bạn.
// 					</span>
// 				</SubHeaderLeft>
// 				<SubHeaderRight>
// 					<CommonAvatarTeam>
// 						<strong>Các thành viên</strong> đội bạn
// 					</CommonAvatarTeam>
// 				</SubHeaderRight>
// 			</SubHeader>
// 			<Page container='fluid'>
// 				<div className='row'>
// 					<div className='col-12'>
// 						<div className='display-6 fw-bold py-3'>Danh sách công việc</div>
// 					</div>
// 					<div className='col-md-6 col-xl-4 col-sm-12'>
// 						<Card stretch>
// 							<CardHeader className='bg-transparent'>
// 								<CardLabel>
// 									<CardTitle tag='h4' className='h5'>
// 										Phòng Digital Marketing
// 									</CardTitle>
// 									<CardSubTitle tag='h5' className='h6 text-muted'>
// 										Có một cuộc họp vào lúc 12 giờ trưa.
// 									</CardSubTitle>
// 								</CardLabel>
// 								<CardActions>
// 									<Button
// 										icon='ArrowForwardIos'
// 										aria-label='Read More'
// 										hoverShadow='default'
// 										// color={darkModeStatus && 'dark'}
// 										// onClick={handleOnClickToEmployeeListPage}
// 									/>
// 								</CardActions>
// 							</CardHeader>
// 							<CardBody>
// 								<AvatarGroup>
// 									<Avatar
// 										srcSet={USERS.GRACE.srcSet}
// 										src={USERS.GRACE.src}
// 										userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
// 										color={USERS.GRACE.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.SAM.srcSet}
// 										src={USERS.SAM.src}
// 										userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
// 										color={USERS.SAM.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.CHLOE.srcSet}
// 										src={USERS.CHLOE.src}
// 										userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
// 										color={USERS.CHLOE.color}
// 									/>

// 									<Avatar
// 										srcSet={USERS.JANE.srcSet}
// 										src={USERS.JANE.src}
// 										userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
// 										color={USERS.JANE.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.JOHN.srcSet}
// 										src={USERS.JOHN.src}
// 										userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
// 										color={USERS.JOHN.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.RYAN.srcSet}
// 										src={USERS.RYAN.src}
// 										userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
// 										color={USERS.RYAN.color}
// 									/>
// 								</AvatarGroup>
// 							</CardBody>
// 						</Card>
// 					</div>
// 					<div className='col-md-6 col-xl-4 col-sm-12'>
// 						<Card stretch>
// 							<CardHeader className='bg-transparent'>
// 								<CardLabel>
// 									<CardTitle tag='h4' className='h5'>
// 										Phòng Brand Marketing
// 									</CardTitle>
// 									<CardSubTitle tag='h5' className='h6 text-muted'>
// 										Có một cuộc họp vào lúc 12 giờ trưa.
// 									</CardSubTitle>
// 								</CardLabel>
// 								<CardActions>
// 									<Button
// 										icon='ArrowForwardIos'
// 										aria-label='Read More'
// 										hoverShadow='default'
// 										// color={darkModeStatus && 'dark'}
// 										// onClick={handleOnClickToEmployeeListPage}
// 									/>
// 								</CardActions>
// 							</CardHeader>
// 							<CardBody>
// 								<AvatarGroup>
// 									<Avatar
// 										srcSet={USERS.GRACE.srcSet}
// 										src={USERS.GRACE.src}
// 										userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
// 										color={USERS.GRACE.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.SAM.srcSet}
// 										src={USERS.SAM.src}
// 										userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
// 										color={USERS.SAM.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.CHLOE.srcSet}
// 										src={USERS.CHLOE.src}
// 										userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
// 										color={USERS.CHLOE.color}
// 									/>

// 									<Avatar
// 										srcSet={USERS.JANE.srcSet}
// 										src={USERS.JANE.src}
// 										userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
// 										color={USERS.JANE.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.JOHN.srcSet}
// 										src={USERS.JOHN.src}
// 										userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
// 										color={USERS.JOHN.color}
// 									/>
// 									<Avatar
// 										srcSet={USERS.RYAN.srcSet}
// 										src={USERS.RYAN.src}
// 										userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
// 										color={USERS.RYAN.color}
// 									/>
// 								</AvatarGroup>
// 							</CardBody>
// 						</Card>
// 					</div>
// 					<div className='col-md-12 col-xl-4 col-sm-12'>
// 						<Card stretch>
// 							<CardBody className='d-flex align-items-center justify-content-center'>
// 								<Button
// 									color='info'
// 									size='lg'
// 									isLight
// 									className='w-100 h-100'
// 									icon='AddCircle'
// 									onClick={handleUpcomingEdit}>
// 									Thêm mới
// 								</Button>
// 							</CardBody>
// 						</Card>
// 					</div>
// 				</div>
// 				<div className='row my-4'>
// 					{dataWork.map((item) => {
// 						return (
// 							<div className='col-xl-3 col-md-6 col-sm-12' key={item.id}>
// 								<CardAlert {...item} />
// 							</div>
// 						);
// 					})}
// 				</div>
// 				<div className='row mt-3'>
// 					<div className='col-12'>
// 						<div className='display-6 fw-bold py-3'>Công việc phòng tôi</div>
// 					</div>
// 					<Item
// 						name='Theme'
// 						teamName='Facit Team'
// 						dueDate='Còn 3 ngày nữa'
// 						attachCount={6}
// 						taskCount={24}
// 						percent={65}
// 						data-tour='project-item'
// 					/>
// 					<Item
// 						name='Plugin'
// 						teamName='Code Team'
// 						dueDate='Còn 3 ngày nữa'
// 						attachCount={1}
// 						taskCount={4}
// 						percent={70}
// 					/>
// 					<Item
// 						name='Website'
// 						teamName='Facit Team'
// 						dueDate='Còn 3 ngày nữa'
// 						attachCount={12}
// 						taskCount={34}
// 						percent={78}
// 					/>
// 					<Item
// 						name='UI Design'
// 						teamName='Omtanke Taem'
// 						dueDate='Còn 3 ngày nữa'
// 						attachCount={4}
// 						taskCount={18}
// 						percent={43}
// 					/>
// 					<Item
// 						name='Theme'
// 						teamName='Facit Theme'
// 						dueDate='Còn 3 ngày nữa'
// 						attachCount={2}
// 						taskCount={12}
// 						percent={30}
// 					/>
// 					<div className='col-md-12 col-xl-4 col-sm-12'>
// 						<Card stretch>
// 							<CardBody className='d-flex align-items-center justify-content-center'>
// 								<Button
// 									color='info'
// 									size='lg'
// 									isLight
// 									className='w-100 h-100'
// 									icon='AddCircle'
// 									onClick={handleUpcomingEdit}>
// 									Thêm mới
// 								</Button>
// 							</CardBody>
// 						</Card>
// 					</div>
// 				</div>
// 				<AddTaskForm
// 					setUpcomingEventsEditOffcanvas={setUpcomingEventsEditOffcanvas}
// 					upcomingEventsEditOffcanvas={upcomingEventsEditOffcanvas}
// 					handleUpcomingEdit={handleUpcomingEdit}
// 					titleModal='Thêm công việc'
// 				/>
// 			</Page>
// 		</PageWrapper>
// 	);
// };

// export default TaskListPage;
