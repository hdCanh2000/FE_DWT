import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Toasts from '../../components/bootstrap/Toasts';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { getAllDepartments } from '../work-management/mission/services';
import { addEmployee, getAllEmployee, updateEmployee } from './services';
import Popovers from '../../components/bootstrap/Popovers';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import validate from './validate';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [departments, setDepartments] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
				const data = await response.data;
				setDepartments(
					data.map((department) => {
						return {
							id: department?.id,
							text: department?.name,
							value: department?.id,
						};
					}),
				);
			} catch (error) {
				setDepartments([]);
			}
		}
		getDepartments();
	}, []);

	async function getAllEmployees() {
		try {
			const response = await getAllEmployee();
			const data = await response.data;
			setUsers(data);
		} catch (error) {
			setUsers([]);
		}
	}

	useEffect(() => {
		getAllEmployees();
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
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Ngày tham gia',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Phòng ban',
			id: 'departmentId',
			key: 'departmentId',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name}</span>,
			options: departments,
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
			title: 'SĐT',
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
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'switch',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Đang hoạt động' : 'Không hoạt động'),
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
			title: 'Hành động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<Button
					isOutline={!darkModeStatus}
					color='success'
					isLight={darkModeStatus}
					className='text-nowrap mx-1'
					icon='Edit'
					onClick={() => handleOpenActionForm(item)}
				/>
			),
			isShow: false,
		},
	];

	const handleOpenActionForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};

	const hanleCloseForm = () => {
		setOpenForm(false);
		// setItemEdit(null);
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

	const handleClearValueForm = () => {
		setItemEdit(null);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data?.name,
			departmentId: data?.departmentId,
			code: data?.code,
			email: data?.email,
			password: '123456',
			dateOfBirth: data?.dateOfBirth,
			dateOfJoin: data?.dateOfJoin,
			phone: data?.phone,
			address: data?.address,
			position: Number.parseInt(data?.position, 10),
			status: Number(data?.status),
			roles: Number.parseInt(data?.position, 10) === 1 ? ['manager'] : ['user'],
		};
		if (data?.id) {
			try {
				const response = await updateEmployee(dataSubmit);
				const result = await response.data;
				const newUsers = [...users];
				setUsers(newUsers.map((item) => (item.id === data.id ? { ...result } : item)));
				// handleClearValueForm();
				hanleCloseForm();
				getAllEmployees();
				handleShowToast(
					`Cập nhật nhân viên!`,
					`Nhân viên ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				// setUsers(users);
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
			}
		} else {
			try {
				const response = await addEmployee(dataSubmit);
				const result = await response.data;
				const newUsers = [...users];
				newUsers.push(result);
				setUsers(newUsers);
				handleClearValueForm();
				hanleCloseForm();
				getAllEmployees();
				handleShowToast(
					`Thêm nhân viên`,
					`Nhân viên ${result?.user?.name} được thêm thành công!`,
				);
			} catch (error) {
				setUsers(users);
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.nhanVien.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row mb-4'>
						<div className='col-12'>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='display-6 fw-bold py-3'>Danh sách nhân viên</div>
							</div>
						</div>
					</div>,
					['admin', 'manager'],
				)}
				{verifyPermissionHOC(
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader>
									<CardLabel icon='AccountCircle' iconColor='primary'>
										<CardTitle>
											<CardLabel>Danh sách nhân viên</CardLabel>
										</CardTitle>
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
										data={users}
									/>
								</div>
							</Card>
						</div>
					</div>,
					['admin', 'manager'],
				)}

				<CommonForm
					show={openForm}
					onClose={hanleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
					fields={columns}
					validate={validate}
				/>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
