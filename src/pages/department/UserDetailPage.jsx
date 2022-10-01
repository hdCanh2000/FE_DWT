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

// eslint-disable-next-line prettier/prettier, react/prop-types
const DepartmentDetailPage = ({dataUser}) => {
	const { addToast } = useToasts();
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
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Ngày gia nhập',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
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
			title: 'Số điện thoại',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
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
			title: 'Chức vụ',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Quản lý' : 'Nhân viên'),
			options: [
				{
					id: 1,
					text: 'Quản lý',
					value: 1,
				},
				{
					id: 2,
					text: 'Nhân viên',
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
				<Button
					isOutline
					color='success'
					isLight
					className='text-nowrap mx-2'
					icon='Edit'
					onClick={() => handleOpenActionForm(item)}
				/>
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
			name: data.name,
			departmentId: data.departmentId,
			department: data.department,
			code: data.code,
			email: data.email,
			password: '123456',
			dateOfBirth: data.dateOfBirth,
			dateOfJoin: data.dateOfJoin,
			phone: data.phone,
			address: data.address,
			position: Number.parseInt(data.position, 10),
			status: Number(data.status),
			roles: Number.parseInt(data.position, 10) === 1 ? ['manager'] : ['user'],
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
					data={dataUser.users}
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
