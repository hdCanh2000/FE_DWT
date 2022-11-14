/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { isEmpty, deburr } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { Form } from 'react-bootstrap';
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
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { addDepartment, deleteDepartment, updateDepartment } from './services';
import Employee from './Employee';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import Icon from '../../components/icon/Icon';
import './style.scss';
import DepartmentForm from './DepartmentForm';
import useDarkMode from '../../hooks/useDarkMode';

const DepartmentPage = () => {
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const departments = useSelector((state) => state.department.departments);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const [toggle, setToggle] = useState(true);
	const [dataDepartment, setDataDepartment] = useState({});
	const [valueSearch, setValueSearch] = useState('');
	const [department, setDepartment] = React.useState([]);
	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(department, { childrenField: 'children' })),
	);
	useEffect(() => {
		setDepartment(departments);
	}, [departments]);
	useEffect(() => {
		if (!isEmpty(department)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(department, { childrenField: 'children' })),
				),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			title: 'Mã phòng ban',
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

	const handleDelete = async (valueDelete) => {
		try {
			await deleteDepartment(valueDelete?.id);
			toast.success('Xoá phòng ban thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			dispatch(fetchDepartmentList());
		} catch (error) {
			toast.error('Xoá phòng ban không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
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
				toast.success('Cập nhật phòng ban thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchDepartmentList());
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật phòng ban không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addDepartment(dataSubmit);
				await response.data;
				toast.success('Thêm phòng ban thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchDepartmentList());
				handleCloseForm();
				setTreeValue(TreeState.expandAll(treeValue));
			} catch (error) {
				toast.error('Thêm phòng ban không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				setTreeValue(TreeState.expandAll(treeValue));
			}
		}
	};

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};
	const handleChangeSearch = (e) => {
		setValueSearch(e.target.value);
	};
	const renderIndexCell = (row) => {
		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
					fontSize: 14,
				}}
				onClick={() => setDataDepartment(row.data)}
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

				<span>{row?.data?.name || ''}</span>
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
	const handleSubmitSearch = () => {
		const dataSearch = department
			?.filter((item) =>
				deburr(
					item?.name
						?.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, ''),
				).includes(
					deburr(
						valueSearch
							?.toLowerCase()
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, ''),
					),
				),
			)
			.map((item) => ({ ...item, parent_id: null, parentId: null }));
		setTreeValue(
			TreeState.expandAll(
				TreeState.create(arrayToTree(dataSearch, { childrenField: 'children' })),
			),
		);
		if (isEmpty(valueSearch)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(department, { childrenField: 'children' })),
				),
			);
		}
	};
	return (
		<PageWrapper title={demoPages.companyPage.text}>
			<Page container='fluid'>
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
											<div className='pt-4' style={{ height: '100%' }}>
												<div className='d-flex align-items-center justify-content-start'>
													<Button
														color='info'
														icon={!toggle ? 'ExpandMore' : 'ExpandLess'}
														tag='button'
														onClick={toggleExpand}>
														{!toggle ? 'Hiển thị tất cả' : 'Thu gọn'}
													</Button>
												</div>
												<br />
												<div style={{ maxWidth: '100%' }}>
													<div className='mb-3 d-flex align-items-center'>
														<Form.Control
															placeholder='Search...'
															className='rounded-none outline-none shadow-none'
															style={{
																border: '1px solid',
																borderRadius: '0.5rem',
															}}
															onChange={(e) => handleChangeSearch(e)}
															value={valueSearch}
														/>
														<Button
															color='info'
															isOutline={!darkModeStatus}
															isLight={darkModeStatus}
															onClick={handleSubmitSearch}
															className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
															icon='Search'>
															Tìm kiếm
														</Button>
													</div>
												</div>
												<div id='treeTable'>
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
				</div>
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
