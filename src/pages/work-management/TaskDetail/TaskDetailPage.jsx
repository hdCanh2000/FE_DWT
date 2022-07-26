// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../components/bootstrap/Dropdown';
import { updateSubtasks, getAllSubtasks } from './services';
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
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
// import TaskProgress from '../task-management/TaskProgress';
import TaskDetailForm from './TaskDetailForm/TaskDetailForm';
// import COLORS from '../../../common/data/enumColors';
import dummyEventsData from '../../../common/data/dummyEventsData';
// import { priceFormat } from '../../../helpers/helpers';
import { getUserDataWithId } from '../../../common/data/userDummyData';
import useDarkMode from '../../../hooks/useDarkMode';
import { calculateProgressTaskBySteps } from '../../../utils/function';

const TaskDetailPage = () => {
	// State 
	const [task, setTask] = useState({});
	const { darkModeStatus } = useDarkMode();
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [idEdit, setIdEdit] = useState(0);
	const [title, setTitle] = useState();
	const params = useParams();
	const data = getUserDataWithId(params?.id);
	const [subtask, setSubTask] = React.useState();
	const userTasks = dummyEventsData.filter((f) => f.assigned.username === data.username);
	// Data
	React.useEffect(() => {
		const fetchSubtasks = async (id) => {
			const res = await getAllSubtasks(id);
			setTask(res.data);
		}
		fetchSubtasks(parseInt(params?.id, 10));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		setSubTask(task.subtasks)
	}, [task]);

	function color(props) {
		if (props === 0) {
			return { name: "Đang thực hiện", color: "primary" }
		}
		if (props === 1) {
			return { name: "Đã hoàn thành", color: "success" }
		}
		if (props === 2) {
			return { name: "Bế tắc", color: "danger" }
		}
		if (props === 3) {
			return { name: "Xem xét", color: "warning" }
		}
		return 'light'
	}

	function priority(props) {
		if (props === 1) {
			return "success"
		}
		if (props === 2) {
			return "primary"
		}
		if (props === 3) {
			return "danger"
		}
		if (props === 4) {
			return "warning"
		}
		if (props === 5) {
			return "warning"
		}
		return 'light'
	}
	// Handle
	const handleOpenModal = (id, titles) => {
		setEditModalStatus(true);
		setIdEdit(id);
		setTitle(titles);
	}

	const handleDelete = async (idDelete) => {
		const newSubTasks = subtask.filter((item) => item.id !== idDelete);
		const taskValue = JSON.parse(JSON.stringify(task));
		const newData = Object.assign(taskValue, { subtasks: newSubTasks });
		const respose = await updateSubtasks(parseInt(params?.id, 10), newData);
		const result = await respose.data;
		setTask(result);
	}
	return (
		<PageWrapper title={`${task?.name}`}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='display-4 fw-bold py-3'>{task?.name}</div>
					</div>
					<div className='col-lg-4'>
						<Card className='shadow-3d-info'>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle>Phòng ban</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12'>
										<div className='row g-2'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='LayoutTextWindow' size='3x' color='info' />
														{/* <h2>Departments</h2> */}
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-2 mb-0'>
															{task?.department?.name}
														</div>
														{/* <div className='text-muted fs-3' >
															{task?.user?.name}
														</div> */}
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='TextLeft' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														{task?.departments_related?.map((item) => {
															return (
																<div key={item.id} className='fw-bold fs-5 mb-0'>
																	{item.name}
																</div>
															)
														})}
														{/* <div className='text-muted'>
															{task?.user?.name}
														</div> */}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card className='shadow-3d-info'>
							<CardHeader>
								<CardLabel icon='Stream' iconColor='warning'>
									<CardTitle>Nhân viên</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12'>
										<div className='row g-2'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='LayoutTextWindow' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-2 mb-0'>
															{task?.user?.name}
														</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='TextLeft' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														{task?.users_related?.map((item) => {
															return (
																<div key={item.id} className='fw-bold fs-5 mb-0'>
																	{item.name}
																</div>
															)
														})}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>
						<Card className='shadow-3d-primary'>
							<CardHeader>
								<CardLabel icon='Summarize' iconColor='success'>
									<CardTitle tag='h4' className='h5'>
										Tổng kết
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-6'>
										<Card
											className={`bg-l${darkModeStatus ? 'o25' : '25'
												}-primary bg-l${darkModeStatus ? 'o50' : '10'
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
															{calculateProgressTaskBySteps(task?.subtasks)}
															<span className='text-info fs-5 fw-bold ms-3'>
																{task?.subtasks?.length}
																<Icon icon='TrendingFlat' />
															</span>
														</div>
														<div className='text-muted'>
															trên tổng số {task?.subtasks?.length} đầu việc .
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
										<Card
											className={`bg-l${darkModeStatus ? 'o25' : '25'
												}-danger bg-l${darkModeStatus ? 'o50' : '10'
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
															61
															<span className='text-danger fs-5 fw-bold ms-3'>
																-50%
																<Icon icon='TrendingDown' />
															</span>
														</div>
														<div className='text-muted'>
															Thuộc 6 công việc
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-md-6'>
										<Card>
											<CardHeader>
												<CardLabel icon='ShowChart' iconColor='secondary'>
													<CardTitle>Chỉ số key</CardTitle>
												</CardLabel>
												<CardActions>
													Only in <strong>{moment().format('MMM')}</strong>.
												</CardActions>
											</CardHeader>
											<CardBody>
												<div className='row g-4 align-items-center'>
													<div className='col-xl-6'>
														<div
															className={classNames(
																'd-flex align-items-center rounded-2 p-3',
																{
																	'bg-l10-warning': !darkModeStatus,
																	'bg-lo25-warning': darkModeStatus,
																},
															)}>
															<div className='flex-shrink-0'>
																<Icon icon='DoneAll' size='3x' color='warning' />
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-3 mb-0'>12345</div>
																<div className='text-muted mt-n2 truncate-line-1'>
																	Đơn hàng
																</div>
															</div>
														</div>
													</div>
													<div className='col-xl-6'>
														<div
															className={classNames(
																'd-flex align-items-center rounded-2 p-3',
																{
																	'bg-l10-info': !darkModeStatus,
																	'bg-lo25-info': darkModeStatus,
																},
															)}>
															<div className='flex-shrink-0'>
																<Icon icon='Savings' size='3x' color='info' />
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-3 mb-0'>1,280 tỷ</div>
																<div className='text-muted mt-n2 truncate-line-1'>
																	Doanh thu
																</div>
															</div>
														</div>
													</div>
													<div className='col-xl-6'>
														<div
															className={classNames(
																'd-flex align-items-center rounded-2 p-3',
																{
																	'bg-l10-primary': !darkModeStatus,
																	'bg-lo25-primary': darkModeStatus,
																},
															)}>
															<div className='flex-shrink-0'>
																<Icon
																	icon='Celebration'
																	size='3x'
																	color='primary'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-3 mb-0'>76</div>
																<div className='text-muted mt-n2 truncate-line-1'>
																	Khách mời
																</div>
															</div>
														</div>
													</div>
													<div className='col-xl-6'>
														<div
															className={classNames(
																'd-flex align-items-center rounded-2 p-3',
																{
																	'bg-l10-success': !darkModeStatus,
																	'bg-lo25-success': darkModeStatus,
																},
															)}>
															<div className='flex-shrink-0'>
																<Icon icon='Timer' size='3x' color='success' />
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-3 mb-0'>427</div>
																<div className='text-muted mt-n2'>Giờ làm việc</div>
															</div>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardLabel icon='Task' iconColor='danger'>
								<CardTitle>
									<CardLabel>Danh sách đầu việc</CardLabel>
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
						<CardBody>
							<div className='table-responsive'>
								<table className='table table-modern mb-0' style={{ textAlign: 'center' }}>
									<thead>
										<tr>
											<th>Ngày tạo</th>
											<th>Tên đầu việc</th>
											<th>Độ ưu tiên</th>
											<th>Kpi</th>
											<th>Hạn hoàn thành</th>
											<th>Tiến độ công việc</th>
											<th>Trạng thái</th>
											<th>Hành động</th>
										</tr>
									</thead>
									<tbody>
										{subtask ? '' : <tr style={{ textAlign: 'center' }}><td>Chưa có đầu việc nào</td></tr>}
										{subtask?.map((item) => (
											<tr key={item.id}>
												<td>
													<div className='d-flex align-items-center'>
														<span className='text-nowrap'>
															{item.estimate_time} {' '}{item.estimate_date}`,
														</span>
													</div>
												</td>
												<td>
													<div>
														<div>{item.name}</div>
														<div className='small text-muted'>
															{item.departmnent?.name}
														</div>
													</div>
												</td>
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
															`bg-${priority(item.priority)}`,
														)}>
														<span className=''>{`Cấp ${item.priority}`}</span>
													</span>
												</td>
												<td>{item.kpi_value}</td>
												<td>{item.deadline_time}{' '}{item.deadline_date}</td>
												<td>
													<Progress isAutoColor value={item.percent} height={10} />
												</td>
												<td>
													<Icon
														icon='Circle'
														color={color(item.status).color} />
													{color(item.status).name}
												</td>
												<td>
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button icon='MoreHoriz' />
														</DropdownToggle>
														<DropdownMenu isAlignmentEnd>
															<DropdownItem>
																<Button icon='Delete' onClick={() => handleDelete(item.id)}>
																	Delete
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button icon='Edit' onClick={() => handleOpenModal(item.id, 'edit')}>
																	Edit
																</Button>
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{!userTasks.length && (
								<Alert color='warning' isLight icon='Report' className='mt-3'>
									There is no scheduled and assigned task.
								</Alert>
							)}
						</CardBody>
					</Card>
				</div>
				<TaskDetailForm
					title={title}
					setTask={setTask}
					task={task}
					setEditModalStatus={setEditModalStatus}
					editModalStatus={editModalStatus}
					id={parseInt(params?.id, 10)}
					idEdit={idEdit} />
			</Page>
		</PageWrapper>
	);
};
export default TaskDetailPage;