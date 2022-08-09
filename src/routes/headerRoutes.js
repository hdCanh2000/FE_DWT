import React from 'react';
import { dashboardMenu, demoPages, layoutMenu } from '../menu';
import DashboardHeader from '../pages/common/Headers/DashboardHeader';
import CommonHeader from '../pages/common/Headers/CommonHeader';
import DefaultHeader from '../pages/common/Headers/DefaultHeader';

const headers = [
	{ path: layoutMenu.pageLayout.subMenu.onlySubheader.path, element: null, exact: true },
	{ path: layoutMenu.pageLayout.subMenu.onlyContent.path, element: null, exact: true },
	{ path: '/dang-nhap', element: null, exact: true },
	{ path: dashboardMenu.dashboard.path, element: <DashboardHeader />, exact: true },
	// quan ly muc tieu
	{
		path: demoPages.mucTieu.path,
		element: null,
		exact: true,
	},
	// chi tiet muc tieu
	{
		path: `/muc-tieu/chi-tiet/:id`,
		element: null,
		exact: true,
	},

	// chi tiet cong viec
	{
		path: `/cong-viec/:id`,
		element: null,
		exact: true,
	},
	// chi tiết đầu việc -step
	{
		path: `/cong-viec-:taskid/dau-viec/:id`,
		element: null,
		exact: true,
	},

	// danh sach cong viec
	{
		path: demoPages.quanLyCongViec.path,
		element: null,
		exact: true,
	},

	// quản lý phòng ban
	{
		path: demoPages.phongBan.path,
		element: <CommonHeader />,
		exact: true,
	},
	// quản lý nhân viên
	{
		path: demoPages.nhanVien.path,
		element: <CommonHeader />,
		exact: true,
	},
	{
		path: `${demoPages.nhanVien.path}/:id`,
		element: null,
		exact: true,
	},
	// công việc phòng ban chi tiết - cấu hình
	{
		path: demoPages.cauHinh.path,
		element: null,
		exact: true,
	},
	// công việc phòng ban chi tiết - báo cáo
	{
		path: demoPages.baoCao.path,
		element: null,
		exact: true,
	},
	{
		path: `*`,
		element: <DefaultHeader />,
	},
];

export default headers;
