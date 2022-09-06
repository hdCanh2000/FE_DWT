import React, { useEffect, useRef, useState } from 'react';
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

import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { getAllDepartments } from '../work-management/mission/services';
import { addEmployee, getAllEmployee, updateEmployee } from './services';
import Popovers from '../../components/bootstrap/Popovers';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import Toasts from '../../components/bootstrap/Toasts';

const EmployeePage = () => {
	const initError = {
		name: { errorMsg: '' },
		code: { errorMsg: '' },
		departmentId: { errorMsg: '' },
		email: { errorMsg: '' },
		phone: { errorMsg: '' },
		address: { errorMsg: '' },
		position: { errorMsg: '' },
	};
	const [errors, setErrors] = useState(initError);
	const nameRef = useRef(null);
	const manvRef = useRef(null);
	const phongbanRef = useRef(null);
	const emailRef = useRef(null);
	const sdtRef = useRef(null);
	const dcRef = useRef(null);
	const cvRef = useRef(null);
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
		setItemEdit(null);
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
	const handleSubmitForm = async (values) => {
		const dataSubmit = {
			id: values?.id,
			name: values.name,
			departmentId: values.departmentId,
			code: values.code,
			email: values.email,
			password: '123456',
			dateOfBirth: values.dateOfBirth,
			dateOfJoin: values.dateOfJoin,
			phone: values.phone,
			address: values.address,
			position: Number.parseInt(values.position, 10),
			status: Number(values.status),
			roles: Number.parseInt(values.position, 10) === 1 ? ['manager'] : ['user'],
		};
		if (values.id) {
			try {
				validateForm(values);
				if (!values?.name) {
					nameRef.current.focus();
					return;
				}
				if (!values?.code) {
					manvRef.current.focus();
					return;
				}
				if (!values?.departmentId) {
					phongbanRef.current.focus();
					return;
				}
				if (!values?.email) {
					emailRef.current.focus();
					return;
				}
				if (!values?.phone) {
					sdtRef.current.focus();
					return;
				}
				if (!values?.address) {
					dcRef.current.focus();
					return;
				}
				if (!values?.position) {
					cvRef.current.focus();
					return;
				}
				const response = await updateEmployee(dataSubmit);
				const result = await response.data;
				const newUsers = [...users];
				setUsers(newUsers.map((items) => (items.id === values.id ? { ...result } : items)));
				hanleCloseForm();
				handleShowToast(
					`Cập nhật nhân viên!`,
					`Nhân viên ${result?.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setUsers(users);
				handleShowToast(`Cập nhật nhân viên`, `Cập nhật nhân viên không thành công!`);
			}
		} else {
			try {
				validateForm(values);
				if (!values?.name) {
					nameRef.current.focus();
					return;
				}
				if (!values?.code) {
					manvRef.current.focus();
					return;
				}
				if (!values?.departmentId) {
					phongbanRef.current.focus();
					return;
				}
				if (!values?.email) {
					emailRef.current.focus();
					return;
				}
				if (!values?.phone) {
					sdtRef.current.focus();
					return;
				}
				if (!values?.address) {
					dcRef.current.focus();
					return;
				}
				if (!values?.position) {
					cvRef.current.focus();
					return;
				}
				const response = await addEmployee(dataSubmit);
				const result = await response.data;
				const newUsers = [...users];
				newUsers.push(result);
				setUsers(newUsers);
				hanleCloseForm();
				await getAllEmployees();
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
	// valueDalite
	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};
	const validateFieldForm = (field, value) => {
		if (!value) {
			onValidate(true, field);
		}
	};
	const validateForm = (value) => {
		setErrors(initError);
		validateFieldForm('name', value?.name);
		validateFieldForm('code', value?.code);
		validateFieldForm('departmentId', value?.departmentId);
		validateFieldForm('email', value?.email);
		validateFieldForm('phone', value?.phone);
		validateFieldForm('address', value?.address);
		validateFieldForm('position', value?.position);
	};
	const ref = (lable) => {
		let _ref = nameRef;
		switch (lable) {
			case 'Họ và tên':
				_ref = nameRef;
				break;
			case 'Mã NV':
				_ref = manvRef;
				break;
			case 'Email':
				_ref = emailRef;
				break;
			case 'SĐT':
				_ref = sdtRef;
				break;
			default:
				_ref = nameRef;
				break;
		}
		return _ref;
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
					titles='employee'
					show={openForm}
					onClose={hanleCloseForm}
					addToast={addToast}
					errors={errors}
					setItemEdit={setItemEdit}
					handleSubmitForm={handleSubmitForm}
					users={users}
					setUsers={setUsers}
					ref={ref}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
					fields={columns}
				/>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
