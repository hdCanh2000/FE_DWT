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
import Button from '../../../components/bootstrap/Button';
import MissionFormModal from './MissionFormModal';
import Alert from '../../../components/bootstrap/Alert';
import Toasts from '../../../components/bootstrap/Toasts';
import useDarkMode from '../../../hooks/useDarkMode';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import { fetchMissionList } from '../../../redux/slice/missionSlice';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import NotPermission from '../../presentation/auth/NotPermission';
import AlertConfirm from '../../common/ComponentCommon/AlertConfirm';
import { deleteMissionById } from './services';

const MissionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const missions = useSelector((state) => state.mission?.missions);
	const toggleFormEdit = useSelector((state) => state.toggleForm.open);
	const confirmForm = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	useEffect(() => {
		dispatch(fetchMissionList());
	}, [dispatch]);

	const handleOpenFormEdit = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

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

	const handleDelete = async (data) => {
		try {
			await deleteMissionById(data?.id);
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thành công!`);
			handleCloseForm();
		} catch (error) {
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thất bại!`);
			throw error;
		}
		dispatch(fetchMissionList());
	};

	const columns = [
		{
			title: 'Tên mục tiêu',
			id: 'name',
			key: 'name',
			type: 'text',
		},
		{
			title: 'Phòng ban phụ trách',
			id: 'department',
			key: 'department',
			type: 'number',
			render: (item) =>
				item.departments.filter((i) => i.missionDepartments?.isResponsible)[0]?.name ||
				'--',
		},
		{
			title: 'Ngày bắt đầu',
			id: 'startTime',
			key: 'startTime',
			type: 'text',
			format: (value) => (value ? `${moment(`${value}`).format('DD-MM-YYYY')}` : '--'),
			align: 'center',
		},
		{
			title: 'Ngày kết thúc',
			id: 'endTime',
			key: 'endTime',
			format: (value) => (value ? `${moment(`${value}`).format('DD-MM-YYYY')}` : '--'),
			align: 'center',
		},
		{
			title: 'Số lượng',
			id: 'quantity',
			key: 'quantity',
			type: 'number',
			align: 'center',
		},
		{
			title: 'Số ngày công',
			id: 'manday',
			key: 'manday',
			type: 'number',
			align: 'center',
		},
		{
			title: 'Hành động',
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
						<Button
							isOutline={!darkModeStatus}
							color='danger'
							isLight={darkModeStatus}
							className='text-nowrap mx-2 '
							icon='Delete'
							onClick={() => handleOpenFormDelete(item)}
						/>
					</div>,
					['admin'],
				),
		},
	];

	return (
		<PageWrapper title={demoPages.mucTieu?.text}>
			<Page container='fluid'>
				<div>
					{verifyPermissionHOC(
						<>
							<div
								className='row'
								style={{ maxWidth: '95%', minWidth: '60%', margin: '0 auto' }}>
								<div className='col-12'>
									<Card>
										<div style={{ margin: '24px 24px 0' }}>
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
															onClick={() =>
																handleOpenFormEdit(null)
															}>
															Thêm mới
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
							<MissionFormModal
								show={toggleFormEdit}
								onClose={handleCloseForm}
								item={itemEdit}
							/>
							<AlertConfirm
								openModal={confirmForm}
								onCloseModal={handleCloseForm}
								onConfirm={() => handleDelete(itemEdit)}
								title='Xoá mục tiêu'
								content={`Xác nhận xoá mục tiêu <strong>${itemEdit?.name}</strong> ?`}
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
