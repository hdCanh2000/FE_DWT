import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const CustomSelect = ({ onChange, options, value, isMulti, placeholder, className, ...props }) => {
	return (
		<Select
			value={value}
			defaultValue={value}
			onChange={(val) => onChange(val)}
			options={options}
			isMulti={isMulti}
			className={className}
			placeholder={placeholder}
			{...props}
		/>
	);
};

CustomSelect.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	options: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	value: PropTypes.any,
	isMulti: PropTypes.bool,
	placeholder: PropTypes.string,
};
CustomSelect.defaultProps = {
	className: null,
	onChange: null,
	options: [],
	value: null,
	isMulti: false,
	placeholder: null,
};

export default CustomSelect;