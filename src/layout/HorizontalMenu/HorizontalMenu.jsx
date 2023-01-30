/* eslint-disable */
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import Icon from '../../components/icon/Icon';
import { useNavigate, useNavigation } from 'react-router-dom';
import { findKey, findPath } from '../../helpers/helpers';

const contentRoutes = [
	{
		label: 'Dashboard',
		key: 'dashboard',
		icon: <Icon className='navigation-icon' icon='Dashboard' />,
		roles: ['admin', 'manager'],
		path: '/',
	},
	{
		label: 'Cơ cấu tổ chức',
		key: 'system',
		icon: <Icon className='navigation-icon' icon='CustomCompany' />,
		roles: ['admin'],
		path: '/co-cau-to-chuc',
	},
	{
		label: 'Nhiệm vụ của tôi',
		key: 'mytask',
		icon: <Icon className='navigation-icon' icon='AssignmentInd' />,
		roles: ['admin', 'manager', 'user'],
		path: '/cong-viec-hang-ngay',
	},
	{
		label: 'Khai báo nhiệm vụ và giao việc',
		key: 'declareAndAssign',
		icon: <Icon className='navigation-icon' icon='CustomBriefCase' />,
		children: [
			{
				type: 'group',
				label: 'Khai báo',
				children: [
					{
						label: 'Khai báo nhiệm vụ',
						key: 'declareTarget',
						path: '/khai-bao-nhiem-vu',
					},
					{
						label: 'Khai báo tiêu chí ngày',
						key: 'declareDailyWork',
						path: '/khai-bao-tieu-chi-ngay',
					},
				],
			},
			{
				type: 'group',
				label: 'Giao viêc',
				children: [
					{
						label: 'Giao nhiệm vụ',
						key: 'assignTarget',
						path: '/giao-viec',
					},
					{
						label: 'Giao công việc hàng ngày',
						key: 'assignDailyWork',
						path: '/giao-tieu-chi-ngay',
					},
				],
			},
		],
		roles: ['admin', 'manager'],
	},
	{
		label: 'Lập kế hoạch công việc',
		key: 'plan',
		icon: <Icon className='navigation-icon' icon='CustomBriefCase' />,
		roles: ['user'],
		path: '/giao-viec',
	},
	{
		label: 'Mục tiêu',
		key: 'missions',
		icon: <Icon className='navigation-icon' icon='TaskAlt' />,
		roles: ['admin'],
		path: '/muc-tieu',
	},
	{
		label: 'Giám sát công việc',
		key: 'supervise',
		icon: <Icon className='navigation-icon' icon='Monitor' />,
		roles: ['admin', 'manager'],
		children: [
			{
				label: 'Danh sách nhiệm vụ',
				key: 'listTarget',
				path: '/nhiem-vu',
			},
			{
				label: 'Theo nhân viên',
				key: 'listTargetByUser',
				path: '/cong-viec-cua-nhan-vien',
			},
		],
	},

	{
		label: 'Nhân sự',
		key: 'hr',
		icon: <Icon className='navigation-icon' icon='PersonOutline' />,
		roles: ['admin'],
		children: [
			{
				label: 'Danh sách nhân sự',
				key: 'listHr',
				path: '/danh-sach-nhan-su',
			},
			{
				label: 'Vị trí công việc',
				key: 'listPositions',
				path: '/vi-tri-cong-viec',
			},
			{
				label: 'Cấp nhân sự',
				key: 'positionLevelConfig',
				path: '/cauhinh-cap-nhan-su',
			},
		],
	},

	{
		label: 'Báo cáo',
		key: 'report',
		icon: <Icon className='navigation-icon' icon='CustomPages' />,
		roles: ['admin', 'user', 'manager'],
		children: [
			{
				label: 'Xuất báo cáo',
				key: 'listReports',
				path: '/danh-sach-bao-cao',
				roles: ['admin', 'manager'],
			},
			{
				label: 'Duyệt báo cáo',
				key: 'reportCriteria',
				path: '/tieu-chi-bao-cao',
			},
			{
				label: 'Báo cáo lưu',
				key: 'sampleReport',
				path: '/mau-bao-cao',
			},
			{
				label: 'Biên bản họp',
				key: 'meetingReport',
				path: '/bien-ban-hop',
			},
		],
	},

	{
		label: 'Cấu hình',
		key: 'config',
		icon: <Icon className='navigation-icon' icon='Settings' />,
		roles: ['admin'],
		children: [
			{
				label: 'Đơn vị tính',
				key: 'units',
				path: '/don-vi-tinh',
			},
			{
				label: 'Yêu cầu tuyển dụng',
				key: 'recruitmentRequirements',
				path: '/yeu-cau-tuyen-dung',
			},
			{
				label: 'Chỉ số key',
				key: 'keys',
				path: '/chi-so-key',
			},
			{
				label: 'Cấu hình chung',
				key: 'overall',
				path: '/cau-hinh-chung',
			},
			{
				key: 'organization',
				label: 'Cấu hình tổ chức',
				path: '/cau-hinh-to-chuc',
			},
			{
				key: 'configReport',
				label: 'Cấu hình báo cáo',
				path: '/cau-hinh-bao-cao',
			},
			{
				key: 'table',
				label: 'Cấu hình bảng số liệu',
				path: '/cau-hinh-bang-so-lieu',
			},
		],
	},
];
const HorizontalMenu = () => {
	const navigate = useNavigate();
	const [current, setCurrent] = useState('mail');
	const roles = window.localStorage.getItem('roles') || '[""]';
	const rolesArr = JSON.parse(roles);
	const role = rolesArr[0];
	const menuItems = contentRoutes.filter((item) => item.roles.includes(role));
	const onClick = (e) => {
		setCurrent(e.key);
		const path = findPath(contentRoutes, e.key);
		if (!path) {
			navigate('/404');
			return;
		}
		navigate(path);
	};
	useEffect(() => {
		const currentPath = window.location.pathname;
		const key = findKey(contentRoutes, currentPath);
		if (!key) {
			return;
		}
		setCurrent(key);
	}, [window.location.pathname]);
	return (
		<div
			style={{
				marginLeft: '10px',
			}}>
			<Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={menuItems} />
		</div>
	);
};

export default HorizontalMenu;
