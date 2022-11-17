import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';
// import OffCanvas, {
// 	OffCanvasBody,
// 	OffCanvasHeader,
// 	OffCanvasTitle,
// } from '../../../components/bootstrap/OffCanvas';
// import Alert from '../../../components/bootstrap/Alert';
import useDarkMode from '../../../hooks/useDarkMode';
// import { getLangWithKey } from '../../../lang';

// eslint-disable-next-line react/prop-types
const CommonHeaderRight = ({ beforeChildren, afterChildren }) => {
	const { darkModeStatus } = useDarkMode();

	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('email');
		localStorage.removeItem('name');
		localStorage.removeItem('roles');
		localStorage.removeItem('userId');
		navigate('/dang-nhap');
	};

	const styledBtn = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
		className: 'btn-outline-light',
	};

	// const [offcanvasStatus, setOffcanvasStatus] = useState(false);

	const { i18n } = useTranslation();

	// const changeLanguage = () => {
	// 	if (i18n.language === 'vi-VN') {
	// 		i18n.changeLanguage('en-US');
	// 	} else {
	// 		i18n.changeLanguage('vi-VN');
	// 	}
	// };

	/**
	 * Language attribute
	 */
	useLayoutEffect(() => {
		document.documentElement.setAttribute('lang', i18n.language);
	});

	return (
		<HeaderRight>
			<div className='row g-3'>
				{beforeChildren}
				{/* <div className='col-auto'>
					<Button
						{...styledBtn}
						aria-label='Change language'
						data-tour='lang-selector'
						onClick={() => changeLanguage()}
					>
						<span>
							VNI
						</span>
					</Button>
				</div> */}
				{/* <div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='CompareArrows'
						aria-label='CompareArrows'
					/>
				</div>
				<div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='Notifications'
						// onClick={() => setOffcanvasStatus(true)}
						aria-label='Notifications'
					/>
				</div> */}
				<div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='Logout'
						onClick={handleLogout}
						aria-label='Logout'>
						Đăng xuất
					</Button>
				</div>
				{afterChildren}
			</div>

			{/* <OffCanvas
				id='notificationCanvas'
				titleId='offcanvasExampleLabel'
				placement='end'
				isOpen={offcanvasStatus}
				setOpen={setOffcanvasStatus}>
				<OffCanvasHeader setOpen={setOffcanvasStatus}>
					<OffCanvasTitle id='offcanvasExampleLabel'>Notifications</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<Alert icon='ViewInAr' isLight color='info' className='flex-nowrap'>
						4 new components added.
					</Alert>
					<Alert icon='ThumbUp' isLight color='warning' className='flex-nowrap'>
						New products added to stock.
					</Alert>
					<Alert icon='Inventory2' isLight color='danger' className='flex-nowrap'>
						There are products that need to be packaged.
					</Alert>
					<Alert icon='BakeryDining' isLight color='success' className='flex-nowrap'>
						Your food order is waiting for you at the consultation.
					</Alert>
					<Alert icon='Escalator' isLight color='primary' className='flex-nowrap'>
						Escalator will turn off at 6:00 pm.
					</Alert>
				</OffCanvasBody>
			</OffCanvas> */}
		</HeaderRight>
	);
};
CommonHeaderRight.propTypes = {
	beforeChildren: PropTypes.node,
	afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
	beforeChildren: null,
	afterChildren: null,
};

export default CommonHeaderRight;
