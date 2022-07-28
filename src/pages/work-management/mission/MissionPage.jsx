import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
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
import {
	addNewMission,
	deleteMissionById,
	getAllMission,
	getLatestTasks,
	updateMissionById,
	getAllTasks,
} from './services';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import MissionAlertConfirm from './MissionAlertConfirm';
import MissionFormModal from './MissionFormModal';
import Badge from '../../../components/bootstrap/Badge';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import { calcProgressMission, calcProgressTask } from '../../../utils/function';

const iconColors = [
	{
		index: 1,
		color: 'primary',
		icon: 'AutoAwesome',
	},
	{
		index: 2,
		color: 'danger',
		icon: 'Beenhere',
	},
	{
		id: 3,
		color: 'success',
		icon: 'Bolt',
	},
];

// eslint-disable-next-line react/prop-types
const Item = ({ id, name, keys = [], teamName, percent, dueDate, ...props }) => {
	const navigate = useNavigate();
	const handleOnClickToProjectPage = useCallback(
		() => navigate(`/quan-ly-cong-viec/cong-viec/${id}`),
		[id, navigate],
	);
	return (
		<div className='col-md-6 col-xl-4 col-sm-12' {...props}>
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
					<div className='row g-2 mt-3'>
						{keys?.map((k, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div key={index} className='col-auto'>
								<Badge
									isLight
									color={iconColors[index].color}
									className='px-3 py-2'>
									<Icon
										icon={iconColors[index].icon}
										size='lg'
										className='me-1'
									/>
									{k.key_name}
								</Badge>
							</div>
						))}
					</div>
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

const MissionPage = () => {
	const { addToast } = useToasts();
	const [missions, setMissions] = useState([]);
	const [missionsWithTask, setMissionsWithTask] = useState([]);
	const [latestTasks, setLatestTasks] = useState([]);
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [itemEdit, setItemEdit] = useState({});

	const navigate = useNavigate();
	const navigateToDetailPage = useCallback(
		(page) => navigate(`/muc-tieu/chi-tiet/${page}`),
		[navigate],
	);
	const handleClearValueForm = () => {
		setItemEdit({
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

	const handleDeleteItem = async (id) => {
		try {
			await deleteMissionById(id);
			const newState = [...missions];
			setMissions(newState.filter((item) => item.id !== id));
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
				const newMissions = [...missions];
				setMissions(
					newMissions.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(
					`Cập nhật mục tiêu!`,
					`mục tiêu ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				const result = await response.data;
				const newMissions = [...missions];
				newMissions.push(result);
				setMissions(newMissions);
				handleClearValueForm();
				handleCloseEditForm();
				handleShowToast(`Thêm mục tiêu`, `mục tiêu ${result.name} được thêm thành công!`);
			} catch (error) {
				setMissions(missions);
				handleShowToast(`Thêm mục tiêu`, `Thêm mục tiêu không thành công!`);
			}
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllMission();
			const result = await response.data;
			setMissions(result);
		};
		fetchData();
	}, []);

	const mergeObjToArray = (arr) => {
		const output = [];
		arr.forEach((item) => {
			const existing = output.filter((v) => {
				return v.task.mission_id === item.task.mission_id;
			});
			if (existing.length) {
				const existingIndex = output.indexOf(existing[0]);
				output[existingIndex].tasks = output[existingIndex].tasks.concat(item.task);
			} else {
				if (typeof item.task === 'object') item.tasks = [item.task];
				output.push(item);
			}
		});
		return output;
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllTasks();
			const result = await response.data;
			const kq = [];
			missions?.forEach((mission) => {
				result?.forEach((task) => {
					if (mission.id === task.mission_id) {
						kq.push({
							...mission,
							task,
						});
					}
				});
			});
			setMissionsWithTask(_.uniqBy([...mergeObjToArray(kq), ...missions], 'id'));
		};
		fetchData();
	}, [missions]);

	useEffect(() => {
		const fetchData = async () => {
			const result = await getLatestTasks();
			setLatestTasks(result.data);
		};
		fetchData();
	}, []);

	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.danhSach.text}>
			<Page container='fluid'>
				<div className='row mt-4 mb-4'>
					<div className='col-6'>
						<div className='display-6 fw-bold py-3'>Danh sách mục tiêu</div>
					</div>
				</div>
				<div className='row'>
					{missionsWithTask?.map((item) => (
						<div className='col-md-6 col-xl-4 col-sm-12' key={item.id}>
							<Card stretch className='cursor-pointer'>
								<CardHeader className='bg-transparent py-0'>
									<CardLabel
										className='py-4'
										onClick={() => navigateToDetailPage(item.id)}>
										<CardTitle tag='h3' className='h3'>
											{item?.name}
										</CardTitle>
										<CardSubTitle style={{ fontSize: 15 }}>
											{item?.description}
										</CardSubTitle>
									</CardLabel>
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
														icon='Edit'
														tag='button'
														onClick={() => handleOpenEditForm(item)}>
														Sửa mục tiêu
													</Button>
												</DropdownItem>
												<DropdownItem>
													<Button
														icon='Delete'
														tag='button'
														onClick={() =>
															handleOpenConfirmModal(item)
														}>
														Xoá mục tiêu
													</Button>
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</CardActions>
								</CardHeader>
								<CardBody onClick={() => navigateToDetailPage(item.id)}>
									<div className='row'>
										{item?.keys.slice(0, 6)?.map((k, index) => (
											// eslint-disable-next-line react/no-array-index-key
											<div key={index} className='col-auto'>
												<Badge
													isLight
													color={iconColors[index].color}
													className='px-3 py-2'
													style={{ fontSize: 13 }}>
													<Icon
														icon={iconColors[index].icon}
														size='lg'
														className='me-1'
													/>
													{k.key_name}
												</Badge>
											</div>
										))}
									</div>
									<div className='row mt-4'>
										<div className='col-md-6'>
											{calcProgressMission(item, item?.tasks)}%
											<Progress
												isAutoColor
												value={calcProgressMission(item, item?.tasks)}
												height={10}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					))}
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
									Thêm mục tiêu
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className='row mt-4'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Công việc mới cập nhật</div>
					</div>
					{latestTasks.map((item) => {
						return (
							<Item
								key={item.id}
								keys={item.keys}
								id={item.id}
								name={item?.name}
								teamName={item.departmnent?.name}
								dueDate={`${item.deadline_date}`}
								percent={calcProgressTask(item) || 0}
								data-tour='project-item'
							/>
						);
					})}
				</div>

				<MissionAlertConfirm
					openModal={openConfirmModal}
					onCloseModal={handleCloseConfirmModal}
					onConfirm={() => handleDeleteItem(itemEdit?.id)}
					title='Xoá mục tiêu'
					content={`Xác nhận xoá mục tiêu <strong>${itemEdit?.name}</strong> ?`}
				/>
				<MissionFormModal
					show={editModalStatus}
					onClose={handleCloseEditForm}
					onSubmit={handleSubmitMissionForm}
					item={itemEdit}
				/>
			</Page>
		</PageWrapper>
	);
};

export default MissionPage;
