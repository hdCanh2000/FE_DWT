// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
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
import Icon from '../../../components/icon/Icon';
import useDarkMode from '../../../hooks/useDarkMode';
import {
	addNewTask,
	deleteTaskById,
	getAllTaksByMissionID,
	getItemById,
	updateTaskByID,
} from './services';
import {
	calculateProgressMission,
	calculateTotalFailSubTask,
	calculateTotalSubTasksInTasks,
} from '../../../utils/function';
import Button from '../../../components/bootstrap/Button';
import MissionAlertConfirm from './MissionAlertConfirm';
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

const MissionDetailPage = () => {
	const [mission, setMission] = useState({});
	const [tasks, setTasks] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const params = useParams();
	const { id } = params;

	useEffect(() => {
		async function fetchDataMissionByID() {
			const response = await getItemById(id);
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
		}
		fetchDataTaskByMissionID();
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

	// form modal
	const handleOpenEditForm = (item) => {
		setEditModalStatus(true);
		setItemEdit({ ...item });
	};

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
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
				newTasks.push(result);
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
		<PageWrapper title={`${mission?.name}`}>
			<Page container='fluid'>
				<div className='row mb-4 pb-4'>
					<div className='col-12'>
						<div className='display-4 fw-bold py-3'>{mission?.name}</div>
					</div>
					<div className='col-lg-4 mt-4'>
						<Card className='shadow-3d-info h-100'>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12 d-flex justify-content-center'>
										<h2 className='mb-0 fw-bold'>Phòng ban phụ trách</h2>
									</div>
									<div className='col-12'>
										<div className='row g-2'>
											{mission?.departments?.map((department) => (
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
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8 mt-4'>
						<Card className='shadow-3d-primary h-100'>
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
											className={`bg-l${
												darkModeStatus ? 'o25' : '25'
											}-primary bg-l${
												darkModeStatus ? 'o50' : '10'
											}-primary-hover transition-base rounded-2 mb-4`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														Tiến độ công việc
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
															{calculateProgressMission(tasks)}%
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															trên tổng số {tasks?.length} công việc (
															{calculateTotalSubTasksInTasks(tasks)}{' '}
															đầu việc)
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
											}-danger-hover transition-base rounded-2 mb-0`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel>
													<CardTitle tag='h4' className='h5'>
														Đầu việc bị huỷ/thất bại
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
															{calculateTotalFailSubTask(tasks)}
														</div>
														<div
															className='text-muted'
															style={{ fontSize: 15 }}>
															Thuộc {tasks?.length} công việc
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-md-7'>
										<Card
											className={`h-100 bg-l${
												darkModeStatus ? 'o25' : '25'
											}-info transition-base rounded-2 mb-0`}
											shadow='sm'>
											<CardHeader className='bg-transparent'>
												<CardLabel icon='ShowChart' iconColor='secondary'>
													<CardTitle>Chỉ số key</CardTitle>
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
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-12 mt-4 pt-4'>
						<Card style={{ minHeight: '60vh' }}>
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
								<table className='table table-modern mb-0' style={{ fontSize: 14 }}>
									<thead>
										<tr>
											<th align='center'>STT</th>
											<th align='center'>Tên công việc</th>
											<th align='center'>Thời gian dự kiến</th>
											<th align='center'>Thời hạn hoàn thành</th>
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
															).format('DD-MM-YYYY, HH:mm')}
														</span>
													</div>
												</td>
												<td align='center'>
													<div className='d-flex align-items-center'>
														<span className='text-nowrap'>
															{moment(
																`${item.deadline_date} ${item.deadline_time}`,
															).format('DD-MM-YYYY, HH:mm')}
														</span>
													</div>
												</td>
												<td align='center'>{item?.kpi_value}</td>
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
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button
																isLink
																color={formatColorStatus(
																	item.status,
																)}
																icon='Circle'
																className='text-nowrap'>
																{FORMAT_TASK_STATUS(item.status)}
															</Button>
														</DropdownToggle>
														<DropdownMenu>
															{Object.keys(STATUS).map((key) => (
																<DropdownItem
																	key={key}
																	onClick={() =>
																		handleUpdateStatus(
																			STATUS[key].value,
																			item,
																		)
																	}>
																	<div>
																		<Icon
																			icon='Circle'
																			color={
																				STATUS[key].color
																			}
																		/>
																		{STATUS[key].name}
																	</div>
																</DropdownItem>
															))}
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
														onClick={() => handleOpenEditForm(item)}>
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
									<Alert color='warning' isLight icon='Report' className='mt-3'>
										Không có công việc thuộc mục tiêu này!
									</Alert>
								)}
							</CardBody>
						</Card>
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

export default MissionDetailPage;
