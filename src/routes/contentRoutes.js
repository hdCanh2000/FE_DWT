import React, { lazy } from 'react';
import { dashboardMenu, demoPages, profile } from '../menu';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
};

const TASKBYUSER = {
	TASKBYUSER: lazy(() => import('../pages/taskByUser/TaskByUser')),
};
const DAILYWORKTRACKING = {
	DAILYWORKTRACKING: lazy(() => import('../pages/dailyWorkTracking/DailyWorkTracking')),
	DAILYWORKTRACKINGUSER: lazy(() => import('../pages/dailyWorkTracking/DailyWorktrackingUser')),
	DAILYWORKTRACKINGME: lazy(() => import('../pages/dailyWorkTracking/DailyWorkTrackMe')),
	ORDERTASK: lazy(() => import('../pages/work-management/orderTask/OrderTaskPage')),
	PEDINGWORKTRACKPAGE: lazy(() => import('../pages/pendingWorktrack/PendingWorktrackPage')),
};

const MANAGEMENT = {
	DEPARTMENT: lazy(() => import('../pages/department/DepartmentPage')),
	EMPLOYEE: lazy(() => import('../pages/employee/EmployeePage')),
	POSITION: lazy(() => import('../pages/position/PositionPage')),
	RECRUITMENT_REQUIREMENT: lazy(() =>
		import('../pages/recruitmentRequirements/RecruitmentRequirementsPage'),
	),
	PERMISSION: lazy(() => import('../pages/config/configPermission/ConfigPermissionPage')),
};
const POSITION_LEVEL_CONFIG = {
	POSITION_LEVEL_CONFIG: lazy(() => import('../pages/positionLevelConfig/PositionLevelConfig')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
};
const PROFILE = {
	PROFILE: lazy(() => import('../pages/information/Information')),
};
const UNIT = {
	UNIT: lazy(() => import('../pages/unit/unitPage')),
};
const KEY = {
	KEY: lazy(() => import('../pages/keys/Keys')),
};

const KPINORM = {
	KPINORM: lazy(() => import('../pages/kpiNorm/KpiNorm')),
};

const MISSION = {
	MISSION: lazy(() => import('../pages/work-management/mission/MissionPage')),
};

const presentation = [
	{
		path: dashboardMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.mission.path,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKING />,
		exact: true,
	},
	{
		path: demoPages.jobsPage.subMenu.employee.path,
		element: <TASKBYUSER.TASKBYUSER />,
		exact: true,
	},
	{
		path: `${demoPages.taskPage.path}`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGME />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.employee.path}/:id`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGUSER />,
		exact: true,
	},
	{
		path: `${demoPages.jobsPage.subMenu.mission.path}/:id`,
		element: <DAILYWORKTRACKING.DAILYWORKTRACKINGUSER />,
		exact: true,
	},
	{
		path: `${demoPages.taskAndAssign.subMenu.assign.path}`,
		element: <DAILYWORKTRACKING.ORDERTASK />,
		exact: true,
	},
	{
		path: `${demoPages.employeeAssignTask.path}`,
		element: <DAILYWORKTRACKING.ORDERTASK />,
		exact: true,
	},
	{
		path: `${demoPages.hrRecords.subMenu.hrList.path}`,
		element: <MANAGEMENT.EMPLOYEE />,
		exact: true,
	},
	{
		path: `${demoPages.companyPage.path}`,
		element: <MANAGEMENT.DEPARTMENT />,
		exact: true,
	},
	{
		path: demoPages.hrRecords.subMenu.position.path,
		element: <MANAGEMENT.POSITION />,
	},
	{
		path: demoPages.cauHinh.subMenu.unit.path,
		element: <UNIT.UNIT />,
	},
	{
		path: demoPages.cauHinh.subMenu.keys.path,
		element: <KEY.KEY />,
	},
	{
		path: demoPages.taskAndAssign.subMenu.kpiNorm.path,
		element: <KPINORM.KPINORM />,
		exact: true,
	},
	{
		path: demoPages.hrRecords.subMenu.positionLevelConfig.path,
		element: <POSITION_LEVEL_CONFIG.POSITION_LEVEL_CONFIG />,
		exact: true,
	},
	{
		path: demoPages.cauHinh.subMenu.recruitmentRequirements.path,
		element: <MANAGEMENT.RECRUITMENT_REQUIREMENT />,
	},
	{
		path: demoPages.mission.path,
		element: <MISSION.MISSION />,
	},
	{
		path: demoPages.taskAndAssign.subMenu.pendingAccepted.path,
		element: <DAILYWORKTRACKING.PEDINGWORKTRACKPAGE />,
	},
	{
		path: profile.profile.path,
		element: <PROFILE.PROFILE />,
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
