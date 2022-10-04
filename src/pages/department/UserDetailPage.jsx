import React, { useState } from 'react';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import Button from '../../components/bootstrap/Button';
import { CardActions, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Toasts from '../../components/bootstrap/Toasts';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { addEmployee, updateEmployee } from '../employee/services';
import Popovers from '../../components/bootstrap/Popovers';
import EmployeeForm from '../employee/EmployeeForm';
import useDarkMode from '../../hooks/useDarkMode';
import { getAllPosition } from '../position/services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { getAllUser } from '../work-management/mission/services';

// eslint-disable-next-line prettier/prettier, react/prop-types
const DepartmentDetailPage = ({dataUser}) => { 
	const [user, setUser] = React.useState([]);
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const [positions, setPositions] = React.useState([]);
	React.useEffect(() => {
		const fetch = async () => {
			const response = await getAllUser();
			const result = await response.data;
			// eslint-disable-next-line react/prop-types
			setUser(result.filter((item) => item.departmentId === dataUser?.id));
		};
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	React.useEffect(() => {
		const fecth = async () => {
			const response = await getAllPosition();
			const result = await response.data;
			setPositions(
				[...result].map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id,
					};
				}),
			);
		};
		fecth();
	}, []);

	const columns = [
		{
			title: 'Họ và tên',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã NV',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'SĐT',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: false,
		},
		{
			title: 'Email',
			id: 'email',
			key: 'email',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Vị trí làm việc',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.position?.name || ''}</span>,
			options: positions,
			isMulti: false,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'center',
			isShow: false,
			render: (item) => (
				<Popovers desc={item?.address} trigger='hover'>
					<div
						style={{
							maxWidth: 150,
							WebkitLineClamp: '2',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
						}}>
						{item?.address}
					</div>
				</Popovers>
			),
		},
		{
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Ngày tham gia',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Vai trò',
			id: 'role',
			key: 'role',
			type: 'singleSelect',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Quản lý' : 'Nhân viên'),
			options: [
				{
					id: 1,
					text: 'Quản lý',
					label: 'Quản lý',
					value: 1,
				},
				{
					id: 2,
					text: 'Nhân viên',
					label: 'Nhân viên',
					value: 0,
				},
			],
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'switch',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Đang hoạt động' : 'Không hoạt động'),
		},

		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					{verifyPermissionHOC(
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap mx-1'
							icon='Edit'
							onClick={() => handleOpenActionForm(item)}
						/>,
						['admin'],
					)}
				</>
			),
			isShow: false,
		},
	];
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
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
	const handleSubmitEmployeeForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data?.name,
			departmentId: data?.department?.value,
			department: {
				id: data?.department?.value,
				name: data?.department?.label,
			},
			code: data?.code,
			email: data?.email,
			password: '123456',
			dateOfBirth: data?.dateOfBirth,
			dateOfJoin: data?.dateOfJoin,
			phone: data?.phone,
			address: data?.address,
			positionId: data?.position?.value,
			position: {
				id: data?.position?.value,
				name: data?.position?.label,
				value: data?.position?.value,
				label: data?.position?.label,
			},
			role: Number.parseInt(data?.role, 10),
			status: Number(data?.status),
			roles: Number.parseInt(data?.role, 10) === 1 ? ['manager'] : ['user'],
		};
		if (data.id) {
			try {
				const response = await updateEmployee(dataSubmit);
				const result = await response.data;
				hanleCloseForm();
				handleShowToast(
					`Cập nhật nhân viên!`,
					`Nhân viên ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
			}
		} else {
			try {
				const response = await addEmployee(dataSubmit);
				const result = await response.data;
				hanleCloseForm();
				handleShowToast(
					`Thêm nhân viên`,
					`Nhân viên ${result?.user?.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
			}
		}
	};

	const handleOpenActionForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};

	const hanleCloseForm = () => {
		setOpenForm(false);
		setItemEdit(null);
	};

	return (
		<div>
			<CardHeader>
				<CardLabel icon='Edit' iconColor='warning'>
					<CardTitle>Danh sách nhân viên</CardTitle>
				</CardLabel>
				<CardActions>
					<Button
						color='info'
						icon='PersonPlusFill'
						tag='button'
						onClick={() => handleOpenActionForm(null)}>
						Thêm nhân viên
					</Button>
				</CardActions>
			</CardHeader>
			<div className='p-4'>
				<TableCommon
					className='table table-modern mb-0'
					columns={columns}
					// eslint-disable-next-line react/prop-types
					data={user}
				/>
			</div>
			<EmployeeForm
				show={openForm}
				onClose={hanleCloseForm}
				handleSubmit={handleSubmitEmployeeForm}
				item={itemEdit}
				label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
				fields={columns}
			/>
		</div>
	);
};

export default DepartmentDetailPage;
