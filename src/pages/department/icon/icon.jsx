import React from 'react';

const plus = (props) => (
	<svg
		{...props}
		xmlns='http://www.w3.org/2000/svg'
		id='Bold'
		viewBox='0 0 24 24'
		width='512'
		height='512'>
		<path d='M6.079,22.5a1.5,1.5,0,0,1,.44-1.06l7.672-7.672a2.5,2.5,0,0,0,0-3.536L6.529,2.565A1.5,1.5,0,0,1,8.65.444l7.662,7.661a5.506,5.506,0,0,1,0,7.779L8.64,23.556A1.5,1.5,0,0,1,6.079,22.5Z' />
	</svg>
);

const minus = (props) => (
	<svg
		{...props}
		xmlns='http://www.w3.org/2000/svg'
		id='Bold'
		viewBox='0 0 24 24'
		width='512'
		height='512'>
		<path d='M1.51,6.079a1.492,1.492,0,0,1,1.06.44l7.673,7.672a2.5,2.5,0,0,0,3.536,0L21.44,6.529A1.5,1.5,0,1,1,23.561,8.65L15.9,16.312a5.505,5.505,0,0,1-7.778,0L.449,8.64A1.5,1.5,0,0,1,1.51,6.079Z' />
	</svg>
);

const close = (props) => (
	<svg
		{...props}
		xmlns='http://www.w3.org/2000/svg'
		xmlnsXlink='http://www.w3.org/1999/xlink'
		version='1.1'
		width='0'
		height='0'
		x='0'
		y='0'
		viewBox='0 0 0 0'
		style={{ enableBackground: ' 0 0 0 0' }}
		xmlSpace='preserve'>
		<g>
			<rect
				xmlns='http://www.w3.org/2000/svg'
				x='6'
				y='11'
				width='12'
				height='4'
				rx='1'
				fill='#000000'
				data-original='#000000'
			/>
		</g>
	</svg>
);

export { plus, minus, close };
