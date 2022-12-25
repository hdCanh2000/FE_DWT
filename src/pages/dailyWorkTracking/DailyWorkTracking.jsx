import React, { useState } from 'react';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import Card, { CardBody, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

import TargetTable from '../../components/TargetTable/TargetTable';
import DailyWorkTable from '../../components/DailyWorkTable/DailyWorkTable';

const DailyWorkTracking = () => {
	const [date, setDate] = useState(dayjs());
	const [dataSearch, setDataSearch] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		status: 'assigned',
	});

	const handleChangeMonth = (updatedDate) => {
		setDate(updatedDate);
		setDataSearch({
			...dataSearch,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
		});
	};

	return (
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				<Card className='w-100'>
					<div style={{ margin: '24px 24px 0' }}>
						<div className='w-100 d-flex justify-content-between align-items-center'>
							{/* DONT REMOVE THIS EMPTY DIV IT IS FOR ALIGNING THE HEADER */}
							<div />
							<div>
								<CardTitle>
									<CardLabel className='d-flex justify-content-center'>
										DANH SÁCH CÔNG VIỆC
									</CardLabel>
								</CardTitle>
							</div>
							<div className='text-end'>
								<div>
									Tháng:{' '}
									<DatePicker.MonthPicker
										format='MM/YYYY'
										locale={locale}
										style={{ width: 100 }}
										value={date}
										onChange={handleChangeMonth}
									/>
								</div>
							</div>
						</div>
						<CardBody>
							<div className='control-pane'>
								<div className='control-section'>
									<TargetTable dataSearch={dataSearch} />
								</div>
								<div>
									<DailyWorkTable dataSearch={dataSearch} />
								</div>
							</div>
						</CardBody>
					</div>
				</Card>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTracking;
