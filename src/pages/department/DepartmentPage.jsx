// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import Tree from 'react-animated-tree-v2';
import { arrayToTree } from 'performant-array-to-tree';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import CommonForm from '../common/ComponentCommon/CommonForm';
import { addDepartment } from './services';
import Toasts from '../../components/bootstrap/Toasts';
import { close, minus, plus } from './icon/icon';
import Search from '../common/ComponentCommon/Search';
import DepartmentDetail from './DepartmentDetail';
import Employee from './Employee';
import NotPermission from '../presentation/auth/NotPermission';
import company from '../../components/icon/svg-icons/company.svg';
import diagram from '../../components/icon/svg-icons/diagram.png';
import departmentt from '../../components/icon/svg-icons/department.svg';
import group from '../../components/icon/svg-icons/group.png';

const DepartmentPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const [itemEdit, setItemEdit] = React.useState({});
	const [openForm, setOpenForm] = React.useState(false);
	const department = useSelector((state) => state.department.departments);
	const [itemEdits, setItemEdits] = useState({});
	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);
	const departmentList = department?.map((items) => {
		return {
			label: items.name,
			value: items.id,
		};
	});
	const showIcon = (item) => {
		if (item.organizationLevel === 4) {
			return <img src={company} alt='logo' style={{ width: '18px' }} />;
		}
		if (item.organizationLevel === 1) {
			return <img src={diagram} alt='logo' style={{ width: '18px' }} />;
		}
		if (item.organizationLevel === 2) {
			return <img src={departmentt} alt='logo' style={{ width: '18px' }} />;
		}
		if (item.organizationLevel === 3) {
			return <img src={group} alt='logo' style={{ width: '18px' }} />;
		}
		return <img src={company} alt='logo' style={{ width: '18px' }} />;
	};
	const organizationLevelOptions = [
		{
			label: 'Khối',
			value: 1,
		},
		{
			label: 'Công ty',
			value: 4,
		},
		{
			label: 'Phòng ban',
			value: 2,
		},
		{
			label: 'Đội nhóm',
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
	];
	const handleOpenForm = (item) => {
		setItemEdit(item);
		setOpenForm(true);
	};
	const handleCloseForm = () => {
		setItemEdit({});
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
			dispatch(fetchDepartmentList());
			handleCloseForm();
			handleShowToast(
				`Thêm phòng ban`,
				`Phòng ban ${result.data.name} được thêm thành công!`,
			);
		} catch (error) {
			handleShowToast(`Thêm phòng ban`, `Thêm phòng ban không thành công!`);
		}
	};
	const treeStyles = {
		cursor: 'pointer',
		color: 'black',
		fill: 'black',
		width: '100%',
		fontSize: '15px',
	};
	const departments = arrayToTree(department, { childrenField: 'items', dataField: null });
	const handleClick = (item) => {
		const newItem = department.filter((items) => items.id === item.id);
		setItemEdits(newItem[0]);
	};
	const renderDepartmentMenu = (data) => {
		const newData = data?.map((item) => {
			return (
				<div>
					{item?.items?.length === 0 && (
						<div style={{ marginLeft: '20px' }}>
							<Tree
								type={showIcon(item)}
								icons={{ plusIcon: plus, minusIcon: minus, closeIcon: close }}
								key={item.id}
								content={`${item.name}`}
								style={treeStyles}
								onItemClick={() => handleClick(item)}
							/>
						</div>
					)}
					{item?.items?.length !== 0 && (
						<Tree
							type={showIcon(item)}
							icons={{ plusIcon: plus, minusIcon: minus, closeIcon: close }}
							key={item.id}
							content={item.name}
							style={treeStyles}
							open
							onItemClick={() => handleClick(item)}>
							{renderDepartmentMenu(item.items)}
						</Tree>
					)}
				</div>
			);
		});
		return newData;
	};
	return (
		<PageWrapper title={demoPages.companyPage.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>Cơ cấu tổ chức</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100 ' style={{ minHeight: '900px' }}>
									<CardHeader>
										<CardLabel icon='Sort' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách cơ cấu tổ chức</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='AddCircleOutline'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm cơ cấu tổ chức
											</Button>
										</CardActions>
									</CardHeader>
									<div className='row h-100 w-100'>
										<div className='col-lg-3 col-md-6'>
											<Card className='h-100' style={{ minHeight: '900px' }}>
												<CardBody>
													<Search />
													{renderDepartmentMenu(departments)}
												</CardBody>
											</Card>
										</div>
										{department.includes(itemEdits) ? (
											<DepartmentDetail
												initValues={itemEdits}
												organizationLevelOptions={organizationLevelOptions}
												departmentList={departmentList}
											/>
										) : (
											<Employee header />
										)}
									</div>
								</Card>
							</div>
						</div>
					</>,
					['admin'],
					<NotPermission />,
				)}
				<CommonForm
					setInitValues={setItemEdits}
					show={openForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label='Thêm mới phòng ban'
					fields={columns}
					validate={validate}
					disable='true'
				/>
			</Page>
		</PageWrapper>
	);
};
export default DepartmentPage;
