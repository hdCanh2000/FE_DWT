import React, { useState } from 'react';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Chart from '../../../components/extras/Chart';
// import CountProgressInfo from './CountProgressInfo';

const TaskProgress = () => {
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 350,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Chậm tiến độ', 'Đã hoàn thành'],
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			pie: {
				expandOnClick: true,
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '24px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 0,
							formatter(val) {
								return val;
							},
						},
						value: {
							show: true,
							fontSize: '16px',
							fontFamily: 'Poppins',
							fontWeight: 900,
							offsetY: 16,
							formatter(val) {
								return val;
							},
						},
					},
				},
			},
		},
		legend: {
			show: true,
			position: 'bottom',
		},
	};

	const DUMMY_DATA = {
		DAY: {
			series: [8, 3, 1],
			options: {
				...chartOptions,
			},
		},
		WEEK: {
			series: [42, 18, 9],
			options: {
				...chartOptions,
			},
		},
		MONTH: {
			series: [150, 55, 41],
			options: {
				...chartOptions,
			},
		},
	};

	const [state] = useState({
		series: DUMMY_DATA.MONTH.series,
		options: chartOptions,
	});

	return (
		<Card stretch>
			<CardBody>
				<div className='row align-items-center'>
					<div className='col-xl-8 col-md-12'>
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart.type}
							height={state.options.chart.height}
						/>
					</div>
					<div className='col-xl-4 col-md-12'>
						<div className='row'>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-center'>
									<div className='p-4' style={{ background: '#46BCAA' }} />
									<span style={{ marginLeft: '1rem' }}>10 đầu việc (14%)</span>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-center'>
									<div className='p-4' style={{ background: '#6C5DD3' }} />
									<span style={{ marginLeft: '1rem' }}>10 đầu việc (14%)</span>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-center'>
									<div className='p-4' style={{ background: '#FFA2C0' }} />
									<span style={{ marginLeft: '1rem' }}>10 đầu việc (14%)</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default TaskProgress;
