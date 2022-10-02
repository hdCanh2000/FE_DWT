import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
import Popovers from '../../components/bootstrap/Popovers';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import validate from './validate';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { addEmployee, updateEmployee } from './services';
import DetailForm from '../common/ComponentCommon/DetailForm';
import { getAllDepartment } from '../department/services';
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
// import EmployeeForm from './EmployeeForm';
import NotPermission from '../presentation/auth/NotPermission';
import CommonForm from '../common/ComponentCommon/CommonForm';

const EmployeePage = ({ header }) => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);
	const [departments, setDepartments] = React.useState([]);
	const [openDetail, setOpenDetail] = React.useState(false);
	const [dataDetail, setDataDetail] = React.useState({});
	const [openDelete, setOpenDelete] = React.useState(false);
	const [dataDelete, setDataDelete] = React.useState({});
	useEffect(() => {
		const fecth = async () => {
			const response = await getAllDepartment();
			const result = await response.data;
			setDepartments(
				result.data.map((item) => {
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
			col: 6,
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
			col: 6,
		},
		{
			title: 'Mã NV',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 3,
		},
		{
			title: 'SĐT',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: true,
			col: 4,
		},
		{
			title: 'Email',
			id: 'email',
			key: 'email',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 5,
		},
		{
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
			col: 4,
		},
		{
			title: 'Ngày tham gia',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: true,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
			col: 4,
		},
		{
			title: 'Vai trò',
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
					value: 'Quản lý',
				},
				{
					id: 2,
					text: 'Nhân viên',
					label: 'Nhân viên',
					value: 'Nhân viên',
				},
			],
			col: 4,
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
							onClick={() => handleOpenForm(item)}
						/>,
						['admin'],
					)}
					<Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='RemoveRedEye'
						onClick={() => handleOpenDetail(item)}
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
	const handleOpenDelete = (item) => {
		setDataDelete(item);
		setOpenDelete(!openDelete);
	};
	const handleDelete = async (data) => {
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
			isDelete: 1,
		};
		try {
			await updateEmployee(dataSubmit);
			dispatch(fetchEmployeeList());
			handleCloseForm();
			handleShowToast(`Xóa nhân viên!`, `Xóa nhân viên thành công thành công!`);
		} catch (error) {
			handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
			throw error;
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
					`Nhân viên ${result?.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
				throw error;
			}
		}
	};
	const handleOpenDetail = (item) => {
		setOpenDetail(true);
		setDataDetail({ ...item });
	};
	const handleCloseDetail = () => {
		setOpenDetail(false);
		setDataDetail({});
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.hrList.text}>
			<Page container='fluid' style={{ padding: '0' }}>
				<div>
					{verifyPermissionHOC(
						<div>
							{header === false &&
								verifyPermissionHOC(
									<div className='row mb-4'>
										<div className='col-12'>
											<div className='d-flex justify-content-between align-items-center'>
												<div className='display-6 fw-bold py-3'>
													Danh sách nhân sự
												</div>
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
														<CardLabel>Danh sách nhân sự</CardLabel>
													</CardTitle>
												</CardLabel>
												{verifyPermissionHOC(
													<CardActions>
														<Button
															color='info'
															icon='PersonPlusFill'
															tag='button'
															onClick={() => handleOpenForm(null)}>
															Thêm nhân sự
														</Button>
													</CardActions>,
													['admin'],
												)}
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
							<DetailForm
								show={openDetail}
								onClose={handleCloseDetail}
								item={dataDetail}
								label={`Chi tiết nhân viên: ${dataDetail?.name}`}
								fields={columns}
							/>
							<ComfirmSubtask
								openModal={openDelete}
								onCloseModal={handleOpenDelete}
								onConfirm={() => handleDelete(dataDelete)}
								title='Xoá nhân viên'
								// eslint-disable-next-line eslint-comments/no-duplicate-disable
								// eslint-disable-next-line react/prop-types
								content={`Xác nhận xoá nhân viên <strong>${dataDelete?.name}</strong> ?`}
							/>
						</div>,
						['admin', 'manager'],
						<NotPermission />,
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};
EmployeePage.propTypes = {
	header: PropTypes.bool,
};
EmployeePage.defaultProps = {
	header: false,
};

export default EmployeePage;
