import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import { toast } from 'react-toastify';
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
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
import validate from './validate';
import { fetchReport } from '../../redux/slice/keyReportSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
// import { changeCurrentPage, fetchKeyList } from '../../redux/slice/keySlice';
// import { fetchPositionList } from '../../redux/slice/positionSlice';
import { addResource, deleteResouce, updateResouce } from '../../api/fetchApi';

const KeyReport = () => {
	const [searchParams] = useSearchParams();
	const text = searchParams.get('text') || '';
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const localtion = useLocation();
	const [isDetail, setIsDetail] = useState(true);

	const { darkModeStatus } = useDarkMode();
	// const units = useSelector((state) => state.unit.units);
	// const positions = useSelector((state) => state.position.positions);
	const departments = useSelector((state) => state.department.departments);
	const keyReports = useSelector((state) => state.report.reports);
	const currentPage = useSelector((state) => state.key.currentPage);
	const pagination = useSelector((state) => state.key.pagination);

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const dataKeyReport = keyReports.map((item, index) => ({
		...item,
		indexValue: _.isEmpty(index) ? index + 1 : '--',
	}));

	// const fetch = () => {
	// 	const query = {};
	// 	query.text = text;
	// 	query.page = currentPage;
	// 	query.limit = 10;
	// 	dispatch(fetchKeyList(query));
	// };

	// useEffect(() => {
	// 	fetch();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dispatch, currentPage, text]);

	useEffect(() => {
		dispatch(fetchReport());
		dispatch(fetchDepartmentList());
		// dispatch(fetchPositionList());
	}, [dispatch]);

	const columns = [
		{
			title: 'STT',
			id: 'stt',
			key: 'stt',
			type: 'number',
			align: 'left',
			isShow: false,
			hidden: true,
			col: 3,
			render: (item) => <span>{item?.indexValue}</span>,
		},
		{
			title: 'Tên tiêu chí',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			hidden: true,
			col: 5,
			sorter: (a, b) => (a?.name || '').localeCompare(b?.name || ''),
			render: (item) => <span>{item?.name}</span>,
		},
		// {
		// 	title: 'Đơn vị',
		// 	id: 'unit',
		// 	key: 'unit',
		// 	type: 'select',
		// 	align: 'left',
		// 	isShow: true,
		// 	isShowNested: true,
		// 	render: (item) => <span>{item?.unit?.name}</span>,
		// 	options: units,
		// 	fields: [
		// 		{
		// 			title: 'Tên đơn vị',
		// 			id: 'name',
		// 			key: 'name',
		// 			isShow: true,
		// 			name: 'name',
		// 			type: 'text',
		// 		},
		// 		{
		// 			title: 'Mã đơn vị',
		// 			id: 'code',
		// 			key: 'code',
		// 			isShow: true,
		// 			name: 'code',
		// 			type: 'text',
		// 		},
		// 	],
		// 	col: 3,
		// },
		{
			title: 'Phòng ban',
			id: 'departmentId',
			key: 'departmentId',
			type: 'text',
			align: 'left',
			isShow: true,
			hidden: true,
			sorter: (a, b) => (a?.name || '').localeCompare(b?.name || ''),
			// options: departments,
			render: (keyReport) => {
				const filterDepartment = departments.find(
					(department) => department.id === keyReport.departmentId,
				);
				return filterDepartment ? filterDepartment?.name : '--';
			},
			// isMulti: false,
			col: 4,
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
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={(e) => {
							e.stopPropagation();
							handleOpenFormDelete(item);
						}}
					/>
				</>
			),
			isShow: false,
			hidden: true,
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

	// const setCurrentPage = (page) => {
	// 	dispatch(changeCurrentPage(page));
	// };

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
		// setCurrentPage(1);
	};

	const handleSubmitForm = async (data) => {
		const newValue = {
			id: _.get(itemEdit, 'id', null),
			name: data?.name,
			description: data?.description,
			unit_id: data?.unit?.id,
			position_id: data?.position?.id,
			department_id: data?.position?.department?.id,
            // departmentId: () => {
			// 	const filterDepartment = departments.find(
			// 		(department) => department.id === data.departmentId,
			// 	);
			// 	return filterDepartment ? filterDepartment?.name : '--';
			// },
		};
		if (_.isEmpty(itemEdit)) {
			try {
				await addResource('/api/keys', newValue);
				toast.success('Thêm tiêu chí kinh doanh thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				// fetch();
				handleCloseForm();
			} catch (error) {
				toast.error('Thêm tiêu chí kinh doanh không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		} else {
			try {
				await updateResouce('/api/keys', newValue);
				toast.success('Cập nhật tiêu chí kinh doanh thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				// fetch();
				handleCloseForm();
			} catch (error) {
				toast.error('Cập nhật tiêu chí kinh doanh không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		}
	};

	const handleDelete = async (data) => {
		try {
			await deleteResouce('/api/keys', data?.id);
			toast.success('Xóa tiêu chí kinh doanh thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		} catch (error) {
			toast.error('Xóa tiêu chí kinh doanh không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		}
		// fetch();
		handleCloseForm();
	};

	// const handleChangeCurrentPage = (searchValue) => {
	// 	setCurrentPage(searchValue.page);
	// };

	const handleSubmitNestedForm = async (itemSubmit, model) => {
		switch (model) {
			case 'unit':
				try {
					const response = await addResource('/api/units', itemSubmit);
					await response.data;
					toast.success('Thêm đơn vị thành công!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
				} catch (error) {
					toast.error('Thêm đơn vị không thành công!', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 1000,
					});
					throw error;
				}
				break;
			default:
				break;
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.keyReport.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='ReceiptLong' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách tiêu chí kinh doanh</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='Add'
												tag='button'
												onClick={() => {
													setIsDetail(true);
													handleOpenForm(null);
												}}>
												Thêm mới
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={showColumns}
											data={dataKeyReport}
											onSubmitSearch={handleSubmitSearch}
											style={{ cursor: 'pointer' }}
											onRow={(item) => {
												return {
													onClick: () => {
														setIsDetail(false);
														handleOpenForm(item);
													},
												};
											}}
											// onChangeCurrentPage={handleChangeCurrentPage}
											currentPage={parseInt(currentPage, 10)}
											totalItem={pagination?.totalRows}
											total={pagination?.total}
											// setCurrentPage={setCurrentPage}
											searchvalue={text}
											isSearch
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							// key={itemEdit?.id}
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
							fields={isDetail ? showColumns : columnsNoEdit}
							validate={validate}
							size='lg'
							onSubmitNestedForm={handleSubmitNestedForm}
						/>
						<AlertConfirm
							openModal={toggleFormDelete}
							onCloseModal={handleCloseForm}
							onConfirm={() => handleDelete(itemEdit)}
							title='Xoá tiêu chí kinh doanh'
							content='Xác nhận xoá tiêu chí kinh doanh?'
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyReport;
