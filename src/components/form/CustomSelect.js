import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const customStyles = {
	control: (provided) => ({
		...provided,
	}),
	menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const CustomSelect = ({
	name,
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
			name={name}
			menuPortalTarget={document.body}
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
	name: PropTypes.string,
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
	name: '',
	className: null,
	disabled: null,
	onChange: null,
	options: [],
	value: null,
	isMulti: false,
	placeholder: null,
};

export default CustomSelect;
