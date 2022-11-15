export const homeMenu = {};

export const dashboardMenu = {
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
	},
};

export const profile = {
	profile: {
		id: 'profile',
		text: 'Profile',
		path: '/thong-tin-ca-nhan',
		subMenu: null,
	},
};

export const demoPages = {
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
		roles: ['admin', 'manager', 'user'],
	},
	companyPage: {
		id: 'companyPage',
		text: 'Cơ cấu tổ chức',
		path: '/co-cau-to-chuc',
		icon: 'CustomCompany',
		roles: ['admin'],
	},
	taskPage: {
		id: 'taskPage',
		text: 'Nhiệm vụ của tôi',
		path: '/cong-viec-hang-ngay',
		icon: 'AssignmentInd',
		roles: ['admin', 'manager', 'user'],
	},
	taskAndAssign: {
		id: 'taskAndAssign',
		text: 'Khai báo nhiệm vụ & Giao việc',
		path: '/giao-viec',
		icon: 'CustomBriefCase',
		subMenu: {
			assign: {
				id: 'assign',
				text: 'Giao việc',
				path: '/giao-viec',
				roles: ['admin', 'manager'],
			},

			pendingAccepted: {
				id: 'pendingAccepted',
				text: 'Công việc chờ duyệt',
				path: '/cong-viec-cho-duyet',
				roles: ['admin', 'manager'],
			},
			kpiNorm: {
				id: 'kpiNorm',
				text: 'Danh mục định mức lao động',
				path: '/khai-bao-nhiem-vu',
				roles: ['admin', 'manager'],
			},
		},
		roles: ['admin', 'manager'],
	},
	employeeAssignTask: {
		id: 'employeeAssignTask',
		text: 'Lập kế hoạch công việc',
		path: '/giao-viec',
		icon: 'CustomBriefCase',
		roles: ['user'],
	},
	mission: {
		id: 'mission',
		text: 'Mục tiêu',
		path: '/muc-tieu',
		icon: 'TaskAlt',
		roles: ['admin'],
	},
	jobsPage: {
		id: 'supervision',
		text: 'Giám sát công việc',
		path: '/giam-sat',
		icon: 'Monitor',
		subMenu: {
			mission: {
				id: 'mission',
				text: 'Danh sách nhiệm vụ',
				path: '/nhiem-vu',
				roles: ['admin', 'manager'],
			},
			employee: {
				id: 'employee',
				text: 'Theo nhân viên',
				path: '/cong-viec-cua-nhan-vien',
				roles: ['admin', 'manager'],
			},
		},
		roles: ['admin', 'manager'],
	},
	hrRecords: {
		id: 'hrRecords',
		text: 'Nhân sự',
		path: '/ho-so-nhan-su',
		icon: 'PersonOutline',
		subMenu: {
			hrList: {
				id: 'hrList',
				text: 'Danh sách nhân sự',
				path: '/danh-sach-nhan-su',
				roles: ['admin'],
			},
			position: {
				id: 'position',
				text: 'Vị trí công việc',
				path: '/vi-tri-cong-viec',
				roles: ['admin'],
			},
			positionLevelConfig: {
				id: 'positionLevelConfig',
				text: 'Cấp nhân sự',
				path: '/cauhinh-cap-nhan-su',
				roles: ['admin'],
			},
		},
		roles: ['admin'],
	},
	reportPage: {
		// báo cáo
		id: 'reportPage',
		text: 'Báo cáo',
		path: 'report-page',
		icon: 'CustomPages',
		subMenu: {
			reportList: {
				id: 'reportList',
				text: 'Xuất báo cáo',
				path: '/danh-sach-bao-cao',
				roles: ['admin'],
			},
			reportCriteria: {
				id: 'reportCriteria',
				text: 'Duyệt báo cáo',
				path: '/tieu-chi-bao-cao',
				roles: ['admin'],
			},
			sampleReport: {
				id: 'sampleReport',
				text: 'Báo cáo lưu',
				path: '/mau-bao-cao',
				roles: ['admin'],
			},
		},
		roles: ['admin'],
	},
	cauHinh: {
		id: 'cauHinh',
		text: 'Cấu hình',
		path: 'cau-hinh',
		icon: 'Settings',
		subMenu: {
			unit: {
				id: 'unit',
				text: 'Đơn vị tính',
				path: '/don-vi-tinh',
				roles: ['admin'],
			},
			recruitmentRequirements: {
				id: 'recruitmentRequirements',
				text: 'Yêu cầu tuyển dụng',
				path: '/yeu-cau-tuyen-dung',
				roles: ['admin'],
			},
			keys: {
				id: 'keys',
				text: 'Chỉ số key',
				path: '/chi-so-key',
				roles: ['admin'],
			},
			overall: {
				id: 'overall',
				text: 'Cấu hình chung',
				path: '/cau-hinh-chung',
				roles: ['admin'],
			},
			organization: {
				id: 'organization',
				text: 'Cấu hình tổ chức',
				path: '/cau-hinh-to-chuc',
				roles: ['admin'],
			},
			report: {
				id: 'report',
				text: 'Cấu hình báo cáo',
				path: '/cau-hinh-bao-cao',
				roles: ['admin'],
			},
			table: {
				id: 'table',
				text: 'Cấu hình bảng số liệu',
				path: '/cau-hinh-bang-so-lieu',
				roles: ['admin'],
			},
		},
		roles: ['admin'],
	},
};

export const layoutMenu = {};

export const componentsMenu = {};

export const productsMenu = {};
