import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from '../../../components/extras/Chart';
import styles from './circle.module.css';

const calcTotal = (data) =>
	data ? Object.values(data).reduce((accumulator, item) => accumulator + item) : 0;

const TaskChartReport = ({ data }) => {
	const chartOptions = {
		chart: {
			type: 'donut',
			height: 250,
		},
		stroke: {
			width: 0,
		},
		labels: ['Đang thực hiện', 'Từ chối', 'Đã hoàn thành', 'Tạm dừng', 'Chờ xác nhận', 'Khác'],
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
		series: Object.values(data === null ? {} : data),
		options: chartOptions,
	});
	return (
		<div>
			<div className='row align-items-start py-4'>
				{calcTotal(data) !== 0 ? (
					<div className='col-xl-8 col-md-12'>
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart.type}
							height={state.options.chart.height}
						/>
					</div>
				) : (
					<div className='col-xl-8 col-md-12'>
						<center>
							<div className={styles.circle} />
							<br />
							<h5>Hiện chưa có việc được giao</h5>
						</center>
					</div>
				)}
				<div className='col-xl-4 col-md-12'>
					<div className='row'>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: '#46BCAA' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Đã hoàn thành:{' '}
									<span className='fw-bold fs-14 text-success'>
										{data?.completed}
									</span>
								</div>
							</div>
						</div>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: 'rgb(77, 105, 250)' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Tạm dừng:{' '}
									<span className='fw-bold fs-14 text-info'>{data?.onhold}</span>
								</div>
							</div>
						</div>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: 'rgb(108, 93, 211)' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Đang thực hiện:{' '}
									<span className='fw-bold fs-14 text-primary'>
										{data?.inprogress}
									</span>
								</div>
							</div>
						</div>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: '#FFA2C0' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Từ chối:{' '}
									<span className='fw-bold fs-14 text-secondary'>
										{data?.rejected}
									</span>
								</div>
							</div>
						</div>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: 'rgb(255, 207, 82)' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Chờ xác nhận:{' '}
									<span className='fw-bold fs-14 text-warning'>
										{data?.solved}
									</span>
								</div>
							</div>
						</div>
						<div className='col-xl-12 col-md-4 col-sm-4 mt-2'>
							<div className='d-flex align-items-center justify-content-start'>
								<div className='p-3' style={{ background: 'rgb(243, 84, 33)' }} />
								<div style={{ marginLeft: '1rem' }} className='fs-14'>
									Khác:{' '}
									<span className='fw-bold fs-14 text-danger'>{data?.other}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

TaskChartReport.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object,
};
TaskChartReport.defaultProps = {
	data: null,
};

export default memo(TaskChartReport);
