import React from 'react';
import moment from 'moment';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import Chart from '../../../components/extras/Chart';

const CommonApprovedAppointmentChart = () => {
	const chartOptions = {
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			type: 'datetime',
			categories: [
				moment().format(),
				moment().add(1, 'days').format(),
				moment().add(2, 'days').format(),
				moment().add(3, 'days').format(),
				moment().add(4, 'days').format(),
				moment().add(5, 'days').format(),
				moment().add(6, 'days').format(),
			],
			labels: {
				rotate: -15,
				rotateAlways: true,
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter(val) {
					return `${val} `;
				},
			},
		},
		grid: {
			show: false,
		},
	};
	const approvedAppointments = {
		series: [
			{
				name: 'Approved',
				data: [0, 0, 0, 0, 0, 0],
			},
		],
		options: {
			colors: [process.env.REACT_APP_SUCCESS_COLOR],
			chart: {
				type: 'bar',
				height: 200,
				dropShadow: {
					enabled: false,
					color: process.env.REACT_APP_SUCCESS_COLOR,
					top: 0,
					left: 0,
					blur: 10,
					opacity: 0.5,
				},
				toolbar: {
					show: false,
				},
				redrawOnParentResize: true,
				redrawOnWindowResize: true,
			},
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '35%',
					borderRadius: 5,
				},
			},
			stroke: {
				show: true,
				width: 12,
				colors: ['transparent'],
			},
			...chartOptions,
		},
	};
	return (
		<Card style={{ height: '94%' }} isCompact>
			<CardHeader className='bg-transparent'>
				<CardLabel icon='ReceiptLong'>
					<CardTitle>Doanh số theo thời gian</CardTitle>
					<CardSubTitle>
						<span className='text-danger fw-bold'>
							-17% <Icon icon='ArrowDownward' />
						</span>
					</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<Chart
					series={approvedAppointments.series}
					options={approvedAppointments.options}
					type={approvedAppointments.options.chart.type}
					height={approvedAppointments.options.chart.height}
				/>
			</CardBody>
		</Card>
	);
};

export default CommonApprovedAppointmentChart;
