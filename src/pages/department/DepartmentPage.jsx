// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/self-closing-comp */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
// import { arrayToTree } from 'performant-array-to-tree';
// import Tree from 'react-animated-tree';

import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
// import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchDepartmentWithUserList } from '../../redux/slice/departmentSlice';
import DetailForm from './DepartmentDetail';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { addDepartment } from './services';
import Toasts from '../../components/bootstrap/Toasts';
import DepartmentDetailPage from './DepartmentDetailPage';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const [itemEdit, setItemEdit] = React.useState({});
	const [openDetail, setOpenDetail] = React.useState(false);
	const [openForm, setOpenForm] = React.useState(false);
	const department = useSelector((state) => state.department.departments);
	useEffect(() => {
		dispatch(fetchDepartmentWithUserList());
	}, [dispatch]);
	const departmentList = department?.map((items) => {
		return {
			label: items.name,
			value: items.id,
		};
	});
	const organizationLevelOptions = [
		{
			label: 'Khối',
			value: 1,
		},
		{
			label: 'Phòng ban',
			value: 2,
		},
		{
			label: 'Đội',
			value: 3,
		},
	];
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
			title: 'Cấp tổ chức',
			id: 'organizationLevel',
			key: 'organizationLevel',
			type: 'select',
			align: 'center',
			options: organizationLevelOptions,
			isShow: true,
			isMulti: false,
		},
		{
			title: 'Quan hệ cha con',
			id: 'parentId',
			key: 'parentId',
			type: 'select',
			align: 'center',
			options: departmentList,
			isShow: true,
			isMulti: false,
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
			organizationLevel: data?.organizationLevel?.value,
			parentId: data?.parentId?.value,
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
	return (
		<PageWrapper title={demoPages.companyPage.subMenu.features.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
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
												onClick={() => handleOpenForm(null)}>
												Thêm phòng ban
											</Button>
										</CardActions>
									</CardHeader>
									<div className='row'>
										<DepartmentDetailPage
											organizationLevelOptions={organizationLevelOptions}
											departmentList={departmentList}
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
		</PageWrapper>
	);
};

export default DepartmentPage;
