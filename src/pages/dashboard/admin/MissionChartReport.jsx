import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Chart from '../../../components/extras/Chart';

const MissionChartReport = ({ data }) => {
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 300,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Quá hạn', 'Đã hoàn thành'],
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

	const [state] = useState({
		series: Object.values(data).slice(0, Object.values(data).length - 1),
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
								<div className='d-flex align-items-center justify-content-start'>
									<span className='fw-bold fs-5'>Tổng số mục tiêu:</span>
									<span
										className='fw-bold fs-5 text-danger'
										style={{ marginLeft: '1rem' }}>
										{data.total}
									</span>
								</div>
							</div>
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
										Quá hạn:{' '}
										<span className='fw-bold fs-4 text-secondary'>
											{data.inprogressExpired}
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

MissionChartReport.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
MissionChartReport.defaultProps = {
	data: { completed: 0, completedExpired: 0, inprogress: 0, inprogressExpired: 0, total: 0 },
};

export default MissionChartReport;
