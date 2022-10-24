import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { addPositionLevel, deletePositionLevel, updatePositionLevel } from './services';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import Toasts from '../../components/bootstrap/Toasts';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import validate from './validate';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Page from '../../layout/Page/Page';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionLevelList } from '../../redux/slice/positionLevelSlice';
import NotPermission from '../presentation/auth/NotPermission';

const KeyPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();
	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { addToast } = useToasts();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const localtion = useLocation();

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const pagination = useSelector((state) => state.positionLevel.pagination);
	const [data, setData] = useState([]);
	const datas = useSelector((state) => state.positionLevel.positionLevels);
	const [currentPage, setCurrentPage] = React.useState(page || 1);

	const columns = [
		{
			title: 'Tên cấp nhân sự',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã cấp nhân sự',
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
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		dispatch(fetchPositionLevelList(query));
	}, [dispatch, page, text]);

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
	};

	useEffect(() => {
		setData(datas.filter((item) => item?.id !== 0));
	}, [datas]);

	useEffect(() => {
		setData(datas.filter((item) => item?.id !== 0));
	}, [datas]);

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
	const handleSubmitForm = async (itemSubmit) => {
		// const itemSubmit = {
		// 	id: items?.id,
		// 	code: items?.value,
		// 	label: items?.label,
		// }
		if (!itemSubmit.id) {
			const reponse = await addPositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast(
				'Thêm cấp nhân sự',
				`Thêm cấp nhân sự ${result.data.name} thành công !`,
			);
		} else {
			const reponse = await updatePositionLevel(itemSubmit);
			const result = reponse.data;
			dispatch(fetchPositionLevelList());
			handleCloseForm();
			handleShowToast(
				'Chỉnh sửa cấp nhân sự',
				`Chỉnh sửa cấp nhân sự ${result.data.name} thành công !`,
			);
		}
	};
	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};
	const handleDeletePositionLevel = async (item) => {
		try {
			await deletePositionLevel(item);
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchPositionLevelList(query));
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự thành công!`);
		} catch (error) {
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự không thành công!`);
		}
		handleCloseDelete();
	};
	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.positionLevelConfig.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div
							className='row mb-0'
							style={{ maxWidth: '60%', minWidth: '60%', margin: '0 auto' }}>
							<div className='col-12'>
								<Card className='w-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel icon='SupervisorAccount' iconColor='primary'>
												<CardTitle>
													<CardLabel>Danh sách cấp nhân sự</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='GroupAdd'
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
												data={data}
												onSubmitSearch={handleSubmitSearch}
												onChangeCurrentPage={handleChangeCurrentPage}
												currentPage={parseInt(currentPage, 10)}
												totalItem={pagination?.totalRows}
												total={pagination?.total}
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
							label={itemEdit?.id ? 'Cập nhật cấp nhân sự' : 'Thêm mới cấp nhân sự'}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeletePositionLevel(itemDelete?.id)}
							title='Xoá cấp nhân sự'
							content={`Xác nhận xoá cấp nhân sự <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyPage;
