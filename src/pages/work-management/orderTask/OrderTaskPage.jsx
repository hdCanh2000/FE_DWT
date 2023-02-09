/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Row, Col } from 'antd';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import TableListTarget from './TableListTarget';
import TableListTargetInfos from './TableListTargetInfos';

const OrderTaskPage = () => {
	const [updateFlag, setUpdateFlag] = React.useState(0);
	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				<Row gutter={24}>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Lịch sử giao việc</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<TableListTargetInfos updateFlag={updateFlag} />
							</CardBody>
						</Card>
					</Col>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Danh sách định mức</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<TableListTarget onUpdateTargetInfo={setUpdateFlag} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Page>
		</PageWrapper>
	);
};
export default OrderTaskPage;
