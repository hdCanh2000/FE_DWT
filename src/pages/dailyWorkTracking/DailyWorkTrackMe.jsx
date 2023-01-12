/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable  no-nested-ternary */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useQuery } from 'react-query';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import Card, { CardBody, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { getUserDetail } from './services';
import TargetTable from '../../components/TargetTable/TargetTable';
import DailyWorkTable from '../../components/DailyWorkTable/DailyWorkTable';
import Button from '../../components/bootstrap/Button';
import { listColumnsOptions } from '../../components/TargetTable/config';
import ExportTargetButton from '../../components/ExportTargetButton';

const DailyWorkTrackingMe = () => {
	const id = localStorage.getItem('userId');

	const {
		data: user = {},
		isLoading: isLoadingUser,
		isError: isErrorUser,
	} = useQuery(['getUserDetail', id], ({ queryKey }) => getUserDetail(queryKey[1]));

	const [date, setDate] = useState(dayjs());
	const [targetSearchParams, setTargetSearchParams] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		status: 'assigned',
		userId: id,
	});
	const [targetTableSearchKeyWord, setTargetTableSearchKeyWord] = useState('');
	const [dailyWorkSearchParams, setDailyWorkSearchParams] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		status: 'assigned',
		userId: id,
	});
	const [dailyWorkTableSearchKeyWord, setDailyWorkTableSearchKeyWord] = useState('');
	const [columnsToShow, setColumnsToShow] = useState([]);
	const [kpiEstimated, setKpiEstimated] = useState(0);
	const handleChangeMonth = (updatedDate) => {
		setDate(updatedDate);
		setTargetSearchParams({
			...targetSearchParams,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
			userId: id,
		});

		setDailyWorkSearchParams({
			...dailyWorkSearchParams,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
			userId: id,
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
										NHẬT TRÌNH CÔNG VIỆC
									</CardLabel>
								</CardTitle>
								<div className='text-center'>
									Vị trí:{' '}
									{isLoadingUser
										? '...'
										: isErrorUser
										? '_'
										: user?.position?.name}
								</div>
							</div>
							<div className='text-end'>
								<div>
									Người thực hiện:{' '}
									{isLoadingUser ? '...' : isErrorUser ? '_' : user.name}
								</div>
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
									<div>
										<ExportTargetButton params={targetSearchParams} />
									</div>
									<Row gutter={24} className='my-4 align-items-center'>
										<Col
											lg={6}
											md={7}
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
										<Col lg={14} md={7} sm={24}>
											<div className='my-3 d-flex align-items-center w-100'>
												<div className='mx-2'>
													<h5>Cột hiển thị: </h5>
												</div>
												<Select
													optionFilterProp='children'
													showSearch
													filterOption={(input, option) =>
														(
															option?.label.toLowerCase() ?? ''
														).includes(input.toLowerCase())
													}
													options={listColumnsOptions}
													mode='multiple'
													allowClear
													style={{ minWidth: 200, width: 'auto' }}
													placeholder='Chọn cột'
													onChange={(value) => {
														setColumnsToShow(value);
													}}
													value={columnsToShow}
												/>
											</div>
										</Col>
										<Col lg={4} md={6} sm={24}>
											<div className='w-100 text-end'>
												<b>Tổng KPI tạm tính: {kpiEstimated}</b> KPI
											</div>
										</Col>
									</Row>
									<TargetTable
										dataSearch={targetSearchParams}
										columnsToShow={columnsToShow}
										setKpiEstimated={setKpiEstimated}
									/>
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
export default DailyWorkTrackingMe;
