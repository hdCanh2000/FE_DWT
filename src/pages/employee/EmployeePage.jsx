import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getAllDepartments, getAllUser } from '../work-management/mission/services';

const EmployeePage = () => {
	const { darkModeStatus } = useDarkMode();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [options, setOptions] = useState([]);
	const [users, setUsers] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
				const data = await response.data;
				setOptions(
					data.map((department) => {
						return {
							id: department?.id,
							text: department?.name,
							value: department?.slug,
						};
					}),
				);
			} catch (error) {
				setOptions([]);
			}
		}
		getDepartments();
	}, []);

	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllUser();
				const data = await response.data;
				setUsers(data);
			} catch (error) {
				setUsers([]);
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
			title: 'Họ và tên',
			id: 'name',
			key: 'name',
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
			title: 'Phòng ban',
			id: 'department',
			key: 'department',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name}</span>,
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
						onClick={() => navigate(`/nhan-vien/${item.id}`)}
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

	const handleSubmitForm = (e) => {
		e.preventDefault();
	};

	return (
		<PageWrapper title={demoPages.nhanVien.text}>
			<Page container='fluid'>
				<div className='row mb-4'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách nhân viên</div>
						</div>
					</div>
				</div>
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
									data={users}
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
					label={itemEdit?.id ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
					fields={columns}
					options={options}
				/>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
