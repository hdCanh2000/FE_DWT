import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { useDispatch, useSelector } from 'react-redux';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { addPositionLevel, deletePositionLevel, updatePositionLevel } from './services';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import Toasts from '../../components/bootstrap/Toasts';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Page from '../../layout/Page/Page';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';

const KeyPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);
	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const columns = [
		{
			title: 'Tên cấp nhân sự',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã cấp nhân sự',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Hành động',
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
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];
	useEffect(() => {
		dispatch(fetchPositionLevelList());
	}, [dispatch]);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const data = useSelector((state) => state.positionLevel.positionLevels);
	const { addToast } = useToasts();
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
	const handleSubmitForm = async (itemSubmit) => {
		if (!itemSubmit.id) {
			const reponse = await addPositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast('Thêm cấp nhân sự', `Thêm cấp nhân sự ${result.name} thành công !`);
		} else {
			const reponse = await updatePositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast(
				'Chỉnh sửa cấp nhân sự',
				`Chỉnh sửa cấp nhân sự ${result.name} thành công !`,
			);
		}
	};
	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};
	const handleDeletePositionLevel = (item) => {
		try {
			deletePositionLevel(item);
			dispatch(fetchPositionLevelList());
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự thành công!`);
		} catch (error) {
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự không thành công!`);
		}
		handleCloseDelete();
	};
	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.kpi.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>
										Quản lý cấp nhân sự
									</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='SupervisorAccount' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách cấp nhân sự</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='VpnKey'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Tạo cấp nhân sự
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={data}
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật cấp nhân sự' : 'Thêm mới cấp nhân sự'}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeletePositionLevel(itemDelete?.id)}
							title='Xoá cấp nhân sự'
							content={`Xác nhận xoá cấp nhân sự <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin', 'manager'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyPage;