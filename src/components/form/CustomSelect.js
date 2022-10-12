import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const customStyles = {
	control: (provided) => ({
		...provided,
	}),
};

const CustomSelect = ({
	onChange,
	options,
	value,
	isMulti,
	placeholder,
	className,
	disabled,
	...props
}) => {
	return (
		<Select
			isDisabled={disabled}
			value={value}
			defaultValue={value}
			onChange={(val) => onChange(val)}
			options={options}
			isMulti={isMulti}
			className={className}
			placeholder={placeholder}
			styles={customStyles}
			{...props}
		/>
	);
};

CustomSelect.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
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
	disabled: null,
	onChange: null,
	options: [],
	value: null,
	isMulti: false,
	placeholder: null,
};

export default CustomSelect;
