import React from 'react';
import { dashboardMenu } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import UserDashboard from './user/UserDashboard';

const DashboardPage = () => {
	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid' className='overflow-hidden'>
				{verifyPermissionHOC(<AdminDashboard />, ['admin'])}
				{verifyPermissionHOC(<ManagerDashboard />, ['manager'])}
				{verifyPermissionHOC(<UserDashboard />, ['user'])}
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
