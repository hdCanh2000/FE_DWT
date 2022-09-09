import * as React from 'react';

const SvgCustomBriefCase = (props) => (
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
			d='M15.625 16.406c0 .432-.35.782-.781.782h-4.688a.781.781 0 0 1-.781-.782v-2.343H0v7.03c0 1.25 1.094 2.345 2.344 2.345h20.312c1.25 0 2.344-1.094 2.344-2.344v-7.032h-9.375v2.344ZM22.656 6.25H18.75V3.906c0-1.25-1.094-2.344-2.344-2.344H8.594c-1.25 0-2.344 1.094-2.344 2.344V6.25H2.344C1.094 6.25 0 7.344 0 8.594V12.5h25V8.594c0-1.25-1.094-2.344-2.344-2.344Zm-7.031 0h-6.25V4.687h6.25V6.25Z'
			fill='currentColor'
		/>
	</svg>
);

export default SvgCustomBriefCase;
