import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Chart from '../../../components/extras/Chart';
// import CountProgressInfo from './CountProgressInfo';

const TaskChartReport = ({ data }) => {
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 300,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Từ chối', 'Đã hoàn thành', 'Tạm dừng', 'Chờ xác nhận'],
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

	const [state, setState] = useState({
		series: [],
		options: chartOptions,
	});

	useEffect(() => {
		setState({
			...state,
			series: Object.values(data),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Card>
			<CardBody className='pb-4'>
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
								<div className='d-flex align-items-center justify-content-start'>
									<div className='p-4' style={{ background: '#46BCAA' }} />
									<div style={{ marginLeft: '1rem' }} className='fs-5'>
										Đã hoàn thành:{' '}
										<span className='fw-bold fs-4 text-success'>
											{data.completed}
										</span>
									</div>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-start'>
									<div
										className='p-4'
										style={{ background: 'rgb(77, 105, 250)' }}
									/>
									<div style={{ marginLeft: '1rem' }} className='fs-5'>
										Tạm dừng:{' '}
										<span className='fw-bold fs-4 text-info'>
											{data.onhold}
										</span>
									</div>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-start'>
									<div
										className='p-4'
										style={{ background: 'rgb(108, 93, 211)' }}
									/>
									<div style={{ marginLeft: '1rem' }} className='fs-5'>
										Đang thực hiện:{' '}
										<span className='fw-bold fs-4 text-primary'>
											{data.inprogress}
										</span>
									</div>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-start'>
									<div className='p-4' style={{ background: '#FFA2C0' }} />
									<div style={{ marginLeft: '1rem' }} className='fs-5'>
										Từ chối:{' '}
										<span className='fw-bold fs-4 text-secondary'>
											{data.rejected}
										</span>
									</div>
								</div>
							</div>
							<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
								<div className='d-flex align-items-center justify-content-start'>
									<div
										className='p-4'
										style={{ background: 'rgb(255, 207, 82)' }}
									/>
									<div style={{ marginLeft: '1rem' }} className='fs-5'>
										Chờ xác nhận:{' '}
										<span className='fw-bold fs-4 text-warning'>
											{data.solved}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

TaskChartReport.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
TaskChartReport.defaultProps = {
	data: { inprogress: 0, completed: 0, solved: 2, rejected: 0, onhold: 0 },
};

export default TaskChartReport;
