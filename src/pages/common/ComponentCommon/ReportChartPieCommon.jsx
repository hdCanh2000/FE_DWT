import React from 'react';
import PropTypes from 'prop-types';
import Chart from '../../../components/extras/Chart';

const ReportChartPieCommon = (props) => {
	const { series, chartOptions } = props;
	return (
		<Chart
			series={series}
			options={chartOptions}
			type={chartOptions.chart.type}
			height={chartOptions.chart.height}
		/>
	);
};

ReportChartPieCommon.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	series: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	chartOptions: PropTypes.object,
};
ReportChartPieCommon.defaultProps = {
	series: [0, 0, 0, 0],
	chartOptions: {},
};

export default ReportChartPieCommon;
