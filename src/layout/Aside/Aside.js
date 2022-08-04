import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { demoPages } from '../../menu';
import Card from '../../components/bootstrap/Card';
import Logo from '../../assets/logos/logo.png';

const Aside = () => {
	return (
		<>
			<div className='position-fixed aside-head top-0 left-0' style={{ maxWidth: 260 }}>
				<Link to='/'>
					<img src={Logo} alt='logo' />
				</Link>
				<Card className='mt-4' style={{ height: '100vh' }}>
					<Navigation menu={demoPages} id='aside-demo-pages' />
				</Card>
			</div>

			{/* <Card style={{ minHeight: '80vh' }}>
				<CardHeader>
					<CardLabel icon='NotificationsActive' iconColor='warning'>
						<CardTitle tag='h4' className='h5'>
							Hoạt động gần đây
						</CardTitle>
						<CardSubTitle>1 tuần trước</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody isScrollable>
					<Timeline>
						<TimelineItem
							label={moment().add(-0.25, 'hours').format('LT')}
							color='primary'>
							Extended license purchased from France.
						</TimelineItem>
						<TimelineItem
							label={moment().add(-4.54, 'hours').format('LT')}
							color='success'>
							<Popovers desc='5 stars' trigger='hover'>
								<span>
									<Icon icon='StarFill' color='warning' />
									<Icon icon='StarFill' color='warning' />
									<Icon icon='StarFill' color='warning' />
									<Icon icon='StarFill' color='warning' />
									<Icon icon='StarFill' color='warning' />
								</span>
							</Popovers>
							<b>, a new rating has been received.</b>
						</TimelineItem>
						<TimelineItem
							label={moment().add(-9.34, 'hours').format('LT')}
							color='warning'>
							Customer's problem solved.
						</TimelineItem>
						<TimelineItem label={moment().add(-1, 'day').fromNow()} color='primary'>
							Regular license purchased from United Kingdom.
						</TimelineItem>
						<TimelineItem label={moment().add(-1, 'day').fromNow()} color='primary'>
							Regular license purchased from Italy.
						</TimelineItem>
						<TimelineItem label={moment().add(-2, 'day').fromNow()} color='info'>
							<span className='text-muted'>
								New version released.{' '}
								<a href='/' className='fw-bold'>
									V12.1.0
								</a>
							</span>
						</TimelineItem>
						<TimelineItem label={moment().add(-3, 'day').fromNow()} color='danger'>
							Market research meeting for new product.
						</TimelineItem>
						<TimelineItem label={moment().add(-7, 'day').fromNow()} color='secondary'>
							Updating, compiling and going live the product introduction page.
						</TimelineItem>
						<TimelineItem label={moment().add(-8, 'day').fromNow()} color='primary'>
							Regular license purchased from Germany.
						</TimelineItem>
					</Timeline>
				</CardBody>
			</Card> */}
		</>
	);
};

export default Aside;

// import React, { useContext, useRef, useState } from 'react';
// import classNames from 'classnames';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import Brand from '../Brand/Brand';
// import Navigation, { NavigationLine } from '../Navigation/Navigation';
// import User from '../User/User';
// import { componentsMenu, dashboardMenu, demoPages, layoutMenu } from '../../menu';
// import ThemeContext from '../../contexts/themeContext';
// import Card, { CardBody } from '../../components/bootstrap/Card';

// import Hand from '../../assets/img/hand.png';
// import HandWebp from '../../assets/img/hand.webp';
// import Icon from '../../components/icon/Icon';
// import Button from '../../components/bootstrap/Button';
// import Tooltips from '../../components/bootstrap/Tooltips';
// import useDarkMode from '../../hooks/useDarkMode';
// import useAsideTouch from '../../hooks/useAsideTouch';

// const Aside = () => {
// 	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

// 	const { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x } = useAsideTouch();

// 	const isModernDesign = process.env.REACT_APP_MODERN_DESGIN === 'true';

// 	const constraintsRef = useRef(null);

// 	const [doc, setDoc] = useState(false);

