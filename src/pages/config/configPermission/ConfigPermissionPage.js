import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import CommonForm from '../../common/ComponentCommon/CommonForm';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import validate from './validate';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import {
	fetchRoleList,
	onAddRole,
	onDeleteRole,
	onUpdateRole,
} from '../../../redux/slice/roleSlice';
import AlertConfirm from '../../common/ComponentCommon/AlertConfirm';
import ConfigPermissionForm from './ConfigPermissionForm';
import NotPermission from '../../presentation/auth/NotPermission';

const permissions = [
	{
		code: 'target.view',
		id: 1,
		module: 'target',
		moduleName: 'Mục tiêu',
		name: 'Xem',
	},
	{
		code: 'target.add',
		id: 2,
		module: 'target',
		moduleName: 'Mục tiêu',
		name: 'Thêm',
	},
	{
		code: 'target.edit',
		id: 3,
		module: 'target',
		moduleName: 'Mục tiêu',
		name: 'Sửa',
	},
	{
		code: 'target.delete',
		id: 4,
		module: 'target',
		moduleName: 'Mục tiêu',
		name: 'Xoá',
	},
	{
		code: 'mission.view',
		id: 5,
		module: 'mission',
		moduleName: 'Nhiệm vụ',
		name: 'Xem',
	},
	{
		code: 'mission.add',
		id: 6,
		module: 'mission',
		moduleName: 'Nhiệm vụ',
		name: 'Thêm',
	},
	{
		code: 'mission.edit',
		id: 7,
		module: 'mission',
		moduleName: 'Nhiệm vụ',
		name: 'Sửa',
	},
];

const ConfigPermissionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const [openListPermission, setOpenListPermission] = useState(false);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const confirmForm = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenConfirm = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const roles = useSelector((state) => state.role.roles);

	useEffect(() => {
		dispatch(fetchRoleList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên vai trò',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã vai trò',
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
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-1'
						icon='Plus'
						onClick={() => handleShowFormPermission()}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-1'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenConfirm(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleDelete = async (data) => {
		// eslint-disable-next-line no-useless-catch
		try {
			dispatch(onDeleteRole(data));
			dispatch(fetchRoleList());
			handleCloseForm();
		} catch (error) {
			throw error;
		}
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data?.name,
			code: data?.code,
		};
		if (data?.id) {
			// eslint-disable-next-line no-useless-catch
			try {
				dispatch(onUpdateRole(dataSubmit));
				handleCloseForm();
			} catch (error) {
				throw error;
			}
		} else {
			// eslint-disable-next-line no-useless-catch
			try {
				dispatch(onAddRole(dataSubmit));
				handleCloseForm();
			} catch (error) {
				throw error;
			}
		}
	};

	const handleShowFormPermission = () => {
		setOpenListPermission(true);
	};

	const handleCloseFormPermission = () => {
		setOpenListPermission(false);
	};

	return (
		<PageWrapper title='Vai trò'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>Danh sách vai trò</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='AccountCircle' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách vai trò</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm vai trò
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={roles}
										/>
									</div>
								</Card>
							</div>
						</div>
					</>,
					['admin'],
					<NotPermission />,
				)}
				<CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật vai trò' : 'Thêm mới vai trò'}
					fields={columns}
					validate={validate}
				/>
				<AlertConfirm
					openModal={confirmForm}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleDelete(itemEdit)}
					title='Xoá vai trò'
					content={`Xác nhận xoá vai trò <strong>${itemEdit?.name}</strong> ?`}
				/>
			</Page>
			<ConfigPermissionForm
				openModal={openListPermission}
				onCloseModal={handleCloseFormPermission}
				onConfirm={handleCloseFormPermission}
				title='Quản lý quyền'
				permissions={permissions}
			/>
		</PageWrapper>
	);
};

export default ConfigPermissionPage;
