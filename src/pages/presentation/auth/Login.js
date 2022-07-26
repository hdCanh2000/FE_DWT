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

	const navigate = useNavigate();
	const handleOnClick = () => {
		if (!localStorage.getItem('token')) {
			localStorage.setItem('token', '110ce079a5e79a185e12b04289536364');
			navigate('/muc-tieu/danh-sach');
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
													id='login-username'
													className='mb-3'
													isFloating
													label='Your email or username'>
													<Input autoComplete='username' />
												</FormGroup>
												<FormGroup
													id='login-password'
													className='mb-3'
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
													color='warning'
													className='w-100 py-3'
													onClick={handleOnClick}>
													Login
												</Button>
											</div>
										</>
									)}
									{/* BEGIN :: Social Login */}
									<div className='col-12 mt-3 text-center text-muted'>OR</div>
									<div className='col-12 mt-3'>
										<Button
											isOutline
											color={darkModeStatus ? 'light' : 'dark'}
											className={classNames('w-100 py-3', {
												'border-light': !darkModeStatus,
												'border-dark': darkModeStatus,
											})}
											icon='CustomApple'
											onClick={handleOnClick}>
											Sign in with Apple
										</Button>
									</div>
									<div className='col-12'>
										<Button
											isOutline
											color={darkModeStatus ? 'light' : 'dark'}
											className={classNames('w-100 py-3', {
												'border-light': !darkModeStatus,
												'border-dark': darkModeStatus,
											})}
											icon='CustomGoogle'
											onClick={handleOnClick}>
											Continue with Google
										</Button>
									</div>
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': isNewUser,
									'link-dark': !isNewUser,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': isNewUser,
									'link-dark': !isNewUser,
								})}>
								Terms of use
							</a>
						</div>
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
