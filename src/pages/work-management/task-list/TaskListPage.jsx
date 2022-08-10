// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import {
	createSearchParams,
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import { addNewTask, deleteTaskById, getAllTasks, updateTaskByID } from '../mission/services';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	formatColorPriority,
	formatColorStatus,
	FORMAT_TASK_STATUS,
} from '../../../utils/constants';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import TaskFormModal from '../mission/TaskFormModal';
import MissionAlertConfirm from '../mission/MissionAlertConfirm';
import Progress from '../../../components/bootstrap/Progress';
import ExpandRow from './ExpandRow';
import { calcProgressTask } from '../../../utils/function';
import Badge from '../../../components/bootstrap/Badge';
import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';
import { getAllSubtasks } from '../TaskDetail/services';

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
		() => navigate(`/cong-viec/${id}`),
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
						<div className='col-auto mt-2'>
							<span>Hạn hoàn thành:</span>
						</div>
						<div className='col-auto mt-2'>
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

const TaskListPage = () => {
	const [tasks, setTasks] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [expandedRows, setExpandedRows] = useState([]);
	const [expandState, setExpandState] = useState({});
	// handle expand subtask
	const [task, setTask] = useState({});
	const [editModalStatusExpand, setEditModalStatusExpand] = useState(false);
	const [idEditExpand, setIdEditExpand] = useState(0);
	const [newWorkExpand, setNewWorkExpand] = React.useState([]);
	const [titleExpand, setTitleExpand] = useState();

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();

	const { themeStatus, darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	// Handle
	const handleOpenModalExpand = async (items, titles, taskId) => {
		setEditModalStatusExpand(true);
		setIdEditExpand(items?.id);
		setTitleExpand(titles);
		try {
			const res = await getAllSubtasks(taskId);
			setTask(res.data);
		} catch (error) {
			setTask({});
		}
	};

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
			kpiValue: '',
			estimateDate: moment().add(0, 'days').format('YYYY-MM-DD'),
			estimateTime: '08:00',
			deadlineDate: moment().add(0, 'days').format('YYYY-MM-DD'),
			deadlineTime: '08:00',
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

	// const handleUpdateStatus = async (status, data) => {
	// 	try {
	// 		const newData = { ...data };
	// 		newData.status = status;
	// 		const response = await updateTaskByID(newData);
	// 		const result = await response.data;
	// 		const newTasks = [...tasks];
	// 		setTasks(newTasks.map((item) => (item.id === data.id ? { ...result } : item)));
	// 		handleClearValueForm();
	// 		handleCloseEditForm();
	// 		handleShowToast(
	// 			`Cập nhật công việc!`,
	// 			`Công việc ${result.name} được cập nhật thành công!`,
	// 		);
	// 	} catch (error) {
	// 		setTasks(tasks);
	// 		handleShowToast(`Cập nhật công việc`, `Cập nhật công việc không thành công!`);
	// 	}
	// };

	const handleClickSwitchView = (view) => {
		navigate({
			pathname: location.pathname,
			search: `?${createSearchParams({
				view,
			})}`,
		});
	};

	return (
		<PageWrapper title={demoPages.quanLyCongViec.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách công việc</div>
							<div>
								<Button
									size='lg'
									className='rounded-0'
									color='primary'
									icon='Table'
									onClick={() => handleClickSwitchView(1)}
								/>
								<Button
									size='lg'
									className='rounded-0'
									color='info'
									icon='CardList'
									onClick={() => handleClickSwitchView(2)}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12' style={{ marginTop: 50 }}>
						{parseInt(searchParams.get('view'), 10) === 1 ||
						!searchParams.get('view') ? (
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
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th className='text-center'>STT</th>
												<th>Tên công việc</th>
												<th className='text-center'>Số đầu việc</th>
												<th className='text-center'>Phòng ban</th>
												<th className='text-center'>Nhân viên</th>
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
														<td className='cursor-pointer'>
															<Link
																className='text-underline'
																to={`/cong-viec/${item?.id}`}>
																{item?.name}
															</Link>
														</td>
														<td align='center'>
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
														<td className='text-center'>
															{item?.department?.name}
														</td>
														<td className='text-center'>
															{item?.user?.name}
														</td>
														<td align='center'>
															{moment(`${item.deadlineDate}`).format(
																'DD-MM-YYYY',
															)}
														</td>
														<td align='center'>{item?.kpiValue}</td>
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
															<Button
																isLink
																color={formatColorStatus(
																	item.status,
																)}
																icon='Circle'
																className='text-nowrap'>
																{FORMAT_TASK_STATUS(item.status)}
															</Button>
														</td>
														<td>
															<div className='d-flex align-items-center flex-column'>
																<div className='flex-shrink-0 me-3'>{`${calcProgressTask(
																	item,
																)}%`}</div>
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
														</td>
														<td>
															<Button
																isOutline={!darkModeStatus}
																color='success'
																isLight={darkModeStatus}
																className='text-nowrap mx-2'
																icon='Edit'
																isDisable={
																	item.status === 4 ||
																	item.status === 7 ||
																	item.status === 3
																}
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
														<td
															colSpan='11'
															style={{ paddingLeft: 50 }}>
															{expandedRows.includes(item?.id) && (
																<>
																	<ExpandRow
																		key={item.id}
																		subtasks={
																			!isEmpty(task)
																				? task?.subtasks
																				: item?.subtasks
																		}
																		taskId={item.id}
																		onOpenModal={
																			handleOpenModalExpand
																		}
																	/>
																	<TaskDetailForm
																		title={titleExpand}
																		setTask={setTask}
																		task={task}
																		setEditModalStatus={
																			setEditModalStatusExpand
																		}
																		editModalStatus={
																			editModalStatusExpand
																		}
																		id={item.id}
																		idEdit={idEditExpand}
																		newWork={newWorkExpand}
																		setNewWork={
																			setNewWorkExpand
																		}
																	/>
																</>
															)}
														</td>
													</tr>
												</React.Fragment>
											))}
										</tbody>
									</table>
								</div>
								{!tasks?.length && (
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										Không có công việc!
									</Alert>
								)}
							</Card>
						) : (
							<div className='row'>
								{tasks.map((item) => {
									return (
										<Item
											key={item?.id}
											keys={item?.keys}
											departmentsRelated={item?.departmentsRelated}
											usersRelated={item?.usersRelated}
											id={item?.id}
											name={item?.name}
											teamName={`${item?.department?.name} - ${item?.user?.name}`}
											dueDate={`${item?.deadlineDate}`}
											percent={calcProgressTask(item) || 0}
											data-tour='project-item'
										/>
									);
								})}
								<div className='col-md-12 col-xl-4 col-sm-12'>
									<Card stretch>
										<CardBody className='d-flex align-items-center justify-content-center'>
											<Button
												color='info'
												size='lg'
												isLight
												className='w-100 h-100'
												icon='AddCircle'
												onClick={() => handleOpenEditForm(null)}>
												Thêm công việc
											</Button>
										</CardBody>
									</Card>
								</div>
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
