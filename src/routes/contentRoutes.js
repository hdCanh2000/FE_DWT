import React, { lazy } from 'react';
import { dashboardMenu, demoPages } from '../menu';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};

const TASK = {
	MISSION: lazy(() => import('../pages/work-management/mission/MissionPage')),
	MISSION_DETAIL: lazy(() => import('../pages/work-management/mission/MissionDetailPage')),
	SUBTASK_STEP: lazy(() => import('../pages/work-management/subtask-step/SubTaskPage')),
	TASKMANAGEMENT: lazy(() =>
		import('../pages/work-management/task-management/TaskManagementPage'),
	),
	TASKDETAIL: lazy(() => import('../pages/work-management/TaskDetail/TaskDetailPage')),
	TASKLIST: lazy(() => import('../pages/work-management/task-list/TaskListPage')),
	SUBTASK: lazy(() => import('../pages/work-management/subtask/SubTaskPage')),
	TASKLISTDEPARTMENT: lazy(() =>
		import('../pages/work-management/task-department/TaskDepartmentPage'),
	),
	DETAIL_TASK_DEPARTMENT: lazy(() =>
		import('../pages/work-management/detail-task-department/DetailTaskDepartment'),
	),
	CONFIGURE: lazy(() => import('../pages/work-management/configure/WorkConfigurePage')),
	REPORT: lazy(() => import('../pages/work-management/report-department/ReportDepartmentPage')),
};

const MANAGEMENT = {
	DEPARTMENT: lazy(() => import('../pages/department/DepartmentPage')),
	DEPARTMENT_DETAIL: lazy(() => import('../pages/department/DepartmentDetailPage')),
	EMPLOYEE: lazy(() => import('../pages/employee/EmployeePage')),
	EMPLOYEE_DETAIL: lazy(() => import('../pages/employee/EmployeeDetailPage')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
};

const presentation = [
	/**
	 * Landing
	 */
	{
		path: dashboardMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},

	/** ************************************************** */

	/**
	 * Pages
	 */

	/**
	 * Trang quản lý nhiệm vụ
	 */
	{
		path: demoPages.mucTieu.path,
		element: <TASK.MISSION />,
		exact: true,
	},
	// Trang đầu việc - Step
	{
		path: `/cong-viec-:taskid/dau-viec/:id`,
		element: <TASK.SUBTASK_STEP />,
		exact: true,
	},
	/**
	 * Trang chi tiết nhiệm vụ
	 */
	{
		path: `/muc-tieu/chi-tiet/:id`,
		element: <TASK.MISSION_DETAIL />,
		exact: true,
	},
	/**
	 * Trang quản lý công việc
	 */
	// {
	// 	path: demoPages.quanLyCongViec.subMenu.congViec.path,
	// 	element: <TASK.TASKMANAGEMENT />,
	// 	exact: true,
	// },

	/**
	 * Trang danh sách công việc
	 */
	{
		path: demoPages.quanLyCongViec.path,
		element: <TASK.TASKLIST />,
		exact: true,
	},
	/**
	 * Trang chi tiết công việc theo id
	 */
	// {
	// 	path: `${demoPages.quanLyCongViec.subMenu.congViec.path}/:id`,
	// 	element: <TASK.TASKDETAIL />,
	// 	exact: true,
	// },

	/**
	 * trang quản lý đầu việc
	 */
	// {
	// 	path: demoPages.quanLyCongViec.subMenu.dauViec.path,
	// 	element: <TASK.SUBTASK />,
	// 	exact: true,
	// },
	/**
	 * trang quản lý danh sách công việc theo phòng ban - danh sách dạng bảng
	 */
	// {
	// 	path: demoPages.quanLyCongViec.subMenu.danhSachCongViecPhongBan.path,
	// 	element: <TASK.TASKLISTDEPARTMENT />,
	// 	exact: true,
	// },
	/**
	 * trang quản lý danh sách công việc theo phòng ban - công việc dạng theo đầu nhiệm vụ
	 */
	// {
	// 	path: demoPages.quanLyCongViec.subMenu.chiTietCongViecPhongBan.path,
	// 	element: <TASK.DETAIL_TASK_DEPARTMENT />,
	// 	exact: true,
	// },
	// trang chi tiết công việc
	{
		path: `${demoPages.quanLyCongViec.path}/:id`,
		element: <TASK.TASKDETAIL />,
		exact: true,
	},
	/**
	 * trang công việc phòng ban chi tiết - cấu hình
	 */
	{
		path: demoPages.cauHinh.path,
		element: <TASK.CONFIGURE />,
		exact: true,
	},
	/**
	 * trang công việc phòng ban chi tiết - báo cáo
	 */
	{
		path: demoPages.phongBan.path,
		element: <MANAGEMENT.DEPARTMENT />,
		exact: true,
	},
	{
		path: `${demoPages.phongBan.path}/:id`,
		element: <MANAGEMENT.DEPARTMENT_DETAIL />,
		exact: true,
	},
	{
		path: demoPages.nhanVien.path,
		element: <MANAGEMENT.EMPLOYEE />,
		exact: true,
	},
	{
		path: `${demoPages.nhanVien.path}/:id`,
		element: <MANAGEMENT.EMPLOYEE_DETAIL />,
		exact: true,
	},
	{
		path: demoPages.baoCao.path,
		element: <TASK.REPORT />,
		exact: true,
	},
	{
		path: '*',
		element: <AUTH.PAGE_404 />,
		exact: true,
	},
];

const documentation = [
	/**
	 * Bootstrap
	 */
];

const contents = [...presentation, ...documentation];

export default contents;
