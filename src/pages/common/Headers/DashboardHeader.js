import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
// import CommonHeaderChat from './CommonHeaderChat';
// import Search from '../../../components/Search';
import CommonHeaderRight from './CommonHeaderRight';
import USERS from '../../../common/data/userDummyData';
import Avatar from '../../../components/Avatar';

const DashboardHeader = () => {
	const userName = window.localStorage.getItem('name');
	const email = window.localStorage.getItem('email');

	return (
		<Header>
			<HeaderLeft>{/* <Search /> */}</HeaderLeft>
			{/* <CommonHeaderRight afterChildren={<CommonHeaderChat />} /> */}
			<CommonHeaderRight
				afterChildren={
					<div
						className='col d-flex align-items-center cursor-pointer'
						role='presentation'>
						<div className='me-3'>
							<div className='text-end'>
								<div className='fw-bold fs-6 mb-0'>{userName}</div>
								<div className='text-muted'>
									<small>{email}</small>
								</div>
							</div>
						</div>
						<div className='position-relative'>
							<Avatar
								srcSet={USERS.CHLOE.srcSet}
								src={USERS.CHLOE.src}
								size={48}
								color={USERS.CHLOE.color}
							/>
							<span className='position-absolute top-85 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
								<span className='visually-hidden'>Online user</span>
							</span>
						</div>
					</div>
				}
			/>
		</Header>
	);
};

export default DashboardHeader;
