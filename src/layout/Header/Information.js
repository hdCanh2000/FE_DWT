import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/bootstrap/Button';
import Page from '../Page/Page';
import PageWrapper from '../PageWrapper/PageWrapper';
import Card, {
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../components/bootstrap/Card';
import UserImageWebp from '../../assets/img/wanna/wanna6.webp';
import UserImage from '../../assets/img/wanna/wanna6.png';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Icon from '../../components/icon/Icon';
// import Alert from '../../components/bootstrap/Alert';
import Avatar from '../../components/Avatar';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import { getUserById } from '../../pages/employee/services';
import changePass from './services';
import Toasts from '../../components/bootstrap/Toasts';
import { handleLogout } from '../../utils/utils';

const Information = () => {
	const [newUser, setNewUser] = React.useState();
	const [validate, setValidate] = React.useState();
	const navigate = useNavigate();
	const { addToast } = useToasts();
	const user = window.localStorage;
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);
	React.useEffect(() => {
		const fetch = async () => {
			const data = await getUserById(user?.userId);
			const newData = data.data.data;
			setNewUser(newData);
		};
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleSubmit = async (data) => {
		const reponse = await changePass(data);
		handleValidate(reponse.data.data);
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
	const handleValidate = (data) => {
		if (data === 'Password must be at least 4 characters !!!') {
			setValidate({ newPassword: 'Vui lòng nhập mật khẩu mới trên 4 kí tự !' });
		}
		if (data === 'Wrong Current Password !') {
			setValidate({ oldPassword: 'Mật khẩu hiện tại không đúng !' });
		}
		if (data === 'Confirm password wrong !') {
			setValidate({ newPassword2: 'Nhập mật khẩu xác nhận không đúng !' });
		}
		if (data === 'Same old password') {
			setValidate({ newPassword: 'Mật khẩu bị trùng !', oldPassword: 'Mật khẩu bị trùng !' });
		}
		if (data === true) {
			setValidate({});
			handleLogout();
			navigate('/dang-nhap');
			handleShowToast(`Đổi mật khẩu`, `Đổi mật khẩu thành công!`);
		}
	};
	const formik = useFormik({
		initialValues: {
			oldPassword: '',
			newPassword: '',
			newPassword2: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div>
					<Card hasTab style={{ minWidth: '95%', margin: '0 auto', minHeight: '90vh' }}>
						<CardTabItem id='profile' title='Profile' icon='Contacts'>
							{/* <Alert isLight className='border-0' shadow='md' icon='LocalPolice'>
								Vui lòng liên hệ admin để thay đổi thông tin .
							</Alert> */}
							<Card style={{ minWidth: '95%', margin: '0 auto', minHeight: '45vh' }}>
								<div className='row g-5 m-2'>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-shrink-0'>
												<Avatar
													srcSet={UserImageWebp}
													src={UserImage}
													className='rounded-circle'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='h2 fw-bold'>
													{user?.name} - {newUser?.code}
												</div>
												<div className='h5 text-muted'>
													{newUser?.email}
												</div>
											</div>
										</div>
									</div>
									<div className='row g-4' style={{ marginLeft: '1%' }}>
										<div className='col-lg-4 '>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon icon='Cake' size='3x' color='info' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{moment(newUser?.dateOfBirth).format(
															'DD-MM-YYYY',
														)}
													</div>
													<div className='text-muted'>Ngày sinh</div>
												</div>
											</div>
										</div>
										<div className='col-lg-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													{newUser?.sex === 'female' ? (
														<Icon
															icon='Female'
															size='3x'
															color='info'
														/>
													) : (
														<Icon icon='Male' size='3x' color='info' />
													)}
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{newUser?.sex === 'female' ? 'Nữ' : 'Name'}
													</div>
													<div className='text-muted'>Giới tính</div>
												</div>
											</div>
										</div>
										<div className='col-lg-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon icon='FmdGood' size='3x' color='info' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{newUser?.address}
													</div>
													<div className='text-muted'>Địa chỉ</div>
												</div>
											</div>
										</div>
										<div className='col-lg-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='CustomCompany'
														size='3x'
														color='info'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{newUser?.department?.name}
													</div>
													<div className='text-muted'>Phòng ban</div>
												</div>
											</div>
										</div>
										<div className='col-lg-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='Assignment'
														size='3x'
														color='info'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{newUser?.position?.name}
													</div>
													<div className='text-muted'>
														Vị trí làm việc
													</div>
												</div>
											</div>
										</div>
										<div className='col-lg-4'>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon='ManageAccounts'
														size='3x'
														color='info'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-5 mb-0'>
														{newUser?.role}
													</div>
													<div className='text-muted'>Quyền</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</CardTabItem>
						<CardTabItem id='profile2' title='Password' icon='Lock'>
							<Card
								className='rounded-2'
								tag='form'
								onSubmit={formik.handleSubmit}
								style={{ width: '40%', margin: '0 auto' }}>
								<CardHeader>
									<CardLabel icon='Lock'>
										<CardTitle>Đổi mật khẩu</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div>
										<div className='row g-4'>
											<FormGroup
												className='col-lg-12'
												id='oldPassword'
												label='Mật khẩu cũ'>
												<Input
													type='password'
													onChange={formik.handleChange}
													value={formik.values.oldPassword}
												/>
											</FormGroup>
											<div className='text-danger mt-1'>
												{validate?.oldPassword && (
													<span style={{ color: 'red' }}>
														{validate?.oldPassword}
													</span>
												)}
											</div>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-12'
												id='newPassword'
												label='Mật khẩu mới'>
												<Input
													type='password'
													onChange={formik.handleChange}
													value={formik.values.newPassword}
												/>
											</FormGroup>
											{validate?.newPassword && (
												<span style={{ color: 'red' }}>
													{validate?.newPassword}
												</span>
											)}
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-12'
												id='newPassword2'
												label='Nhập lại mật khẩu mới'>
												<Input
													type='password'
													onChange={formik.handleChange}
													value={formik.values.newPassword2}
												/>
											</FormGroup>
											{validate?.newPassword2 && (
												<span style={{ color: 'red' }}>
													{validate?.newPassword2}
												</span>
											)}
										</div>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterRight>
										<Button type='submit' color='info' icon='Save'>
											Xác nhận
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</CardTabItem>
					</Card>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Information;
