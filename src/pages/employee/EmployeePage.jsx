import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
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
import { addEmployee, exportExcel, updateEmployee } from './services';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
// import EmployeeForm from './EmployeeForm';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { fetchPositionList } from '../../redux/slice/positionSlice';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();

	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const localtion = useLocation();

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);
	const departments = useSelector((state) => state.department.departments);
	const positions = useSelector((state) => state.position.positions);
	const pagination = useSelector((state) => state.employee.pagination);
	const loading = useSelector((state) => state.employee.loading);
	const [currentPage, setCurrentPage] = React.useState(page || 1);

	const fetchUser = () => {
		return users.map((item) => ({ ...item, code: _.isEmpty(item.code) ? '--' : item.code }));
	};

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		dispatch(fetchEmployeeList(query));
	}, [dispatch, page, text]);
	useEffect(() => {
		dispatch(fetchDepartmentList());
		dispatch(fetchPositionList());
	}, [dispatch]);
	const handleSubmitSearch = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: 1,
			}).toString(),
		});
	};

	const handleChangeCurrentPage = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: searchValue.page,
			}).toString(),
		});
	};

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
			title: 'Mã nhân sự',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'center',
			isShow: true,
			col: 6,
		},
		{
			title: 'Giới tính',
			id: 'sex',
			key: 'sex',
			type: 'singleSelect',
			align: 'left',
			isShow: false,
			format: (value) =>
				// eslint-disable-next-line no-nested-ternary
				value === 'male' ? 'Nam' : 'Nữ',
			options: [
				{
					id: 1,
					text: 'Nam',
					label: 'Nam',
					value: 'male',
				},
				{
					id: 2,
					text: 'Nữ',
					label: 'Nữ',
					value: 'famale',
				},
			],
			col: 6,
		},
		{
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
			col: 6,
		},
		{
			title: 'Email liên hệ',
			id: 'email',
			key: 'email',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'SĐT',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: false,
			col: 6,
		},
		{
			title: 'Phòng ban công tác',
			id: 'department',
			key: 'department',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || ''} </span>,
			options: departments,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Ngày tham gia',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
			col: 6,
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
			col: 6,
		},
		{
			title: 'Chức vụ',
			id: 'role',
			key: 'role',
			type: 'singleSelect',
			align: 'left',
			isShow: false,
			format: (value) =>
				// eslint-disable-next-line no-nested-ternary
				value === 'manager' ? 'Quản lý' : value === 'user' ? 'Nhân viên' : 'Admin',
			options: [
				{
					id: 1,
					text: 'Admin',
					label: 'Admin',
					value: 'admin',
				},
				{
					id: 2,
					text: 'Quản lý',
					label: 'Quản lý',
					value: 'manager',
				},
				{
					id: 3,
					text: 'Nhân viên',
					label: 'Nhân viên',
					value: 'user',
				},
			],
			col: 6,
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
			title: 'Hành Động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					{verifyPermissionHOC(
						<div className='d-flex align-items-center'>
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
								onClick={() => handleOpenFormDelete(item)}
							/>
						</div>,
						['admin'],
					)}
				</>
			),
			isShow: false,
		},
	];
	const handleDelete = async (data) => {
		const dataSubmit = {
			id: data?.id,
			isDelete: true,
		};
		try {
			const response = await updateEmployee(dataSubmit);
			await response.data;
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchEmployeeList(query));
			handleCloseForm();
			handleShowToast(`Xóa nhân viên!`, `Xóa nhân viên thành công thành công!`);
		} catch (error) {
			handleShowToast(`Xóa nhân viên`, `Xóa nhật nhân viên không thành công!`);
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
			department_id: data?.department?.value,
			code: data?.code,
			email: data?.email,
			dateOfBirth: data?.dateOfBirth,
			dateOfJoin: data?.dateOfJoin,
			phone: data?.phone,
			address: data?.address,
			position_id: data?.position?.value,
			role: data?.role,
			sex: data?.sex,
		};
		if (data?.id) {
			try {
				const response = await updateEmployee(dataSubmit);
				await response.data;
				dispatch(fetchEmployeeList());
				handleCloseForm();
				handleShowToast(`Cập nhật nhân viên!`, `Cập nhật nhân viên thành công!`);
			} catch (error) {
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
				throw error;
			}
		} else {
			try {
				const response = await addEmployee(dataSubmit);
				await response.data;
				dispatch(fetchEmployeeList());
				handleCloseForm();
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên thành công!`);
			} catch (error) {
				handleShowToast(`Thêm nhân viên`, `Thêm nhân viên không thành công!`);
				throw error;
			}
		}
	};
	const handleExportExcel = async () => {
		try {
			const response = await exportExcel();
			// If you want to download file automatically using link attribute.
			let filename = 'danh-sach-nhan-vien.xlsx';
			const disposition = _.get(response.headers, 'content-disposition');
			if (disposition && disposition.indexOf('attachment') !== -1) {
				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
				const matches = filenameRegex.exec(disposition);
				if (matches != null && matches[1]) {
					filename = matches[1].replace(/['"]/g, '');
				}
			}
			const url = window.URL.createObjectURL(
				new Blob([response.data], { type: _.get(response.headers, 'content-type') }),
			);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
			handleShowToast('Xuất Excel', 'Xuất excel thành công');
		} catch (error) {
			handleShowToast('Xuất Excel', 'Xuất excel thất bại');
			throw error;
		}
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.hrList.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<div>
								{verifyPermissionHOC(
									<div
										className='row mb-0'
										style={{
											maxWidth: '95%',
											minWidth: '60%',
											margin: '0 auto',
										}}>
										<div className='col-12'>
											<Card className='w-100'>
												<div style={{ margin: '24px 24px 0' }}>
													<CardHeader>
														<CardLabel
															icon='AccountCircle'
															iconColor='primary'>
															<CardTitle>
																<CardLabel>
																	Danh sách nhân sự
																</CardLabel>
															</CardTitle>
														</CardLabel>
														{verifyPermissionHOC(
															<CardActions>
																<Button
																	color='info'
																	icon='PersonPlusFill'
																	tag='button'
																	onClick={() =>
																		handleOpenForm(null)
																	}>
																	Thêm mới
																</Button>
																<Button
																	color='info'
																	icon='IosShare'
																	tag='button'
																	onClick={() =>
																		handleExportExcel()
																	}>
																	Xuất Excel
																</Button>
															</CardActions>,
															['admin'],
														)}
													</CardHeader>
													<div className='p-4'>
														<TableCommon
															className='table table-modern mb-0'
															columns={columns}
															data={fetchUser()}
															onSubmitSearch={handleSubmitSearch}
															onChangeCurrentPage={
																handleChangeCurrentPage
															}
															currentPage={parseInt(currentPage, 10)}
															totalItem={pagination?.totalRows}
															total={pagination?.total}
															setCurrentPage={setCurrentPage}
															searchvalue={text}
															isSearch
														/>
													</div>
												</div>
											</Card>
										</div>
									</div>,
									['admin', 'manager'],
								)}

								<CommonForm
									size='lg'
									show={toggleForm}
									onClose={handleCloseForm}
									handleSubmit={handleSubmitForm}
									item={itemEdit}
									label={
										itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'
									}
									fields={columns}
									validate={validate}
								/>
								<ComfirmSubtask
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDelete(itemEdit)}
									title='Xoá nhân viên'
									content={`Xác nhận xoá nhân viên <strong>${itemEdit?.name}</strong> ?`}
								/>
							</div>,
							['admin', 'manager'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};
EmployeePage.propTypes = {};
EmployeePage.defaultProps = {};

export default EmployeePage;
