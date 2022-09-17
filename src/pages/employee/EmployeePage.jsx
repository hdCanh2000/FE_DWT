import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
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
import Popovers from '../../components/bootstrap/Popovers';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import validate from './validate';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { addEmployee, updateEmployee } from './services';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);
	const departments = useSelector((state) => state.department.departments);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

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
			id: 'department',
			key: 'department',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || ''}</span>,
			options: departments,
			isMulti: false,
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
						className='text-nowrap mx-1'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					{/* <Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='ArrowForward'
						onClick={() => navigate(`/danh-sach-nhan-su/${item.id}`)}
					/> */}
				</>
			),
			isShow: false,
		},
	];
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

	const handleSubmitForm = async (data) => {
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
			position: Number.parseInt(data?.position, 10),
			status: Number(data?.status),
			roles: Number.parseInt(data?.position, 10) === 1 ? ['manager'] : ['user'],
		};
		if (data?.id) {
			try {
				const response = await updateEmployee(dataSubmit);
				const result = await response.data;
				dispatch(fetchEmployeeList());
				handleCloseForm();
				handleShowToast(
					`Cập nhật nhân viên!`,
					`Nhân viên ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
				throw error;
			}
		} else {
			try {
				const response = await addEmployee(dataSubmit);
				const result = await response.data;
				dispatch(fetchEmployeeList());
				handleCloseForm();
				handleShowToast(
					`Thêm nhân viên`,
					`Nhân viên ${result?.user?.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
				throw error;
			}
		}
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.hrList.text}>
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
											onClick={() => handleOpenForm(null)}>
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
					show={toggleForm}
					onClose={handleCloseForm}
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
