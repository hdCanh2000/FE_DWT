import React from 'react';
import { dashboardMenu } from '../menu';
import DashboardHeader from '../pages/common/Headers/DashboardHeader';

const headers = [
	{ path: '/dang-nhap', element: null, exact: true },
	{ path: dashboardMenu.dashboard.path, element: <DashboardHeader />, exact: true },
	{
		path: `*`,
		element: <DashboardHeader />,
	},
];

export default headers;
