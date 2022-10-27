import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, createSearchParams, useSearchParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
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
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
import { getAllUnits, addUnit, updateUnit, deleteUnit } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';

const UnitPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();
	const localtion = useLocation();
	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const [units, setUnits] = useState({});
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(page || 1);

	async function getUnit(query) {
		try {
			const response = await getAllUnits(query);
			const data = await response.data;
			setUnits(data);
			setLoading(false);
		} catch (error) {
			setUnits([]);
			setLoading(false);
		}
	}

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		getUnit(query);
	}, [page, text]);

	const handleSubmitSearch = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: 1,
			}).toString(),
		});
	};

	const handleChangeCurrentPage = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: searchValue.page,
			}).toString(),
		});
		const query = {};
		query.text = text;
		query.page = page;
		getUnit(query);
	};

	const handleDelete = async (valueDelete) => {
		try {
			await deleteUnit(valueDelete?.id);
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thành công!`);
			const query = {};
			query.text = text;
			query.page = 1;
			getUnit(query);
		} catch (error) {
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thất bại!`);
		}
	};

	const columns = [
		{
			title: 'Tên đơn vị',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã đơn vị',
			id: 'code',
			key: 'code',
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
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];
	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: false,
			},
		);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			name: data.name,
			code: data.code,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateUnit({ id: data?.id, ...dataSubmit });
				await response.data;
				handleCloseForm();
				const query = {};
				query.text = text;
				query.page = 1;
				getUnit(query);
				handleShowToast(`Cập nhật đơn vị!`, `Cập nhật đơn vị thành công!`);
			} catch (error) {
				handleShowToast(`Cập nhật đơn vị`, `Cập nhật đơn vị không thành công!`);
			}
		} else {
			try {
				const response = await addUnit(dataSubmit);
				await response.data;
				handleCloseForm();
				const query = {};
				query.text = text;
				query.page = 1;
				getUnit(query);
				handleShowToast(`Thêm đơn vị`, `Thêm đơn vị thành công!`);
			} catch (error) {
				handleShowToast(`Thêm đơn vị`, `Thêm đơn vị không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.unit.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<>
								<div
									className='row mb-0'
									style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
									<div className='col-12'>
										<Card className='w-100'>
											<div style={{ margin: '24px 24px 0' }}>
												<CardHeader>
													<CardLabel
														icon='ReceiptLong'
														iconColor='primary'>
														<CardTitle>
															<CardLabel>
																Danh sách đơn vị tính
															</CardLabel>
														</CardTitle>
													</CardLabel>
													<CardActions>
														<Button
															color='info'
															icon='ReceiptLong'
															tag='button'
															onClick={() => handleOpenForm(null)}>
															Thêm mới
														</Button>
													</CardActions>
												</CardHeader>
												<div className='p-4'>
													<TableCommon
														className='table table-modern mb-0'
														columns={columns}
														data={units?.data}
														onSubmitSearch={handleSubmitSearch}
														onChangeCurrentPage={
															handleChangeCurrentPage
														}
														currentPage={parseInt(currentPage, 10)}
														totalItem={units?.pagination?.totalRows}
														total={units?.pagination?.total}
														setCurrentPage={setCurrentPage}
														searchvalue={text}
														isSearch
													/>
												</div>
											</div>
										</Card>
									</div>
								</div>
								<CommonForm
									show={toggleForm}
									onClose={handleCloseForm}
									handleSubmit={handleSubmitForm}
									item={itemEdit}
									label={
										itemEdit?.id
											? 'Cập nhật đơn vị tính'
											: 'Tạo đơn vị mới tính'
									}
									fields={columns}
									validate={validate}
								/>
							</>,
							['admin'],
							<NotPermission />,
						)}
					</div>
				)}

				<ComfirmSubtask
					openModal={toggleFormDelete}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleDelete(itemEdit)}
					title='Xoá đơn vị tính'
					content={`Xác nhận xoá đơn vị tính <strong>${itemEdit?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default UnitPage;
