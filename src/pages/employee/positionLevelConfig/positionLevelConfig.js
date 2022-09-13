import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import TableCommon from '../../common/ComponentCommon/TableCommon';
import { demoPages } from '../../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import {
	addPositionLevel,
	deletePositionLevel,
	getAllPositionLevel,
	updatePositionLevel,
} from './services';
import useDarkMode from '../../../hooks/useDarkMode';
import CommonForm from '../../common/ComponentCommon/CommonForm';
import Toasts from '../../../components/bootstrap/Toasts';
import TaskAlertConfirm from '../../work-management/mission/TaskAlertConfirm';
import validate from './validate';

const KeyPage = () => {
	const { darkModeStatus } = useDarkMode();
	// const { addToast } = useToasts();
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
	const [data, setData] = React.useState();
	const [openForm, setOpenForm] = React.useState(false);
	const [itemEdit, setItemEdit] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);
	const fecthData = async () => {
		const reponse = await getAllPositionLevel();
		const resutl = await reponse.data;
		setData(resutl);
	};
	React.useEffect(() => {
		fecthData();
	}, []);
	const { addToast } = useToasts();
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
	const handleOpenForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};
	const handleCloseForm = () => {
		setOpenForm(false);
		setItemEdit(null);
	};
	const handleSubmitForm = async (itemSubmit) => {
		if (!itemSubmit.id) {
			const reponse = await addPositionLevel(itemSubmit);
			const result = reponse.data;
			fecthData();
			handleCloseForm();
			handleShowToast('Thêm cấp nhân sự', `Thêm cấp nhân sự ${result.name} thành công !`);
		} else {
			const reponse = await updatePositionLevel(itemSubmit);
			const result = reponse.data;
			fecthData();
			handleCloseForm();
			handleShowToast(
				'Chỉnh sửa cấp nhân sự',
				`Chỉnh sửa cấp nhân sự ${result.name} thành công !`,
			);
		}
	};
	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemEdit({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};
	const handleDeletePositionLevel = (item) => {
		try {
			deletePositionLevel(item);
			fecthData();
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự thành công!`);
		} catch (error) {
			handleShowToast(`Xoá cấp nhân sự`, `Xoá cấp nhân sự không thành công!`);
		}
		handleCloseDelete();
	};
	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.kpi.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>
										Quản lý cấp nhân sự
									</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='SupervisorAccount' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách cấp nhân sự</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='VpnKey'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Tạo cấp nhân sự
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={data}
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
							label={itemEdit?.id ? 'Cập nhật cấp nhân sự' : 'Thêm mới cấp nhân sự'}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeletePositionLevel(itemEdit?.id)}
							title='Xoá cấp nhân sự'
							content={`Xác nhận xoá cấp nhân sự <strong>${itemEdit?.name}</strong> ?`}
						/>
					</>,
					['admin', 'manager'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyPage;
