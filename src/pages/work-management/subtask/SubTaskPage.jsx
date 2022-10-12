import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../components/bootstrap/Alert';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../components/bootstrap/Dropdown';
import Progress from '../../../components/bootstrap/Progress';
// import Icon from '../../../components/icon/Icon';
import useDarkMode from '../../../hooks/useDarkMode';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import {
	formatColorPriority,
	// formatColorStatus,
	// FORMAT_TASK_STATUS,
	// renderStatus,
	// STATUS,
} from '../../../utils/constants';
import ModalConfirmCommon from '../../common/ComponentCommon/ModalConfirmCommon';
import { addNewSubtask, updateSubtask } from '../TaskDetail/services';
import TaskDetailForm from '../TaskDetail/TaskDetailForm/TaskDetailForm';
import Toasts from '../../../components/bootstrap/Toasts';
import { deleteSubtaskById, getAllSubTasks } from './services';
import ComfirmSubtask from '../TaskDetail/TaskDetailForm/ComfirmSubtask';
import Search from '../../common/ComponentCommon/Search';

const SubTaskPage = () => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const { addToast } = useToasts();
	const [subtasks, setSubtasks] = useState([]);
	const [itemEdit, setItemEdit] = useState({});
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirm, set0penConfirm] = React.useState(false);
	const [deletes, setDeletes] = React.useState({});
	const [openConfirmModalStatus, setOpenConfirmModalStatus] = useState(false);
	// const [infoConfirmModalStatus, setInfoConfirmModalStatus] = useState({
	// 	title: '',
	// 	subTitle: '',
	// 	status: null,
	// 	isShowNote: false,
	// });

	async function fetchDataAllSubTasks() {
		const response = await getAllSubTasks();
		const result = await response.data;
		setSubtasks(result);
	}

	useEffect(() => {
		fetchDataAllSubTasks();
	}, []);

	const handleOnClickToActionPage = useCallback(
		() => navigate(`${demoPages.jobsPage.subMenu.task.path}/them-moi`),
		[navigate],
	);

	const handleOnClickToEditPage = useCallback(
		(subtaskId) => navigate(`${demoPages.jobsPage.subMenu.task.path}/cap-nhat/${subtaskId}`),
		[navigate],
	);

	const handleCloseEditForm = () => {
		setEditModalStatus(false);
		setItemEdit(null);
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

	// ------------			Modal confirm khi xoá		----------------------
	// ------------			Moal Confirm when delete task		----------------------
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

	// delete subtask
	const handleDelete = async (id) => {
		try {
			await deleteSubtaskById(id.id);
			handleShowToast(`Xoá đầu việc`, `Xoá đầu việc thành công!`);
		} catch (error) {
			handleShowToast(`Xoá đầu việc`, `Xoá đầu việc thất bại!`);
		}
		fetchDataAllSubTasks();
	};

	// ------------			Modal confirm khi thay đổi trạng thái		----------------------
	// ------------			Moal Confirm when change status task		----------------------

	// const handleOpenConfirmStatusTask = (item, nextStatus, isShowNote = false) => {
	// 	setOpenConfirmModalStatus(true);
	// 	setItemEdit({ ...item });
	// 	setInfoConfirmModalStatus({
	// 		title: `Xác nhận ${FORMAT_TASK_STATUS(nextStatus)} công việc`.toUpperCase(),
	// 		subTitle: item?.name,
	// 		status: nextStatus,
	// 		isShowNote,
	// 	});
	// };

	const handleCloseConfirmStatusTask = () => {
		setOpenConfirmModalStatus(false);
		setItemEdit(null);
	};

	// change status
	const handleUpdateStatus = async (status, data) => {
		try {
			const subtaskClone = { ...data };
			subtaskClone.status = status;
			const respose = await updateSubtask(subtaskClone);
			const result = await respose.data;
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Cập nhật trạng thái đầu việc ${result.name} thành công!`,
			);
			handleCloseConfirmStatusTask();
			fetchDataAllSubTasks();
		} catch (error) {
			handleCloseConfirmStatusTask();
			handleShowToast(
				`Cập nhật trạng thái!`,
				`Thao tác không thành công. Xin vui lòng thử lại!`,
				'Error',
				'danger',
			);
		}
	};

	const handleSubmitSubTaskForm = async (data) => {
		if (data.id) {
			try {
				const response = await updateSubtask(data);
				const result = await response.data;
				const newSubtasks = [...subtasks];
				setSubtasks(
					newSubtasks.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleCloseEditForm();
				handleCloseConfirmStatusTask();
				fetchDataAllSubTasks();
				handleShowToast(
					`Cập nhật đầu việc!`,
					`Đầu việc ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setSubtasks(subtasks);
				handleShowToast(`Cập nhật đầu việc`, `Cập nhật đầu việc không thành công!`);
			}
		} else {
			try {
				const response = await addNewSubtask(data);
				const result = await response.data;
				const newSubtasks = [...subtasks];
				newSubtasks.push(result);
				setSubtasks(newSubtasks);
				handleCloseEditForm();
				fetchDataAllSubTasks();
				handleCloseConfirmStatusTask();
				handleShowToast(`Thêm đầu việc`, `Đầu việc ${result.name} được thêm thành công!`);
			} catch (error) {
				setSubtasks(subtasks);
				handleShowToast(`Thêm đầu việc`, `Thêm đầu việc không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages?.dauViec?.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách đầu việc</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12' style={{ marginTop: 50 }}>
						<Card>
							<CardHeader>
								<CardLabel icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Danh sách đầu việc</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardActions>
									<Button
										color='info'
										icon='Plus'
										tag='button'
										onClick={handleOnClickToActionPage}>
										Thêm đầu việc
									</Button>
								</CardActions>
							</CardHeader>
							<div className='p-4'>
								<div style={{ maxWidth: '25%' }}>
									<Search />
								</div>
								<table className='table table-modern mb-0' style={{ fontSize: 14 }}>
									<thead>
										<tr>
											<th>STT</th>
											<th>Tên đầu việc</th>
											<th>Nhân viên phụ trách</th>
											<th className='text-center'>Hạn hoàn thành</th>
											<th className='text-center'>Điểm KPI</th>
											<th className='text-center'>Độ ưu tiên</th>
											{/* <th className='text-center'>Trạng thái</th> */}
											<th className='text-center'>Tiến độ</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{subtasks?.map((item, index) => (
											<React.Fragment key={item.id}>
												<tr>
													<td>{index + 1}</td>
													<td className='cursor-pointer'>
														<Link
															className='text-underline'
															to={`${demoPages.jobsPage.subMenu.mission.path}/dau-viec/${item?.id}`}>
															{item?.name}
														</Link>
													</td>
													<td>{item?.users[0]?.name}</td>
													<td align='center'>
														{moment(`${item.deadlineDate}`).format(
															'DD-MM-YYYY',
														)}
													</td>
													<td align='center'>{item?.kpiValue}</td>
													<td className='text-center'>
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
													</td>
													{/* <td className='text-center'>
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
																	renderStatus(item.status),
																).map((key) => (
																	<DropdownItem
																		key={key}
																		onClick={() =>
																			handleOpenConfirmStatusTask(
																				item,
																				STATUS[key].value,
																			)
																		}>
																		<div>
																			<Icon
																				icon='Circle'
																				color={
																					STATUS[key]
																						.color
																				}
																			/>
																			{STATUS[key].name}
																		</div>
																	</DropdownItem>
																))}
															</DropdownMenu>
														</Dropdown>
													</td> */}
													<td className='text-center'>
														<div className='d-flex align-items-center justify-content-center flex-column'>
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
													</td>
													<td className='text-center'>
														<Button
															isOutline={!darkModeStatus}
															color='success'
															isLight={darkModeStatus}
															className='text-nowrap mx-2'
															icon='Edit'
															onClick={() =>
																handleOnClickToEditPage(item.id)
															}
														/>
														<Button
															isOutline={!darkModeStatus}
															color='danger'
															isLight={darkModeStatus}
															className='text-nowrap mx-2'
															icon='Trash'
															onClick={() => handleOpenConfirm(item)}
														/>
													</td>
												</tr>
											</React.Fragment>
										))}
									</tbody>
								</table>
							</div>
							{!subtasks?.length && (
								<Alert color='warning' isLight icon='Report' className='mt-3'>
									Không có công việc!
								</Alert>
							)}
						</Card>
					</div>
				</div>
				<TaskDetailForm
					show={editModalStatus}
					item={itemEdit}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitSubTaskForm}
					isShowTask={!itemEdit?.id}
				/>
				<ModalConfirmCommon
					show={openConfirmModalStatus}
					onClose={handleCloseConfirmStatusTask}
					onSubmit={handleUpdateStatus}
					item={itemEdit}
					// isShowNote={infoConfirmModalStatus.isShowNote}
					// title={infoConfirmModalStatus.title}
					// subTitle={infoConfirmModalStatus.subTitle}
					// status={infoConfirmModalStatus.status}
				/>
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseComfirm}
					onConfirm={() => handleDelete(deletes)}
					title='Xoá Đầu việc'
					content={`Xác nhận xoá đầu việc <strong>${deletes?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default SubTaskPage;
