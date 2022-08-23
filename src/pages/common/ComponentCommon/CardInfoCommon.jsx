import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';

const CardInfoCommon = ({
	data,
	title,
	subTitle,
	icon,
	iconColor,
	className,
	shadow,
	isScrollable,
	...props
}) => {
	return (
		<Card className={classNames(className)} shadow={shadow} {...props}>
			<CardHeader className='py-2'>
				<CardLabel icon={icon} iconColor={iconColor}>
					<CardTitle>{title}</CardTitle>
					<CardSubTitle>{subTitle}</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody isScrollable={isScrollable} className='py-2'>
				<div className='row g-2 ps-5 pe-4'>
					{data?.map((item, index) => {
						return (
							// eslint-disable-next-line react/no-array-index-key
							<div className='col-12 mb-2' key={index}>
								<div className='d-flex align-items-start'>
									<div className='flex-shrink-0'>
										<Icon
											icon={item?.icon || ''}
											size={item.size || '2x'}
											color={item?.color || 'primary'}
										/>
									</div>
									<div className='flex-grow-1 ps-3'>{item.children}</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardBody>
		</Card>
	);
};

CardInfoCommon.propTypes = {
	className: PropTypes.string,
	shadow: PropTypes.oneOf([null, 'none', 'sm', 'md', 'lg', '3d']),
	title: PropTypes.string,
	subTitle: PropTypes.string,
	icon: PropTypes.string,
	iconColor: PropTypes.string,
	isScrollable: PropTypes.bool,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
};
CardInfoCommon.defaultProps = {
	className: null,
	shadow: null,
	title: null,
	subTitle: null,
	icon: null,
	iconColor: null,
	isScrollable: false,
	data: [],
};

export default CardInfoCommon;
