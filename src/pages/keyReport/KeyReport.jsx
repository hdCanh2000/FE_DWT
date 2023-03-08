import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import _ from 'lodash';
// import { Table } from 'antd';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
// import TableSearchCommon from '../common/ComponentCommon/TableSearchCommon';
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
import AlertConfirm from '../work-management/mission/AlertConfirm';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { changeCurrentPage, fetchReport } from '../../redux/slice/keyReportSlice';
import { addKeyReport, updateKeyReport, deleteKeyReport } from './services';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import CommonForm from '../common/ComponentCommon/CommonForm';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Alert from '../../components/bootstrap/Alert';

const KeyReport = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();

	const [isDetail, setIsDetail] = useState(true);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const text = searchParams.get('text') || '';

	const localtion = useLocation();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const pagination = useSelector((state) => state.position.pagination);
	// const positionLevels = useSelector((state) => state.positionLevel.positionLevels);
	// const positions = useSelector((state) => state.position.positions);
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const loading = useSelector((state) => state.position.loading);
	const departments = useSelector((state) => state.department.departments);
	const keyReports = useSelector((state) => state.report.reports);
	const currentPage = useSelector((state) => state.report.currentPage);

	const arrKeyReports = keyReports.map((item, index) => ({
		...item,
		indexNumber: _.isEmpty(index) ? index : '--',
	}));

	// const fetchKeysReport = () => {
	// 	const newItem = itemEdit?.requirements?.map((items) => ({
	// 		...items,
	// 		label: items.name,
	// 		value: items.id,
	// 	}));
	// 	return { ...itemEdit, requirements: newItem };
	// };

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		// query.limit = 10;
		dispatch(fetchReport(query));
	}, [currentPage, dispatch, text]);

	const handleSubmitSearch = (searchValue) => {
		if (searchValue.text === '') {
			searchParams.delete('text');
			navigate({
				pathname: localtion.pathname,
			});
		} else {
			navigate({
				pathname: localtion.pathname,
				search: createSearchParams({
					text: searchValue.text,
				}).toString(),
			});
		}
		setCurrentPage(1);
	};

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	useEffect(() => {
		dispatch(fetchReport());
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	const columns = [
		{
			title: 'STT',
			id: 'stt',
			key: 'stt',
			type: 'text',
			align: 'center',
			isShow: false,
			hidden: true,
			render: (item) => <span>{item.indexNumber + 1}</span>,
		},
		{
			title: 'Tên tiêu chí',
			placeholder: 'tên tiêu chí',
			id: 'name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			type: 'text',
			align: 'left',
			isShow: true,
			hidden: true,
			col: 6,
		},
		{
			title: 'Phòng ban',
			placeholder: 'Phòng ban',
			id: 'departmentId',
			dataIndex: '',
			key: 'departmentId',
			sorter: (a, b) => (a?.name || '').localeCompare(b?.name || ''),
			type: 'singleSelect',
			align: 'left',
			isShow: true,
			hidden: true,
			col: 6,
			options: departments,
			render: (keyReport) => {
				const filterDepartment = departments.find(
					(department) => department.id === keyReport.departmentId,
				);
				return filterDepartment ? filterDepartment?.name : '--';
			},
		},
		{
			title: 'edit',
			id: 'edit',
			key: 'edit',
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
						onClick={(e) => {
							e.stopPropagation();
							setIsDetail(true);
							handleOpenForm(item);
						}}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={(e) => {
							e.stopPropagation();
							handleOpenFormDelete(item);
						}}
					/>
				</>
			),
			hidden: true,
			isShow: false,
		},
	];

	const showColumns = columns.filter((item) => item.hidden);

	const columnsNoEdit = columns.map((item) => {
		return {
			...item,
			// eslint-disable-next-line no-unneeded-ternary
			isDisabled: itemEdit?.id ? true : false,
		};
	});

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data.id,
			name: data?.name,
			departmentId: data?.departmentId,
			// dailyWorkId: data?.dailyWorkId,
		};
		if (data?.id) {
			try {
				const response = await updateKeyReport(dataSubmit);
				await response.data;
				toast.success('Cập nhật tiêu chí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchReport());
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật tiêu chí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addKeyReport(dataSubmit);
				await response.data;
				toast.success('Thêm tiêu chí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				dispatch(fetchReport());
				handleCloseForm();
			} catch (error) {
				toast.error('Thêm tiêu chí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};

	const handleDeleteKeyReport = async (valueDelete) => {
		try {
			await deleteKeyReport(valueDelete);
			toast.success('Xoá tiêu chí thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			dispatch(fetchReport());
			handleCloseForm();
		} catch (error) {
			toast.error('Xoá tiêu chí không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.keyReport.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '800px', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='Assignment'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh sách tiêu chí kinh doanh
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='AddCircleOutline'
															tag='button'
															onClick={() => {
																handleOpenForm(null);
																setIsDetail(true);
															}}>
															Thêm mới
														</Button>
													</CardActions>
												</CardHeader>
												<div className='p-4'>
													{/* <TableSearchCommon
														onSubmitSearch={handleSubmitSearch}
														searchvalue={text}
														isSearch
													/> */}
													<TableCommon
														className='table table-modern mb-0'
														rowKey={(item) => item.id}
														columns={showColumns}
														data={arrKeyReports}
														scroll={{ x: 'max-content' }}
														pagination={{ pageSize: 10 }}
														style={{ cursor: 'pointer' }}
														onRow={(item) => {
															return {
																cursor: 'pointer',
																onClick: () => {
																	setIsDetail(false);
																	handleOpenForm(item);
																},
															};
														}}
														onSubmitSearch={handleSubmitSearch}
														onChangeCurrentPage={
															handleChangeCurrentPage
														}
														currentPage={parseInt(currentPage, 10)}
														totalItem={pagination?.totalRows}
														total={pagination?.total}
														setCurrentPage={setCurrentPage}
														searchvalue={text}
														isSearch
													/>
												</div>
											</div>
											{!keyReports?.length && (
												<Alert
													color='warning'
													isLight
													icon='Report'
													className='mt-3'>
													Không có tiêu chí!
												</Alert>
											)}
										</Card>
									</div>
								</div>
								{toggleForm && (
									<CommonForm
										show={toggleForm}
										onClose={handleCloseForm}
										handleSubmit={handleSubmitForm}
										item={itemEdit}
										label={
											// eslint-disable-next-line no-nested-ternary
											!isDetail
												? 'Thông tin tiêu chí kinh doanh'
												: itemEdit?.id
												? 'Cập nhật tiêu chí kinh doanh'
												: 'Thêm mới tiêu chí kinh doanh'
										}
										fields={isDetail ? columns : columnsNoEdit}
										validate={validate}
									/>
								)}
								<AlertConfirm
									openModal={toggleFormDelete}
									onCloseModal={handleCloseForm}
									onConfirm={() => handleDeleteKeyReport(itemEdit?.id)}
									title='Xoá tiêu chí kinh doanh'
									content='Xác nhận xoá tiêu chí kinh doanh?'
								/>
							</>,
							['admin'],
							<NotPermission />,
						)}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyReport;
