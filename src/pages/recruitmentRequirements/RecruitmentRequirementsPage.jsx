import React, { useEffect } from 'react';
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
import useDarkMode from '../../hooks/useDarkMode';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import { addRequirement, updateRequirement, deleteRequirement } from './services';
import CommonForm from '../common/ComponentCommon/CommonForm';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import NotPermission from '../presentation/auth/NotPermission';

const RecruitmentRequirementPage = () => {
	const { darkModeStatus } = useDarkMode();
	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const requirements = useSelector((state) => state.requirement.requirements);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	useEffect(() => {
		dispatch(fetchRequirementList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên yêu cầu',
			placeholder: 'tên yêu cầu',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mô tả',
			placeholder: 'mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Hành Động',
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

	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};

	const handleDeleteRequirement = async (data) => {
		// eslint-disable-next-line no-useless-catch
		try {
			await deleteRequirement(data);
			dispatch(fetchRequirementList());
		} catch (error) {
			throw error;
		}
		handleCloseDelete();
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: parseInt(data?.id, 10),
			name: data.name,
			description: data.description,
		};
		if (data.id) {
			// eslint-disable-next-line no-useless-catch
			try {
				const response = await updateRequirement(dataSubmit);
				await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
			} catch (error) {
				throw error;
			}
		} else {
			// eslint-disable-next-line no-useless-catch
			try {
				const response = await addRequirement(dataSubmit);
				await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
			} catch (error) {
				throw error;
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.recruitmentRequirements.text}>
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
											<CardLabel icon='AccountCircle' iconColor='primary'>
												<CardTitle>
													<CardLabel>
														Danh sách yêu cầu tuyển dụng
													</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='PersonPlusFill'
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
												data={requirements}
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
									? 'Cập nhật yêu cầu năng lực'
									: 'Thêm mới yêu cầu năng lực'
							}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeleteRequirement(itemDelete?.id)}
							title='Xoá yêu cầu năng lực'
							content={`Xác nhận xoá yêu cầu năng lực <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default RecruitmentRequirementPage;