// 	const { t } = useTranslation(['translation', 'menu']);

// 	const { darkModeStatus } = useDarkMode();

// 	return (
// 		<>
// 			<motion.aside
// 				style={asideStyle}
// 				className={classNames(
// 					'aside',
// 					{ open: asideStatus },
// 					{
// 						'aside-touch-bar': hasTouchButton && isModernDesign,
// 						'aside-touch-bar-close': !touchStatus && hasTouchButton && isModernDesign,
// 						'aside-touch-bar-open': touchStatus && hasTouchButton && isModernDesign,
// 					},
// 				)}>
// 				<div className='aside-head'>
// 					<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
// 				</div>
// 				<div className='aside-body'>
// 					<Navigation menu={dashboardMenu} id='aside-dashboard' />
// 					{!doc && (
// 						<>
// 							<NavigationLine />
// 							<Navigation menu={demoPages} id='aside-demo-pages' />
// 							<NavigationLine />
// 							<Navigation menu={layoutMenu} id='aside-menu' />
// 						</>
// 					)}

// 					{doc && (
// 						<>
// 							<NavigationLine />
// 							<Navigation menu={componentsMenu} id='aside-menu-two' />
// 							<NavigationLine />
// 						</>
// 					)}

// 					{asideStatus && doc && (
// 						<Card className='m-3 '>
// 							<CardBody className='pt-0'>
// 								<img
// 									srcSet={HandWebp}
// 									src={Hand}
// 									alt='Hand'
// 									width={130}
// 									height={130}
// 								/>
// 								<p
// 									className={classNames('h4', {
// 										'text-dark': !darkModeStatus,
// 										'text-light': darkModeStatus,
// 									})}>
// 									{t('Everything is ready!')}
// 								</p>
// 								<Button
// 									color='info'
// 									isLight
// 									className='w-100'
// 									onClick={() => setDoc(false)}>
// 									{t('Demo Pages')}
// 								</Button>
// 							</CardBody>
// 						</Card>
// 					)}
// 				</div>
// 				<div className='aside-foot'>
// 					<nav aria-label='aside-bottom-menu'>
// 						<div className='navigation'>
// 							<div
// 								role='presentation'
// 								className='navigation-item cursor-pointer'
// 								onClick={() => {
// 									setDoc(!doc);
// 								}}
// 								data-tour='documentation'>
// 								<span className='navigation-link navigation-link-pill'>
// 									<span className='navigation-link-info'>
// 										<Icon
// 											icon={doc ? 'ToggleOn' : 'ToggleOff'}
// 											color={doc ? 'success' : null}
// 											className='navigation-icon'
// 										/>
// 										<span className='navigation-text'>
// 											{t('menu:Documentation')}
// 										</span>
// 									</span>
// 									<span className='navigation-link-extra'>
// 										<Icon
// 											icon='Circle'
// 											className={classNames(
// 												'navigation-notification',
// 												'text-success',
// 												'animate__animated animate__heartBeat animate__infinite animate__slower',
// 											)}
// 										/>
// 									</span>
// 								</span>
// 							</div>
// 						</div>
// 					</nav>
// 					<User />
// 				</div>
// 			</motion.aside>
// 			{asideStatus && hasTouchButton && isModernDesign && (
// 				<>
// 					<motion.div className='aside-drag-area' ref={constraintsRef} />
// 					<Tooltips title='Toggle Aside' flip={['top', 'right']}>
// 						<motion.div
// 							className='aside-touch'
// 							drag='x'
// 							whileDrag={{ scale: 1.2 }}
// 							whileHover={{ scale: 1.1 }}
// 							dragConstraints={constraintsRef}
// 							// onDrag={(event, info) => console.log(info.point.x, info.point.y)}
// 							dragElastic={0.1}
// 							style={{ x, zIndex: 1039 }}
// 							onClick={() => x.set(x.get() === 0 ? asideWidthWithSpace : 0)}
// 						/>
// 					</Tooltips>
// 				</>
// 			)}
// 		</>
// 	);
// };

// export default Aside;
