import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import { login } from './services';

// eslint-disable-next-line react/prop-types
const LoginHeader = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Chào mừng,</div>
			<div className='text-center h4 text-muted mb-5'>Đăng nhập để tiếp tục!</div>
		</>
	);
};

const Login = ({ isSignUp }) => {
	const { darkModeStatus } = useDarkMode();
	const [isNewUser] = useState(isSignUp);
	const [account, setAccount] = useState({
		email: '',
		password: '',
	});
	const [errorMessage, setErrorMessage] = useState('');

	const handleChange = (e) => {
		const { value } = e.target;
		setAccount({
			...account,
			[e.target.name]: value,
		});
	};

	const navigate = useNavigate();
	const handleOnClick = async () => {
		try {
			const response = await login(account);
			const result = await response.data;
			localStorage.setItem('token', result.accessToken);
			localStorage.setItem('email', result.email);
			localStorage.setItem('name', result.name);
			localStorage.setItem('roles', JSON.stringify(result.roles));
			navigate('/muc-tieu');
		} catch (error) {
			setErrorMessage('Tài khoản hoặc mật khẩu không chính xác!');
		}
	};

	return (
		<PageWrapper title={isNewUser ? 'Sign Up' : 'Login'}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										{/* <Logo width={200} /> */}
									</Link>
								</div>
								<LoginHeader isNewUser={isNewUser} />
								<form className='row g-4'>
									{isNewUser ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='signup-email'
													isFloating
													label='Your email'>
													<Input type='email' autoComplete='email' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-name'
													isFloating
													label='Your name'>
													<Input autoComplete='given-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-surname'
													isFloating
													label='Your surname'>
													<Input autoComplete='family-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-password'
													isFloating
													label='Password'>
													<Input
														type='password'
														autoComplete='password'
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={handleOnClick}>
													Sign Up
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12 mb-'>
												<FormGroup
													id='email'
													className='mb-3'
													isFloating
													label='Nhập email'>
													<Input
														autoComplete='email'
														onChange={handleChange}
													/>
												</FormGroup>
												<FormGroup
													id='password'
													className='mb-3'
													isFloating
													label='Password'>
													<Input
														type='password'
														autoComplete='password'
														onChange={handleChange}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												{errorMessage && (
													<span
														style={{ fontSize: 14, color: '#e22828' }}>
														{errorMessage}
													</span>
												)}
											</div>
											<div className='col-12'>
												<Button
													color='warning'
													className='w-100 py-3'
													onClick={handleOnClick}
													onChange={handleChange}>
													Đăng nhập
												</Button>
											</div>
										</>
									)}
								</form>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
