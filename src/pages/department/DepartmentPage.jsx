import React, { useEffect, useState } from 'react';
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
import validate from './validate';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [departments, setDepartments] = useState([]);
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
			title: 'ID',
			id: 'id',
			key: 'id',
			type: 'number',
			align: 'center',
			isShow: false,
		},
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

	const handleClearValueForm = () => {
		setItemEdit(null);
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
				handleClearValueForm();
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
				const response = await addDepartment(dataSubmit);
				const result = await response.data;
				const newDepartments = [...departments];
				newDepartments.push(result);
				setDepartments(newDepartments);
				handleClearValueForm();
				hanleCloseForm();
				handleShowToast(`Thêm phòng ban`, `phòng ban ${result.name} được thêm thành công!`);
			} catch (error) {
				setDepartments(departments);
				handleShowToast(`Thêm phòng ban`, `Thêm phòng ban không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.phongBan.text}>
			<Page container='fluid'>
				<div className='row mb-4'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách phòng ban</div>
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
									<Button
										color='info'
										icon='CloudDownload'
										isLight
										tag='a'
										to='/employee.excel'
										target='_blank'
										download>
										Xuất Excel
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
					show={openForm}
					onClose={hanleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật phòng ban' : 'Thêm mới phòng ban'}
					fields={columns}
					validate={validate}
				/>
			</Page>
		</PageWrapper>
	);
};

export default DepartmentPage;
