import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import { Formik } from 'formik';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import Select from '../../components/bootstrap/forms/Select';
import Icon from '../../components/icon/Icon';
import Option from '../../components/bootstrap/Option';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import styled from '../../components/bootstrap/Button';
// import Toasts from '../../components/bootstrap/Toasts';
// import CommonForm from '../common/ComponentCommon/CommonForm';
// import validate from './validate';
import SubHeaderCommon from '../common/SubHeaders/SubHeaderCommon';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
// import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionById } from '../../redux/slice/positionSlice';
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { getAllKpiNorm } from '../kpiNorm/services';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;

const PositionDetailPage = () => {
	const params = useParams();
	// const { addToast } = useToasts();
	const TABS = {
		INFOR: 'Thông tin',
		MISSiONS: 'Thêm nhiệm vụ',
	};

	const [activeTab, setActiveTab] = useState(TABS.INFOR);
	const [keysState, setKeysState] = useState([]);
	const [keyOption, setKeyOption] = useState([]);

	const dispatch = useDispatch();
	// const toggleForm = useSelector((state) => state.toggleForm.open);
	// const itemEdit = useSelector((state) => state.toggleForm.data);
	const position = useSelector((state) => state.position.position);
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);


	useEffect(() => {
		dispatch(fetchPositionById(params.id));
	}, [dispatch, params.id]);

	useEffect(() => {
		dispatch(fetchKpiNormList());
	}, [dispatch]);

	useEffect(() => {
		async function getKpiNorm() {
			try {
				const response = await getAllKpiNorm();
				const data = await response.data;
				setKeyOption(data);
			} catch (error) {
				setKeyOption([]);
			}
		}
		getKpiNorm();
	}, []);

	const prevIsValid = () => {
		if (keysState.length === 0) {
			return true;
		}
		const someEmpty = keysState.some((key) => key.keyValue === '');

		if (someEmpty) {
			keysState.map((key, index) => {
				const allPrev = [...keysState];
				if (keysState[index].keyValue === '') {
					allPrev[index].error.keyValue = 'Nhập giá trị key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};

	const handleAddFieldKey = () => {
		const initKeyState = {
			keyValue: '',
			error: {
				keyValue: null,
			},
		};
		if (prevIsValid() && keysState?.length <= 3) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};

	// hàm onchange cho input key
	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0
								? null
								: `Vui lòng nhập đầy đủ thông tin!`,
					},
				};
			});
		});
	};

	// xoá các key theo index
	const handleRemoveKeyField = (e, index) => {
		setKeysState((prev) => prev.filter((state) => state !== prev[index]));
	};

	// const handleShowToast = (title, content) => {
	// 	addToast(
	// 		<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
	// 			{content}
	// 		</Toasts>,
	// 		{
	// 			autoDismiss: true,
	// 		},
	// 	);
	// };



	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<SubHeaderCommon />
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div className='row h-100 w-100'>
						<div className='col-lg-2 col-md-6'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='AccountCircle'>
										<CardTitle>Thông tin</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<div className='col-12'>
											<Button
												icon='Contacts'
												color='info'
												className='w-100 p-3'
												isLight={TABS.INFOR !== activeTab}
												onClick={() => setActiveTab(TABS.INFOR)}>
												{TABS.INFOR}
											</Button>
										</div>
										<div className='col-12'>
											<Button
												icon='Edit'
												color='info'
												className='w-100 p-3'
												isLight={TABS.MISSiONS !== activeTab}
												onClick={() => setActiveTab(TABS.MISSiONS)}>
												{TABS.MISSiONS}
											</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-lg-10 col-md-6'>
							{TABS.INFOR === activeTab && (
								<Card className='h-100'>
									<Card className='h-100 mb-0'>
										<CardHeader>
											<CardLabel icon='Contacts' iconColor='warning'>
												<CardTitle>Thông tin nhiệm vụ cho từng vị trí</CardTitle>
											</CardLabel>
											{/* <CardActions>
												<Button
													color='info'
													icon='Edit'
													tag='button'
													onClick={() => handleOpenForm(null)}>
													Thêm nhiệm vụ
												</Button>
											</CardActions> */}
										</CardHeader>
										<div className='p-4'>
											<ul>
												<h4>Tên Vị Trí: <strong>{position?.name}</strong></h4>
											</ul>
											<ul>
												<h4>Nhiệm vụ cụ thể</h4>
											</ul>
										</div>
									</Card>
								</Card>
							)}
							{TABS.MISSiONS === activeTab && (
								<Formik initialValues={position} enableReinitialize>
									<Card className='h-100'>
										<Card className='h-100 mb-0'>
											<CardHeader>
												<CardLabel icon='Edit' iconColor='warning'>
													<CardTitle>Thêm nhiệm vụ</CardTitle>
												</CardLabel>
												<FormGroup>
													<Button variant='success' onClick={handleAddFieldKey}>
														Thêm chỉ số key
													</Button>
												</FormGroup>
											</CardHeader>
											<CardBody className='pt-0'>
												<div className='p-4'>
													{keysState?.map((item, index) => {
														return (
															<div
																key={index}
																className='mt-4 d-flex align-items-center justify-content-between'>
																<div style={{ width: '45%', marginRight: 10 }}>
																	<FormGroup
																		className='mr-2'
																		id='name'
																		label='Tên chỉ số key'>
																		<Select
																			name='keyName'
																			required
																			size='lg'
																			className='border border-2 rounded-0 shadow-none'
																			placeholder='Chọn chỉ số Key'
																			value={item?.keyName}
																			onChange={(e) =>
																				handleChangeKeysState(index, e)
																			}>
																			{kpiNorm.map((key) => (
																				<Option
																					key={`${key.name}`}
																					value={`${key.name}`}>
																					{`${key?.name}`}
																				</Option>
																			))}
																		</Select>
																	</FormGroup>
																	{item.error?.keyName && (
																		<ErrorText>
																			{item.error?.keyName}
																		</ErrorText>
																	)}
																</div>
																<div style={{ width: '45%', marginLeft: 10 }}>
																</div>
																<FormGroup>
																	<Button
																		color='light'
																		variant='light'
																		style={{
																			background: 'transparent',
																			border: 0,
																		}}
																		size='lg'
																		className='mt-4 h-100'
																		onClick={(e) =>
																			handleRemoveKeyField(e, index)
																		}>
																		<Icon icon='Trash' size='lg' />
																	</Button>
																</FormGroup>
															</div>
														);
													})}
												</div>
											</CardBody>
										</Card>
									</Card>
								</Formik>
							)}
						</div>
					</div>,
					['admin'],
				)}

				{/* <CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					// handleSubmit={handleSubmitEmployeeForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật nhiệm vụ' : 'Thêm nhiệm vụ'}
				// fields={columns}
				/> */}
			</Page>
		</PageWrapper>
	);
};

export default PositionDetailPage;
