/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { useToasts } from 'react-toast-notifications';
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
import { addDepartment, deleteDepartment, updateDepartment } from './services';
import Toasts from '../../components/bootstrap/Toasts';
import Employee from './Employee';
import NotPermission from '../presentation/auth/NotPermission';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import Icon from '../../components/icon/Icon';
import './style.scss';
import DepartmentForm from './DepartmentForm';

const DepartmentPage = () => {
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const department = useSelector((state) => state.department.departments);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [toggle, setToggle] = useState(true);
	const [dataDepartment, setDepartmentId] = useState(true);

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(department, { childrenField: 'children' })),
	);

	useEffect(() => {
		if (!isEmpty(department)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(department, { childrenField: 'children' })),
				),
			);
		}
	}, [department]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	const departmentList = department?.map((item) => {
		return {
			...item,
			label: item.name,
			value: item.id,
		};
	});

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
			col: 8,
		},
		{
			title: 'Mã',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 4,
		},
		{
			title: 'Thuộc cơ cấu tổ chức',
			id: 'parentId',
			key: 'parentId',
			type: 'select',
			align: 'center',
			options: departmentList,
			isShow: true,
			isMulti: false,
			col: 8,
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
			col: 4,
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
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
	];

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
	const handleDelete = async (valueDelete) => {
		try {
			await deleteDepartment(valueDelete?.id);
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thành công!`);
		} catch (error) {
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thất bại!`);
		}
		dispatch(fetchDepartmentList());
	};
	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			organizationLevel: data?.organizationLevel?.value,
			parent_id: data?.parentId?.value,
			name: data?.name,
			description: data?.description,
			code: data?.code,
			address: data?.address,
		};
		if (data?.id) {
			try {
				const response = await updateDepartment(dataSubmit);
				await response.data;
				dispatch(fetchDepartmentList());
				handleCloseForm();
				handleShowToast(`Cập nhật phòng ban!`, `Cập nhật phòng ban thành công!`);
			} catch (error) {
				handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
				throw error;
			}
		} else {
			try {
				const response = await addDepartment(dataSubmit);
				const result = await response.data;
				dispatch(fetchDepartmentList());
				handleCloseForm();
				handleShowToast(
					`Thêm phòng ban`,
					`Phòng ban ${result.data.name} được thêm thành công!`,
				);
				setTreeValue(TreeState.expandAll(treeValue));
			} catch (error) {
				handleShowToast(`Thêm phòng ban`, `Thêm phòng ban không thành công!`);
				setTreeValue(TreeState.expandAll(treeValue));
			}
		}
	};

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
					fontSize: 14,
				}}
				onClick={() => setDepartmentId(row.data)}
				onDoubleClick={() =>
					handleOpenForm({
						...row.data,
						parentId: department.find((item) => item.id === row.data.parentId),
						organizationLevel: organizationLevelOptions.find(
							(item) => item.value === row.data.organizationLevel,
						),
					})
				}
				className={
					row.metadata.hasChildren
						? 'with-children d-flex align-items-center cursor-pointer user-select-none'
						: 'without-children cursor-pointer user-select-none'
				}>
				{row.metadata.hasChildren ? (
					<Icon
						color='success'
						type='button'
						size='lg'
						icon={row?.$state?.isExpanded ? 'ArrowDropDown' : 'ArrowRight'}
						className='d-block bg-transparent'
						style={{ fontSize: 25 }}
						onClick={row.toggleChildren}
					/>
				) : (
					''
				)}

						<span>{row.data.name || ''}</span>
			</div>
		);
	};

	const toggleExpand = () => {
		if (!toggle) {
			setToggle(!toggle);
			setTreeValue(TreeState.expandAll(treeValue));
		} else {
			setToggle(!toggle);
			setTreeValue(TreeState.collapseAll(treeValue));
		}
	};

	return (
		<PageWrapper title={demoPages.companyPage.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100 '>
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
											Thêm mới
										</Button>
									</CardActions>
								</CardHeader>
								<div className='row h-100 w-100'>
									<div className='col-lg-4 col-md-6 pb-4'>
										<Card className='h-100'>
											<CardBody>
												<div className='p-4' style={{ height: '100%' }}>
													<div className='d-flex align-items-center justify-content-start'>
														<Button
															color='info'
															icon={
																!toggle
																	? 'ExpandMore'
																	: 'ExpandLess'
															}
															tag='button'
															onClick={toggleExpand}>
															{!toggle
																? 'Hiển thị tất cả'
																: 'Thu gọn'}
														</Button>
													</div>
													<TreeTable
														value={treeValue}
														height={600}
														onChange={handleOnChange}>
														<TreeTable.Column
															style={{ minWidth: 300 }}
															renderCell={renderIndexCell}
															renderHeaderCell={() => <span />}
														/>
													</TreeTable>
												</div>
											</CardBody>
										</Card>
									</div>
									<div className='col-lg-8 col-md-6'>
										<Card>
											<CardBody>
												<Employee dataDepartment={dataDepartment} />
											</CardBody>
										</Card>
									</div>
								</div>
							</Card>
						</div>
					</div>,
					['admin'],
					<NotPermission />,
				)}
				<DepartmentForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật cơ cấu tổ chức' : 'Thêm mới cơ cấu tổ chức'}
					fields={columns}
					validate={validate}
					onDelete={handleDelete}
				/>
			</Page>
		</PageWrapper>
	);
};
export default DepartmentPage;
