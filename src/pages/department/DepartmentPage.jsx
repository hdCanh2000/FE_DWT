import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
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
import { addDepartment, getAllDepartmentWithUser, updateDepartment } from './services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();
	const roles = window.localStorage.getItem('roles');
	if (roles === 'user') {
		navigate('/404');
	}
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [departments, setDepartments] = useState([]);
	const initError = {
		name: { errorMsg: '' },
		description: { errorMsg: '' },
		slug: { errorMsg: '' },
		address: { errorMsg: '' },
	};
	const [errors, setErrors] = useState(initError);
	const nameRef = useRef(null);
	const descriptionRef = useRef(null);
	const slugRef = useRef(null);
	const addressRef = useRef(null);
	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartmentWithUser();
				const data = await response.data;
				setDepartments(data);
			} catch (error) {
				setDepartments([]);
			}
		}
		getDepartments();
	}, []);

	const columns = [
		{
			title: 'Tên phòng ban',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			render: (item) => (
				<Link className='text-underline' to={`/phong-ban/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Code',
			id: 'slug',
			key: 'slug',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Số nhân viên',
			id: 'totalEmployee',
			key: 'totalEmployee',
			type: 'number',
			align: 'center',
			isShow: false,
			render: (item) => item?.users?.length || 0,
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
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenActionForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='ArrowForward'
						onClick={() => navigate(`/phong-ban/${item.id}`)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleOpenActionForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};

	const hanleCloseForm = () => {
		setItemEdit(null);
		setOpenForm(false);
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
			name: data.name,
			description: data.description,
			slug: data.slug,
			address: data.address,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateDepartment(dataSubmit);
				const result = await response.data;
				const newDepartments = [...departments];
				setDepartments(
					newDepartments.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				hanleCloseForm();
				handleShowToast(
					`Cập nhật phòng ban!`,
					`Phòng ban ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setDepartments(departments);
				handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
			}
		} else {
			try {
				validateForm();
				if (!data?.name) {
					nameRef.current.focus();
					return;
				}
				if (!data?.slug) {
					slugRef.current.focus();
					return;
				}
				if (!data?.description) {
					descriptionRef.current.focus();
					return;
				}
				if (!data?.address) {
					addressRef.current.focus();
					return;
				}
				const response = await addDepartment(dataSubmit);
				const result = await response.data;
				const newDepartments = [...departments];
				newDepartments.push(result);
				setDepartments(newDepartments);
				hanleCloseForm();
				handleShowToast(`Thêm phòng ban`, `Phòng ban ${result.name} được thêm thành công!`);
			} catch (error) {
				setDepartments(departments);
				handleShowToast(`Thêm phòng ban`, `Thêm phòng ban không thành công!`);
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
		// setErrors(initError);
		validateFieldForm('name', value?.name);
		validateFieldForm('slug', value?.slug);
		validateFieldForm('description', value?.description);
		validateFieldForm('address', value?.address);
	};
	const ref = (lable) => {
		let _ref = nameRef;
		switch (lable) {
			case 'Tên phòng ban':
				_ref = nameRef;
				break;
			case 'Mô tả':
				_ref = descriptionRef;
				break;
			case 'Code':
				_ref = slugRef;
				break;
			case 'Địa chỉ':
				_ref = addressRef;
				break;
			default:
				_ref = nameRef;
				break;
		}
		return _ref;
	};
	return (
		<PageWrapper title={demoPages.phongBan.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>
										Danh sách phòng ban
									</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='AccountCircle' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách phòng ban</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenActionForm(null)}>
												Thêm phòng ban
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={departments}
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							titles='department'
							show={openForm}
							onClose={hanleCloseForm}
							addToast={addToast}
							setItemEdit={setItemEdit}
							handleSubmitForm={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật phòng ban' : 'Thêm mới phòng ban'}
							fields={columns}
							ref={ref}
							errors={errors}
						/>
					</>,
					['admin', 'manager'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default DepartmentPage;
