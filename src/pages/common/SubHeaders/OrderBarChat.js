import React, { useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Chart from '../../../components/extras/Chart';

const OrderBarChat = () => {
	const [state] = useState({
		series: [
			{
				data: [0, 0, 0, 0, 0, 0, 0, 0],
			},
		],
		options: {
			chart: {
				type: 'bar',
				height: 370,
			},
			plotOptions: {
				bar: {
					horizontal: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				categories: [
					'Ô tô điện',
					'Thuốc',
					'Sữa bột',
					'Sữa',
					'Thực phẩm',
					'Kệ bàn',
					'Ghế',
					'Xe máy điện',
				],
			},
		},
	});
	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='ReceiptLong'>
					<CardTitle>Số lượng đơn hàng</CardTitle>
					<CardSubTitle>Báo cáo</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<Chart series={state.series} options={state.options} type='bar' />
			</CardBody>
		</Card>
	);
};

export default OrderBarChat;
