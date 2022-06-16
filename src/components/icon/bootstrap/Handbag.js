import * as React from 'react';

function SvgHandbag(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M8 1a2 2 0 012 2v2H6V3a2 2 0 012-2zm3 4V3a3 3 0 10-6 0v2H3.36a1.5 1.5 0 00-1.483 1.277L.85 13.13A2.5 2.5 0 003.322 16h9.355a2.5 2.5 0 002.473-2.87l-1.028-6.853A1.5 1.5 0 0012.64 5H11zm-1 1v1.5a.5.5 0 001 0V6h1.639a.5.5 0 01.494.426l1.028 6.851A1.5 1.5 0 0112.678 15H3.322a1.5 1.5 0 01-1.483-1.723l1.028-6.851A.5.5 0 013.36 6H5v1.5a.5.5 0 101 0V6h4z' />
		</svg>
	);
}

export default SvgHandbag;
