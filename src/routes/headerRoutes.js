import React from 'react';
import { dashboardMenu, layoutMenu } from '../menu';
import DashboardHeader from '../pages/common/Headers/DashboardHeader';

const headers = [
	{ path: layoutMenu.pageLayout.subMenu.onlySubheader.path, element: null, exact: true },
	{ path: layoutMenu.pageLayout.subMenu.onlyContent.path, element: null, exact: true },
	{ path: '/dang-nhap', element: null, exact: true },
	{ path: dashboardMenu.dashboard.path, element: <DashboardHeader />, exact: true },
	{
		path: `*`,
		element: <DashboardHeader />,
	},
];

export default headers;
