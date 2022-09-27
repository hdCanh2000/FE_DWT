import React, { lazy } from 'react';
import { dashboardMenu, demoPages } from '../menu';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};

const MISSION = {
	MISSION: lazy(() => import('../pages/work-management/mission/MissionPage')),
	MISSION_DETAIL: lazy(() => import('../pages/work-management/mission/MissionDetailPage')),
};
const TASKBYUSER = {
	TASKBYUSER: lazy(() => import('../pages/taskByUser/TaskByUser')),
};
const DAILYWORKTRACKING = {
	DAILYWORKTRACKING: lazy(() => import('../pages/dailyWorkTracking/dailyWorkTracking')),
};
const TASK = {
	SUBTASK_STEP: lazy(() => import('../pages/work-management/subtask-step/SubTaskPage')),
	TASKMANAGEMENT: lazy(() =>
		import('../pages/work-management/task-management/TaskManagementPage'),
	),
	TASKDETAIL: lazy(() => import('../pages/work-management/TaskDetail/TaskDetailPage')),
	ADD_OR_UPDATE_TASK: lazy(() => import('../pages/work-management/task-list/TaskActionsPage')),
	ADD_OR_UPDATE_SUB_TASK: lazy(() =>
		import('../pages/work-management/subtask/TaskDetailActionPage'),
	),
	ADD_NEW_TASK: lazy(() => import('../pages/work-management/task-list/AddTaskPage')),
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
	EMPLOYEE: lazy(() => import('../pages/employee/EmployeePage')),
	EMPLOYEE_DETAIL: lazy(() => import('../pages/employee/EmployeeDetailPage')),
	POSITION: lazy(() => import('../pages/position/PositionPage')),
	RECRUITMENT_REQUIREMENT: lazy(() =>
		import('../pages/recruitmentRequirements/RecruitmentRequirementsPage'),
	),
	PERMISSION: lazy(() => import('../pages/config/configPermission/ConfigPermissionPage')),
};
const POSITION_LEVEL_CONFIG = {
	POSITION_LEVEL_CONFIG: lazy(() => import('../pages/positionLevelConfig/positionLevelConfig')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
};

const KEY = {
	KEY: lazy(() => import('../pages/key/keyPage')),
};
const UNIT = {
	UNIT: lazy(() => import('../pages/unit/unitPage')),
};

const KPINORM = {
	KPINORM: lazy(() => import('../pages/kpiNorm/kpiNorm')),
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
	/** Trang quản lý mục tiêu */
	{
		path: demoPages.jobsPage.subMenu.target.path,
		element: <MISSION.MISSION />,
		exact: true,
	},
	/** Trang chi tiết mục tiêu */
	{
		path: `/${demoPages.jobsPage.subMenu.target.path}/:id`,
		element: <MISSION.MISSION_DETAIL />,
		exact: true,
	},
	/** * Trang danh sách công việc (nhiệm vụ cha) */
	{
		path: demoPages.jobsPage.subMenu.mission.path,
		element: <TASK.TASKLIST />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.taskByUser.path,
		element: <TASKBYUSER.TASKBYUSER />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.dailyWorkTracking.path,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKING />,
		exact: true,
	},
	// trang chi tiết công việc (nhiệm vụ)
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/:id`,
		element: <TASK.TASKDETAIL />,
		exact: true,
	},
	// trang thêm mới công việc (nhiệm vụ)
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/them-moi`,
		element: <TASK.ADD_OR_UPDATE_TASK />,
		exact: true,
	},
	// trang cập nhật công việc (nhiệm vụ)
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/cap-nhat/:id`,
		element: <TASK.ADD_OR_UPDATE_TASK />,
		exact: true,
	},
	// trang thêm mới đầu việc (nhiệm vụ con) với nhiệm vụ
	{
		path: `${demoPages.jobsPage.subMenu.task.path}/:taskId/them-moi`,
		element: <TASK.ADD_OR_UPDATE_SUB_TASK />,
		exact: true,
	},
	// trang thêm mới đầu việc (nhiệm vụ con)
	{
		path: `${demoPages.jobsPage.subMenu.task.path}/them-moi`,
		element: <TASK.ADD_OR_UPDATE_SUB_TASK />,
		exact: true,
	},
	// trang cập nhật đầu việc (nhiệm vụ con) với nhiệm vụ
	{
		path: `${demoPages.jobsPage.subMenu.task.path}/:taskId/cap-nhat/:id`,
		element: <TASK.ADD_OR_UPDATE_SUB_TASK />,
		exact: true,
	},
	// trang cập nhật đầu việc (nhiệm vụ con)
	{
		path: `${demoPages.jobsPage.subMenu.task.path}/cap-nhat/:id`,
		element: <TASK.ADD_OR_UPDATE_SUB_TASK />,
		exact: true,
	},
	// trang danh sách đầu việc
	{
		path: `${demoPages.jobsPage.subMenu.task.path}`,
		element: <TASK.SUBTASK />,
		exact: true,
	},
	// trang chi tiết đầu việc (nhiệm vụ con)
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/dau-viec/:id`,
		element: <TASK.SUBTASK_STEP />,
		exact: true,
	},
	// trang danh sách nhân sự
	{
		path: `${demoPages.hrRecords.subMenu.hrList.path}`,
		element: <MANAGEMENT.EMPLOYEE />,
		exact: true,
	},
	// trang danh sách nhân sự
	{
		path: `${demoPages.hrRecords.subMenu.hrList.path}/:id`,
		element: <MANAGEMENT.EMPLOYEE_DETAIL />,
		exact: true,
	},
	// trang danh sách phòng ban
	{
		path: `${demoPages.companyPage.path}`,
		element: <MANAGEMENT.DEPARTMENT />,
		exact: true,
	},
	// Quản lý Vị Trí
	{
		path: demoPages.hrRecords.subMenu.position.path,
		element: <MANAGEMENT.POSITION />,
	},
	// Quản lý chỉ số key
	// cấu hình - configure
	// cấu hình kpi
	// {
	// 	path: `${demoPages.hrRecords.subMenu.position.path}/:id`,
	// 	element: <MANAGEMENT.POSITION_DETAIL />,
	// 	exact: true,
	// },
	// Quản lý Keys
	{
		path: demoPages.cauHinh.subMenu.kpi.path,
		element: <KEY.KEY />,
		exact: true,
	},
	// Quản lý đơn vị
	{
		path: demoPages.cauHinh.subMenu.unit.path,
		element: <UNIT.UNIT />,
	},
	// cấu hình role & permission
	{
		path: demoPages.cauHinh.subMenu.authorization.path,
		element: <MANAGEMENT.PERMISSION />,
	},
	{
		path: demoPages.cauHinh.subMenu.kpiNorm.path,
		element: <KPINORM.KPINORM />,
		exact: true,
	},
	// trang quản lí cấp nhân sư
	{
		path: demoPages.cauHinh.subMenu.positionLevelConfig.path,
		element: <POSITION_LEVEL_CONFIG.POSITION_LEVEL_CONFIG />,
		exact: true,
	},
	// yêu cầu năng luc tuyển dụng
	{
		path: demoPages.cauHinh.subMenu.recruitmentRequirements.path,
		element: <MANAGEMENT.RECRUITMENT_REQUIREMENT />,
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
