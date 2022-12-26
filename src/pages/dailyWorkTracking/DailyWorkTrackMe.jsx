/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable  no-nested-ternary */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useQuery } from 'react-query';
import { DatePicker } from 'antd';
import Card, { CardBody, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { getUserDetail } from './services';
import TargetTable from '../../components/TargetTable/TargetTable';
import DailyWorkTable from '../../components/DailyWorkTable/DailyWorkTable';

const DailyWorkTrackingMe = () => {
	const id = localStorage.getItem('userId');
	const [date, setDate] = useState(dayjs());
	const [dataSearch, setDataSearch] = useState({
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
		q: '',
		userId: id,
	});
	const {
		data: user = {},
		isLoading: isLoadingUser,
		isError: isErrorUser,
	} = useQuery(['getUserDetail', id], ({ queryKey }) => getUserDetail(queryKey[1]));
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
										NHẬT TRÌNH CÔNG VIỆC
									</CardLabel>
								</CardTitle>
								<div className='text-center'>
									Vị trí:{' '}
									{isLoadingUser
										? '...'
										: isErrorUser
										? '_'
										: user?.department?.name}
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
export default DailyWorkTrackingMe;
