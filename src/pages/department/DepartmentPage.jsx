import React, { useEffect, useState } from 'react';
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

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [departments, setDepartments] = useState([]);
	useEffect(() => {
		async function getDepartments() {
			try {
				const response = await getAllDepartments();
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
			type: 'text',
			align: 'left',
			isShow: true,
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
					className='text-nowrap mx-2'
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

	const handleSubmitForm = (e) => {
		e.preventDefault();
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
				/>
			</Page>
		</PageWrapper>
	);
};

export default DepartmentPage;
