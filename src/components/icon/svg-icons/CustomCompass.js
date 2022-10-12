import * as React from 'react';

const SvgCustomCompass = (props) => (
	<svg
		viewBox='0 0 25 25'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		style={{
			enableBackground: 'new 0 0 512 512',
		}}
		xmlSpace='preserve'
		width='1em'
		height='1em'
		className='svg-icon'
		{...props}>
		<path
			d='M11.396 11.395a1.562 1.562 0 1 0 2.208 2.21 1.562 1.562 0 0 0-2.208-2.21ZM12.5.391C5.812.39.39 5.812.39 12.5S5.813 24.61 12.5 24.61s12.11-5.422 12.11-12.11S19.187.39 12.5.39Zm6.16 7.229-3.222 7.048a1.56 1.56 0 0 1-.77.77L7.62 18.659c-.813.372-1.65-.466-1.28-1.28l3.223-7.048c.155-.34.429-.614.77-.77l7.047-3.22c.813-.372 1.65.466 1.28 1.279Z'
			fill='currentColor'
		/>
	</svg>
);

export default SvgCustomCompass;
