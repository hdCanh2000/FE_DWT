import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { useToasts } from 'react-toast-notifications';
import { useToasts } from 'react-toast-notifications';
import { Tab, Tabs } from 'react-bootstrap';
import { CustomTreeData, TreeDataState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn } from '@devexpress/dx-react-grid-bootstrap4';
import { arrayToTree } from 'performant-array-to-tree';
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
// import Toasts from '../../components/bootstrap/Toasts';
import useDarkMode from '../../hooks/useDarkMode';
// import CommonForm from '../common/ComponentCommon/CommonForm';
// import { addDepartment, updateDepartment } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchDepartmentWithUserList } from '../../redux/slice/departmentSlice';
import DetailForm from './DepartmentDetail';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { addDepartment } from './services';
import Toasts from '../../components/bootstrap/Toasts';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const [itemEdit, setItemEdit] = React.useState({});
	const [openDetail, setOpenDetail] = React.useState(false);
	const [openForm, setOpenForm] = React.useState(false);

	const departments = useSelector((state) => state.department.departments);

	useEffect(() => {
		dispatch(fetchDepartmentWithUserList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên phòng ban',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
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
						icon='RemoveRedEye'
						onClick={() => handleOpenDetail(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='ArrowForward'
						onClick={() => handleOpenDetails(item)}
					/>
				</>
			),
			isShow: false,
		},
	];
	const handleOpenDetail = (item) => {
		setItemEdit(item);
		setOpenDetail(true);
	};
	const handleCloseDetail = () => {
		setItemEdit({});
		setOpenDetail(false);
	};
	const handleOpenForm = (item) => {
		setItemEdit(item);
		setOpenForm(true);
	};
	const handleCloseForm = () => {
		setItemEdit({});
		setOpenForm(false);
	};
	const handleOpenDetails = (item) => {
		navigate(`${demoPages.companyPage.subMenu.features.path}/${item.id}`);
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

		try {
			const response = await addDepartment(dataSubmit);
			const result = await response.data;
			dispatch(fetchDepartmentWithUserList());
			handleCloseForm();
			handleShowToast(`Thêm phòng ban`, `Phòng ban ${result.name} được thêm thành công!`);
		} catch (error) {
			handleShowToast(`Thêm phòng ban`, `Thêm phòng ban không thành công!`);
		}
	};
	const tree = arrayToTree(departments, {
		dataField: null,
		id: 'id',
		parentId: 'parentId',
		childrenField: 'items',
	});
	const columnss = [
		{
			title: 'Tên phòng ban',
			name: 'name',
		},
		{
			title: 'Mô tả',
			name: 'description',
		},
		{
			title: 'Code',
			name: 'slug',
		},
		{
			title: 'Địa chỉ',
			name: 'address',
		},
		{
			title: 'Trạng thái',
			name: 'status',
		},
	];
	const getChildRows = (row, rootRows) => {
		if (row) {
			return row?.items;
		}
		return rootRows;
	};
	const [tableColumnExtensions] = useState([{ columnName: 'name', width: 300 }]);
	return (
		<PageWrapper title={demoPages.companyPage.subMenu.features.text}>
			<Card style={{ height: '100%' }}>
				<Tabs defaultActiveKey='departmentList' id='uncontrolled-tab-example'>
					<Tab eventKey='departmentList' title='Danh sách phòng ban' className='mb-3'>
						<Page container='fluid'>
							{verifyPermissionHOC(
								<>
									<div className='row mb-4'>
										<div className='col-12'>
											<div className='d-flex justify-content-between align-items-center'>
												<div className='display-6 fw-bold py-3'>
													&emsp;Danh sách phòng ban
												</div>
											</div>
										</div>
									</div>
									<div className='row mb-0'>
										<div className='col-12'>
											<Card className='w-100'>
												<CardHeader>
													<CardLabel
														icon='AccountCircle'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh sách phòng ban
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='PersonPlusFill'
															tag='button'
															onClick={() => handleOpenForm(null)}>
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
										show={openForm}
										onClose={handleCloseForm}
										handleSubmit={handleSubmitForm}
										item={itemEdit}
										label='Thêm mới phòng ban'
										fields={columns}
										validate={validate}
										disable='true'
									/>
									<DetailForm
										show={openDetail}
										onClose={handleCloseDetail}
										item={itemEdit}
										label='Chi tiết phòng ban'
										fields={columns}
										validate={validate}
									/>
								</>,
								['admin', 'manager'],
							)}
						</Page>
					</Tab>
					<Tab
						eventKey='departmentDiagram'
						title='Sơ đồ tổ chức phòng ban'
						className='mb-3'>
						<Grid rows={tree} columns={columnss}>
							<TreeDataState />
							<CustomTreeData getChildRows={getChildRows} />
							<Table columnExtensions={tableColumnExtensions} />
							<TableHeaderRow />
							<TableTreeColumn for='name' />
						</Grid>
					</Tab>
				</Tabs>
			</Card>
		</PageWrapper>
	);
};

export default DepartmentPage;
