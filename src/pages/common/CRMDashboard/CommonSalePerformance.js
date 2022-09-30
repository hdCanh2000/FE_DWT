import React, { useState } from 'react';
import moment from 'moment';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Chart from '../../../components/extras/Chart';

const CommonSalePerformance = () => {
	const chartOptions = {
		chart: {
			height: 200,
			type: 'area',
			toolbar: {
				show: false,
			},
		},
		colors: [process.env.REACT_APP_SUCCESS_COLOR, process.env.REACT_APP_INFO_COLOR],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: 'smooth',
		},
		tooltip: {
			x: {
				format: 'dd/MM/yy HH:mm',
			},
			theme: 'dark',
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.5,
				opacityTo: 0,
				stops: [0, 100],
			},
		},
	};

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
	function getHours(day) {
		const arr = [];
		for (let i = 0; i < day; i += 1) {
			arr.push(i);
		}
		return arr;
	}

	const DUMMY_DATA = {
		DAY: {
			series: [
				{
					name: 'Last Day',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				},
				{
					name: 'This Day',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				},
			],
			options: {
				...chartOptions,
				xaxis: {
					categories: getHours(24),
				},
			},
		},
		WEEK: {
			series: [
				{
					name: 'Last Week',
					data: [0, 0, 0, 0, 0, 0, 0],
				},
				{
					name: 'This Week',
					data: [0, 0, 0, 0, 0, 0, 0],
				},
			],
			options: {
				...chartOptions,
				xaxis: {
					categories: getDate(7),
				},
			},
		},
		MONTH: {
			series: [
				{
					name: 'Last Month',
					data: [
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0,
					],
				},
				{
					name: 'This Month',
					data: [
						0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
						0, 0, 0,
					],
				},
			],
			options: {
				...chartOptions,
				xaxis: {
					categories: getDate(28),
				},
			},
		},
	};
	const [state, setState] = useState({
		series: DUMMY_DATA.WEEK.series,
		options: DUMMY_DATA.WEEK.options,
	});

	const SALE_PER_TAB = {
		DAY: 'Day',
		WEEK: 'Week',
		MONTH: 'Month',
	};
	const [activeSalePerTab, setActiveSalePerTab] = useState(SALE_PER_TAB.WEEK);

	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='ReceiptLong'>
					<CardTitle>Sale Performance</CardTitle>
				</CardLabel>
				<CardActions>
					<Button
						color='info'
						onClick={() => {
							setActiveSalePerTab(SALE_PER_TAB.DAY);
							setState({
								series: DUMMY_DATA.DAY.series,
								options: DUMMY_DATA.DAY.options,
							});
						}}
						isLink={activeSalePerTab !== SALE_PER_TAB.DAY}
						isLight={activeSalePerTab === SALE_PER_TAB.DAY}>
						Day
					</Button>
					<Button
						color='info'
						onClick={() => {
							setActiveSalePerTab(SALE_PER_TAB.WEEK);
							setState({
								series: DUMMY_DATA.WEEK.series,
								options: DUMMY_DATA.WEEK.options,
							});
						}}
						isLink={activeSalePerTab !== SALE_PER_TAB.WEEK}
						isLight={activeSalePerTab === SALE_PER_TAB.WEEK}>
						Week
					</Button>
					<Button
						color='info'
						onClick={() => {
							setActiveSalePerTab(SALE_PER_TAB.MONTH);
							setState({
								series: DUMMY_DATA.MONTH.series,
								options: DUMMY_DATA.MONTH.options,
							});
						}}
						isLink={activeSalePerTab !== SALE_PER_TAB.MONTH}
						isLight={activeSalePerTab === SALE_PER_TAB.MONTH}>
						Month
					</Button>
				</CardActions>
			</CardHeader>
			<CardBody>
				<Chart
					series={state.series}
					options={state.options}
					type={state.options.chart.type}
					height={state.options.chart.height}
				/>
			</CardBody>
		</Card>
	);
};

export default CommonSalePerformance;
