import React, { useState } from 'react';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import TableCalendar from './TableCalendar';
import TableWorkTrack from './TableWorkTracking';

const DailyWorkTracking = () => {
	const [rowsState, setRowsState] = useState([]);

	const handleAddRow = () => {
		const item = {
			name: '',
			quantity: '',
			unit: '',
			note: '',
			time: '',
			plan: '',
		};
		setRowsState((prev) => [...prev, item]);
	};

	// hàm onchange cho input key
	const handleChangeRowState = (index, event) => {
		event.preventDefault();
		event.persist();
		setRowsState((prev) => {
			return prev.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
				};
			});
		});
	};

	const handleRemoveRowField = (e, index) => {
		setRowsState((prev) => prev.filter((state) => state !== prev[index]));
	};

	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.dailyWorkTracking.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Công việc hằng ngày</div>
						</div>
					</div>
				</div>
				<div className='row mb-0' style={{ height: '100%' }}>
					<div className='col-12'>
						{/* <Card className='w-100 h-100'> */}
						<div className='row p-4'>
							<div className='col-8 px-0'>
								<TableWorkTrack
									rowsState={rowsState}
									handleChangeRowState={handleChangeRowState}
									handleAddRow={handleAddRow}
									handleRemoveRowField={handleRemoveRowField}
								/>
							</div>
							<div className='col-4 px-0'>
								<TableCalendar rowsState={rowsState} />
							</div>
						</div>
						{/* </Card> */}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTracking;
