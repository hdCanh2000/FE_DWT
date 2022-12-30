import React, { useState } from 'react';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { Col, DatePicker, Input, Row } from 'antd';
import Card, { CardBody, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

import TargetTable from '../../components/TargetTable/TargetTable';
import DailyWorkTable from '../../components/DailyWorkTable/DailyWorkTable';
import Button from '../../components/bootstrap/Button';

const DailyWorkTracking = () => {
	const [date, setDate] = useState(dayjs());
	const [targetSearchParams, setTargetSearchParams] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		status: 'assigned',
	});
	const [targetTableSearchKeyWord, setTargetTableSearchKeyWord] = useState('');
	const [dailyWorkSearchParams, setDailyWorkSearchParams] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		status: 'assigned',
	});
	const [dailyWorkTableSearchKeyWord, setDailyWorkTableSearchKeyWord] = useState('');

	const handleChangeMonth = (updatedDate) => {
		setDate(updatedDate);
		setTargetSearchParams({
			...targetSearchParams,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
		});

		setDailyWorkSearchParams({
			...dailyWorkSearchParams,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
		});
	};

	const handleSearchTargets = (value) => {
		setTargetSearchParams({ ...targetSearchParams, q: value });
	};
	const handleSearchDailyWork = (value) => {
		setDailyWorkSearchParams({ ...dailyWorkSearchParams, q: value });
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
									<Row gutter={24} className='my-4'>
										<Col
											lg={6}
											md={12}
											sm={24}
											className='d-flex align-items-center'>
											<Input.Search
												placeholder='Tìm kiếm nhiệm vụ'
												onSearch={handleSearchTargets}
												onChange={(e) =>
													setTargetTableSearchKeyWord(e.target.value)
												}
												value={targetTableSearchKeyWord}
											/>
											{targetSearchParams.q && (
												<Button
													className='mx-2'
													color='link'
													onClick={() => {
														setTargetTableSearchKeyWord('');
														setTargetSearchParams({
															...targetSearchParams,
															q: '',
														});
													}}>
													Reset
												</Button>
											)}
										</Col>
									</Row>
									<TargetTable dataSearch={targetSearchParams} />
								</div>
								<div>
									<Row gutter={24} className='my-4'>
										<Col
											lg={6}
											md={12}
											sm={24}
											className='d-flex align-items-center'>
											<Input.Search
												placeholder='Tìm kiếm tiêu chí ngày'
												onSearch={handleSearchDailyWork}
												onChange={(e) =>
													setDailyWorkTableSearchKeyWord(e.target.value)
												}
												value={dailyWorkTableSearchKeyWord}
											/>
											{dailyWorkSearchParams.q && (
												<Button
													className='mx-2'
													color='link'
													onClick={() => {
														setDailyWorkTableSearchKeyWord('');
														setDailyWorkSearchParams({
															...dailyWorkSearchParams,
															q: '',
														});
													}}>
													Reset
												</Button>
											)}
										</Col>
									</Row>
									<DailyWorkTable dataSearch={dailyWorkSearchParams} />
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
