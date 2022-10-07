// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Toasts from '../../../components/bootstrap/Toasts';
import Button from '../../../components/bootstrap/Button';
import { addNewMission, updateMissionById } from './services';
import MissionAlertConfirm from './MissionAlertConfirm';
import MissionFormModal from './MissionFormModal';
import Alert from '../../../components/bootstrap/Alert';
import useDarkMode from '../../../hooks/useDarkMode';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchMissionList, fetchMissionReport } from '../../../redux/slice/missionSlice';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import NotPermission from '../../presentation/auth/NotPermission';

const MissionPage = () => {
	const { addToast } = useToasts();
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const missions = useSelector((state) => state.mission?.missions);
	const toggleFormEdit = useSelector((state) => state.toggleForm.open);
	const toggleFormConfirm = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	useEffect(() => {
		dispatch(fetchMissionList());
	}, [dispatch]);

	const handleOpenFormEdit = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	// const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const columns = [
		{
			title: 'Tên mục tiêu',
			id: 'name',
			key: 'name',
			type: 'text',
		},
		{
			title: 'Phòng ban phụ trách',
			id: 'quantity',
			key: 'quantity',
			type: 'number',
			render: (item) =>
				item.departments.filter((i) => i.missionDepartment.isResponsible)[0]?.name ||
				'Không',
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
			title: 'Số lượng',
			id: 'quantity',
			key: 'quantity',
			type: 'number',
		},
		{
			title: 'Số ngày công',
			id: 'manday',
			key: 'manday',
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
							onClick={() => handleOpenFormEdit(item)}
						/>
					</div>,
					['admin'],
				),
		},
	];

	const handleCloseItem = async (data) => {
		try {
			const newData = { ...data };
			newData.status = -1;
			const response = await updateMissionById(newData);
			dispatch(fetchMissionList());
			dispatch(fetchMissionReport());
			handleCloseForm();
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu ${response?.data?.name} thành công!`);
		} catch (error) {
			handleShowToast(`Xoá mục tiêu`, `Xoá mục tiêu không thành công!`);
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
				await response.data;
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseForm();
				handleShowToast(`Cập nhật mục tiêu!`, `Cập nhật mục tiêu thành công!`);
			} catch (error) {
				handleShowToast(`Cập nhật mục tiêu`, `Cập nhật mục tiêu không thành công!`);
			}
		} else {
			try {
				const response = await addNewMission(data);
				await response.data;
				dispatch(fetchMissionList());
				dispatch(fetchMissionReport());
				handleCloseForm();
				handleShowToast(`Thêm mục tiêu`, `Thêm mục tiêu thành công!`);
			} catch (error) {
				handleShowToast(`Thêm mục tiêu`, `Thêm mục tiêu không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.mucTieu?.text}>
			<Page container='fluid'>
				<div>
					{verifyPermissionHOC(
						<>
							<div className='row'>
								<div className='col-12'>
									<div className='d-flex justify-content-between align-items-center'>
										<div className='display-6 fw-bold py-3'>
											Danh sách mục tiêu
										</div>
									</div>
								</div>
							</div>
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
											<Alert
												color='warning'
												isLight
												icon='Report'
												className='mt-3'>
												Không có mục tiêu!
											</Alert>
										)}
									</Card>
								</div>
							</div>
							<MissionAlertConfirm
								openModal={toggleFormConfirm}
								onCloseModal={handleCloseForm}
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
						</>,
						['admin', 'manager'],
						<NotPermission />,
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default MissionPage;
