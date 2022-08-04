import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import useDarkMode from '../../../hooks/useDarkMode';

const ReportCommon = (props) => {
	const { data } = props;
	const { darkModeStatus } = useDarkMode();
	return (
		<Card
			className={`bg-l${darkModeStatus ? 'o25' : '25'}-success bg-l${
				darkModeStatus ? 'o50' : '10'
			}-success-hover transition-base rounded-2 mb-4`}
			shadow='sm'>
			<CardBody>
				<div className='row'>
					{data?.map((item) => (
						<div className='col-6'>
							<div className='fw-bold fs-2 mb-10'>{item?.value}</div>
							<div className='text-muted'>{item?.label}</div>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
};

ReportCommon.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	data: PropTypes.array,
};
ReportCommon.defaultProps = {
	data: [],
};

export default ReportCommon;
