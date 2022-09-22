import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Spinner } from 'react-bootstrap';
import { dashboardMenu, demoPages } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Button, { ButtonGroup } from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import useDarkMode from '../../hooks/useDarkMode';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Progress from '../../components/bootstrap/Progress';
import { getAllDepartments } from '../work-management/mission/services';
import { FORMAT_TASK_STATUS, formatColorStatus, formatColorPriority } from '../../utils/constants';
import Alert from '../../components/bootstrap/Alert';
import {
	getAllSubTasksByUser,
	getAllTasksByDepartment,
	getReportMisson,
	getReportSubTask,
	getReportSubTaskDepartment,
	getReportTask,
} from './services';
import MissionChartReport from './admin/MissionChartReport';
import TaskChartReport from './admin/TaskChartReport';
import Chart from '../../components/extras/Chart';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';

const DashboardPage = () => {
	const { darkModeStatus, themeStatus } = useDarkMode();
	const navigate = useNavigate();
	const handleOnClickToMissionListPage = useCallback(
		() => navigate(`../${demoPages.jobsPage.subMenu.target.path}`),
		[navigate],
	);
	// departments
	const [dataDepartments, setDataDepartments] = useState([]);
	// mission
	const [missionReport, setMissionReport] = useState(null);

	// task
	const [tasks, setTasks] = useState([]);
	const [taskReport, setTaskReport] = useState(null);

	// subtask
	const [subtasks, setSubTasks] = useState([]);
	const [subTaskReport, setSubTaskReport] = useState(null);
	const [subTaskReportDepartment, setSubTaskReportDepartment] = useState(null);

	// select department
	const [departmentSelect, setDepartmentSelect] = useState(1);

	const columnTasks = [
		{
			title: 'Tên công việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian dự kiến',
			id: 'estimateDate',
			key: 'estimateDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Giá trị KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
		},
		{
			title: 'KPI thực tế',
			id: 'currentKpi',
			key: 'currentKpi',
			type: 'number',
			render: (item) => <span>{item.currentKPI}</span>,
			align: 'center',
		},
		{
			title: 'Độ ưu tiên',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							[`border-${themeStatus}`],
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`Cấp ${item.priority}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'number',
			render: (item) => (
				<Button
					isLink
					color={formatColorStatus(item.status)}
					icon='Circle'
					className='text-nowrap'>
					{FORMAT_TASK_STATUS(item.status)}
				</Button>
			),
		},
	];

	const columnSubTasks = [
		{
			title: 'Tên đầu việc',
			id: 'name',
			key: 'name',
			type: 'text',
			render: (item) => (
				<Link
					className='text-underline'
					to={`${demoPages.jobsPage.subMenu.mission.path}/${item.id}`}>
					{item.name}
				</Link>
			),
		},
		{
			title: 'Thời gian dự kiến',
			id: 'estimateDate',
			key: 'estimateDate',
			type: 'text',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Hạn hoàn thành',
			id: 'deadlineDate',
			key: 'deadlineDate',
			format: (value) => `${moment(`${value}`).format('DD-MM-YYYY')}`,
			align: 'center',
		},
		{
			title: 'Tiến độ',
			id: 'progress',
			key: 'progress',
			type: 'text',
			minWidth: 100,
			render: (item) => (
				<div className='d-flex align-items-center flex-column'>
					<div className='flex-shrink-0 me-3'>{`${item.progress}%`}</div>
					<Progress
						className='flex-grow-1'
						isAutoColor
						value={item.progress}
						style={{
							height: 10,
							width: '100%',
						}}
					/>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Giá trị KPI',
			id: 'kpiValue',
			key: 'kpiValue',
			type: 'number',
			align: 'center',
		},
		{
			title: 'Độ ưu tiên',
			id: 'priority',
			key: 'priority',
			type: 'text',
			render: (item) => (
				<div className='d-flex align-items-center'>
					<span
						style={{
							paddingRight: '1rem',
							paddingLeft: '1rem',
						}}
						className={classNames(
							'badge',
							'border border-2',
							[`border-${themeStatus}`],
							'bg-success',
							'pt-2 pb-2 me-2',
							`bg-${formatColorPriority(item.priority)}`,
						)}>
						<span className=''>{`Cấp ${item.priority}`}</span>
					</span>
				</div>
			),
			align: 'center',
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'number',
			render: (item) => (
				<Button
					isLink
					color={formatColorStatus(item.status)}
					icon='Circle'
					className='text-nowrap'>
					{FORMAT_TASK_STATUS(item.status)}
				</Button>
			),
		},
	];

	const [year, setYear] = useState(Number(moment().format('YYYY')));
	const companies = [
		{ name: 'Kênh OTC' },
		{ name: 'Kênh ETC' },
		{ name: 'Kênh MT' },
		{ name: 'Kênh Online' },
	];
	const COMPANIES_TAB = {
		COMP1: companies[0].name,
		COMP2: companies[1].name,
		COMP3: companies[2].name,
		COMP4: companies[3].name,
	};
	const [activeCompanyTab, setActiveCompanyTab] = useState(COMPANIES_TAB.COMP1);

	const search = [
		// { name: 'Tuần' },
		{ name: '30 Ngày' },
		{ name: 'Tháng' },
		{ name: 'Quý' },
		{ name: 'Năm' }
	];
	const SEARCH_TAB = {
		COMP1: search[0].name,
		COMP2: search[1].name,
		COMP3: search[2].name,
		COMP4: search[3].name,
	};
	const [searchTab, setSearchTab] = useState(SEARCH_TAB.COMP1);

	function randomize(value, x = year) {
		if (x === 2019) {
			if (value.toFixed(0) % 2) {
				return (value * 1.5).toFixed(2);
			}
			return (value / 1.4).toFixed(2);
		}
		if (x === 2020) {
			if (value.toFixed(0) % 2) {
				return (value / 1.5).toFixed(2);
			}
			return (value * 1.4).toFixed(2);
		}
		if (x === 2021) {
			if (value.toFixed(0) % 2) {
				return (value / 2).toFixed(2);
			}
			return (value * 1.4).toFixed(2);
		}
		return value.toFixed(2);
	}
	function getDate(day) {
		const arr = [];
		for (let i = 0; i < day; i += 1) {
			arr.push(
				moment()
					.add(-1 * i, 'day')
					.format('ll'),
			);
		}
		return arr.reverse();
	}
	function getYear(day) {
		const arr = [];
		for (let i = 0; i < day; i += 1) {
			arr.push(
				moment()
					.add(-1 * i, 'year')
					.format('YYYY'),
			);
		}
		arr.sort();
		return arr;
	}
	const salesByStoreOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập ( Triệu )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nhập Năm Ngoái',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập Năm Ngoái',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};

	const dayOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: getDate(30),
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập ( Triệu )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const dayStoreSeries = [
		{
			name: 'Thu Nhập Tháng Này',
			type: 'column',
			data: [
				11, 15, 9, 18, 20, 22, 15, 11, 15, 9, 18, 20, 22, 15, 11, 15, 9, 18, 20, 22, 15, 11, 15, 9, 18, 20, 22, 15, 25, 30
			],
		},
	];
	const monthOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập ( Triệu )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nhập Năm Ngoái',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập Năm Ngoái',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const monthStoreSeries = [
		{
			name: 'Thu Nhập Năm Nay',
			type: 'column',
			data: [
				randomize(140),
				randomize(200),
				randomize(250),
				randomize(275),
				randomize(295),
				randomize(314),
				randomize(388),
				randomize(406),
				randomize(410),
				randomize(356),
				randomize(468),
				randomize(555),
			],
		},
		{
			name: 'Thu Nhập Năm Trước',
			type: 'column',
			data: [
				randomize(100),
				randomize(150),
				randomize(200),
				randomize(225),
				randomize(250),
				randomize(300),
				randomize(333),
				randomize(388),
				randomize(400),
				randomize(350),
				randomize(456),
				randomize(501),
			],
		},
	];
	const quarterOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				"Quý 1",
				"Quý 2",
				"Quý 3",
				"Quý 4",
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập ( Triệu )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Thu Nhập Năm Ngoái',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập Năm Ngoái',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const quarterStoreSeries = [
		{
			name: 'Thu Nhập Quý Năm Nay',
			type: 'column',
			data: [
				300, 450, 500, 700
			],
		},
		{
			name: 'Thu Nhập Quý Năm Trước',
			type: 'column',
			data: [
				250, 300, 400, 650
			],
		},
	];
	const yearOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: getYear(6),
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Thu Nhập ( Triệu )',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},

		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const yearStoreSeries = [
		{
			// name: 'Thu Nhập Quý Năm Nay',
			type: 'column',
			data: [
				300, 450, 500, 600, 700, 800
			],
		},
	];

	const salesByStoreSeries1 = [
		{
			name: 'Thu Nhập Năm Nay',
			type: 'column',
			data: [
				randomize(140),
				randomize(200),
				randomize(250),
				randomize(275),
				randomize(295),
				randomize(314),
				randomize(388),
				randomize(406),
				randomize(410),
				randomize(356),
				randomize(468),
				randomize(555),
			],
		},
		{
			name: 'Thu Nhập Năm Ngoái',
			type: 'column',
			data: [
				randomize(100),
				randomize(150),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(267),
				randomize(300),
				randomize(350),
				randomize(360),
				randomize(300),
				randomize(400),
				randomize(488),
			],
		},
	];
	const salesByStoreSeries2 = [
		{
			name: 'Thu Nhập Năm Nay',
			type: 'column',
			data: [
				randomize(234),
				randomize(456),
				randomize(371),
				randomize(499),
				randomize(378),
				randomize(678),
				randomize(567),
				randomize(789),
				randomize(460),
				randomize(575),
				randomize(661),
				randomize(515),
			],
		},
		{
			name: 'Thu Nhập Năm Ngoái',
			type: 'column',
			data: [
				randomize(100),
				randomize(150),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(250),
				randomize(300),
				randomize(300),
				randomize(400),
				randomize(300),
				randomize(400),
				randomize(444),
			],
		},
	];
	const salesByStoreSeries3 = [
		{
			name: 'Thu Nhập Năm Nay',
			type: 'column',
			data: [
				randomize(477),
				randomize(323),
				randomize(241),
				randomize(478),
				randomize(268),
				randomize(379),
				randomize(344),
				randomize(486),
				randomize(580),
				randomize(680),
				randomize(480),
				randomize(370),
			],
		},
		{
			name: 'Thu Nhập Năm Ngoái',
			type: 'column',
			data: [
				randomize(100),
				randomize(155),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(300),
				randomize(300),
				randomize(355),
				randomize(356),
				randomize(299),
				randomize(400),
				randomize(499),
			],
		},
	];
	const salesByStoreSeries4 = [
		{
			name: 'Thu Nhập Năm Nay',
			type: 'column',
			data: [
				randomize(354),
				randomize(366),
				randomize(264),
				randomize(575),
				randomize(313),
				randomize(278),
				randomize(470),
				randomize(420),
				randomize(579),
				randomize(615),
				randomize(311),
				randomize(692),
			],
		},
		{
			name: 'Thu Nhập Năm Ngoái',
			type: 'column',
			data: [
				randomize(100),
				randomize(180),
				randomize(200),
				randomize(200),
				randomize(200),
				randomize(300),
				randomize(300),
				randomize(388),
				randomize(377),
				randomize(300),
				randomize(400),
				randomize(478),
			],
		},
	];

	// all department
	useEffect(() => {
		const fetchData = async () => {
			const response = await getAllDepartments();
			const result = await response.data;
			setDataDepartments(
				result
					.reverse()
					.concat({
						id: 1,
						name: 'Tất cả',
					})
					.reverse(),
			);
		};
		fetchData();
	}, []);

	// get all misisons
	useEffect(() => {
		const fetchDataReport = async () => {
			const response = await getReportMisson();
			const result = await response.data;
			setMissionReport(result);
		};
		fetchDataReport();
	}, []);

	// task by department
	useEffect(() => {
		const fetchDataTaskByDepartment = async () => {
			const response = await getAllTasksByDepartment(departmentSelect, { type: 2 });
			const result = await response.data;
			setTasks(result);
		};
		const fetchDataReportTaskByDepartment = async () => {
			const response = await getReportTask({ departmentId: departmentSelect });
			const result = await response.data;
			setTaskReport(result);
		};
		fetchDataReportTaskByDepartment();
		fetchDataTaskByDepartment();
	}, [departmentSelect]);

	// subtask
	useEffect(() => {
		const fetchDataSubtasks = async () => {
			const response = await getAllSubTasksByUser();
			const result = await response.data;
			setSubTasks(result);
		};
		const fetchDataSubtasksReport = async () => {
			const response = await getReportSubTask();
			const result = await response.data;
			setSubTaskReport(result);
		};
		const fetchDataSubtasksReportDepartment = async () => {
			const response = await getReportSubTaskDepartment();
			const result = await response.data;
			setSubTaskReportDepartment(result);
		};
		fetchDataSubtasks();
		fetchDataSubtasksReport();
		fetchDataSubtasksReportDepartment();
	}, []);

	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
			<Page container='fluid overflow-hidden'>
				<div className='row'>
					{verifyPermissionHOC(
						<div className='col-xxl-12'>
							<Card className='h-100'>
								<CardHeader>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống Kê Doanh Thu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
									<CardActions>
										<ButtonGroup>
											{search.map((element) => (
												<div key={element.name} >
													<Button
														isLight={
															searchTab !== element.name
														}
														onClick={() =>
															setSearchTab(element.name)
														}
														color={themeStatus}
													>
														{element.name}
													</Button>
												</div>
											))}
										</ButtonGroup>
										{searchTab === "30 Ngày" || searchTab === "Năm" ? (
											null
										) : (
											<ButtonGroup>
												<Button
													color='primary'
													isLight
													icon='ChevronLeft'
													aria-label='Previous Year'
													isDisable={year <= 2019}
													onClick={() => {
														setYear(year - 1)
														setSearchTab('')
													}}
												/>
												<Button color='primary' isLight
												>
													{year}
												</Button>
												<Button
													color='primary'
													isLight
													icon='ChevronRight'
													aria-label='Next Year'
													isDisable={year >= 2021}
													onClick={() => {
														setYear(year + 1)
														setSearchTab('')
													}}
												/>
											</ButtonGroup>
										)}
									</CardActions>
								</CardHeader>
								<CardBody>
									<div className='row'>
										<div className='col-xl-3 col-xxl-2'>
											<div className='row g-3'>
												{companies.map((company) => (
													<div
														key={company.name}
														className='col-xl-12 col-lg-6 col-sm-12'>
														<Button
															isLight={
																activeCompanyTab !== company.name
															}
															onClick={() =>
																setActiveCompanyTab(company.name)
															}
															color={themeStatus}
															className='w-100 py-4'
															shadow='sm'
															hoverShadow='none'>
															{company.name}
														</Button>
													</div>
												))}
											</div>
										</div>
										<div className='col-xl-9 col-xxl-10'>
											<Chart
												series={
													(searchTab === SEARCH_TAB.COMP1 &&
														dayStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP2 &&
														monthStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP3 &&
														quarterStoreSeries) ||
													(searchTab === SEARCH_TAB.COMP4 &&
														yearStoreSeries) ||
													(activeCompanyTab === COMPANIES_TAB.COMP1 &&
														salesByStoreSeries1) ||
													(activeCompanyTab === COMPANIES_TAB.COMP2 &&
														salesByStoreSeries2) ||
													(activeCompanyTab === COMPANIES_TAB.COMP3 &&
														salesByStoreSeries3) ||
													salesByStoreSeries4
												}
												options={
													(searchTab === SEARCH_TAB.COMP1 &&
														dayOptions) ||
													(searchTab === SEARCH_TAB.COMP2 &&
														monthOptions) ||
													(searchTab === SEARCH_TAB.COMP3 &&
														quarterOptions) ||
													(searchTab === SEARCH_TAB.COMP4 &&
														yearOptions) ||
													salesByStoreOptions
												}
												type={salesByStoreOptions.chart.type}
												height={salesByStoreOptions.chart.height}
											/>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
				</div>
				<div className='row mt-4'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê mục tiêu
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
									<CardActions>
										<Button
											icon='ArrowForwardIos'
											aria-label='Read More'
											hoverShadow='default'
											rounded={1}
											color={darkModeStatus ? 'dark' : null}
											onClick={handleOnClickToMissionListPage}
										/>
									</CardActions>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div
											className='col-xl-12 col-xxl-12'
											style={{ textAlign: 'center' }}>
											{missionReport === null ? (
												<div style={{ height: '262px' }}>
													<Spinner
														animation='border'
														variant='primary'
														style={{
															marginTop: '15%',
															width: '50px',
															height: '50px',
														}}
													/>
												</div>
											) : (
												<MissionChartReport data={missionReport} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê công việc
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
									{verifyPermissionHOC(
										<CardActions>
											<Dropdown>
												<DropdownToggle hasIcon={false}>
													<Button
														color='primary'
														icon='Circle'
														className='text-nowrap'>
														{
															dataDepartments.filter(
																(item) =>
																	item.id === departmentSelect,
															)[0]?.name
														}
													</Button>
												</DropdownToggle>
												<DropdownMenu>
													{dataDepartments?.map((item) => (
														<DropdownItem
															key={item?.id}
															onClick={() =>
																setDepartmentSelect(item.id)
															}>
															<div>{item?.name}</div>
														</DropdownItem>
													))}
												</DropdownMenu>
											</Dropdown>
										</CardActions>,
										['admin'],
									)}
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											{taskReport === null ? (
												<div style={{ height: '262px' }}>
													<Spinner
														animation='border'
														variant='primary'
														style={{
															marginTop: '15%',
															marginLeft: '42%',
															width: '50px',
															height: '50px',
														}}
													/>
												</div>
											) : (
												<TaskChartReport data={taskReport} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['admin', 'manager'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc của phòng
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											{subTaskReportDepartment === null ? (
												<Spinner animation='border' />
											) : (
												<TaskChartReport data={subTaskReportDepartment} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager'],
					)}
				</div>
				<div className='row mt-0'>
					{verifyPermissionHOC(
						<div className='col-xxl-6'>
							<Card className='mb-0 mt-4'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc cá nhân
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											{subTaskReport === null ? (
												<div style={{ height: '262px' }}>
													<Spinner
														animation='border'
														variant='primary'
														style={{
															marginLeft: '42%',
															marginTop: '15%',
															width: '50px',
															height: '50px',
														}}
													/>
												</div>
											) : (
												<TaskChartReport data={subTaskReport} />
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['manager', 'admin'],
					)}
					{verifyPermissionHOC(
						<div className='col-xxl-12'>
							<Card className='mb-0'>
								<CardHeader className='py-0'>
									<CardLabel icon='ReceiptLong'>
										<CardTitle tag='h4' className='h5'>
											Thống kê đầu việc cá nhân
										</CardTitle>
										<CardSubTitle tag='h5' className='h6'>
											Báo cáo
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='py-0'>
									<div className='row'>
										<div className='col-xl-12 col-xxl-12'>
											<TaskChartReport data={subTaskReport} />
										</div>
									</div>
								</CardBody>
							</Card>
						</div>,
						['user'],
					)}
				</div>
				{verifyPermissionHOC(
					<>
						<div className='row mt-4'>
							<div className='col-xxl-12 col-xl-12 h-100'>
								<Card className='h-100'>
									<CardHeader>
										<CardLabel icon='Task' iconColor='danger'>
											<CardTitle>
												<CardLabel>
													Danh sách công việc đang thực hiện
												</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columnTasks}
											data={tasks}
										/>
									</div>
									{!tasks?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Không có công việc!
										</Alert>
									)}
								</Card>
							</div>
						</div>
						<div className='row mt-4'>
							<div className='col-xxl-12 col-xl-12 h-100'>
								<Card className='h-100'>
									<CardHeader>
										<CardLabel icon='Task' iconColor='danger'>
											<CardTitle>
												<CardLabel>Đầu việc của tôi</CardLabel>
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columnSubTasks}
											data={subtasks}
										/>
									</div>
									{!tasks?.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											Không có đầu việc!
										</Alert>
									)}
								</Card>
							</div>
						</div>
					</>,
					['user'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
