import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import jwtDecode from 'jwt-decode';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import ThemeContext from '../contexts/themeContext';
import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';

const App = () => {
	getOS();
	const location = useLocation();
	const navigate = useNavigate();
	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus]);

	/**
	 *Check curent pathname
	 */

	const checkCurentPath = (route) => {
		return location.pathname === route;
	};
	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	const token = localStorage.getItem('token');

	useEffect(() => {
		if (token) {
			const decoded = jwtDecode(token);
			if (Date.now() / 1000 > decoded.exp) {
				localStorage.removeItem('token');
				localStorage.removeItem('email');
				localStorage.removeItem('name');
				localStorage.removeItem('roles');
				window.location.reload();
				navigate('/dang-nhap');
			}
		}
	}, [navigate, token]);

	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>
				<div
					ref={ref}
					className='app'
					style={{
						backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
						zIndex: fullScreenStatus && 1,
						overflow: fullScreenStatus && 'scroll',
					}}>
					<div className='main w-100 p-0'>
						<div className='main__wrapper w-100'>
							{!checkCurentPath('/dang-nhap') && (
								<div className='main__sidebar'>
									<Routes>
										<Route path='*' element={<Aside />} />
									</Routes>
								</div>
							)}
							<div
								className={
									checkCurentPath('/dang-nhap')
										? 'main__content w-100'
										: 'main__content'
								}>
								<Wrapper />
							</div>
						</div>
					</div>
				</div>
				<Portal id='portal-notification'>
					<ReactNotifications />
				</Portal>
			</ToastProvider>
		</ThemeProvider>
	);
};
// eslint-disable-next-line react/prop-types

export default App;
