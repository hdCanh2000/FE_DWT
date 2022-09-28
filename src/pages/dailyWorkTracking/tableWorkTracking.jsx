import React from 'react';
import Button from '../../components/bootstrap/Button';
import Card from '../../components/bootstrap/Card';

const TableWorkTrack = () => {
	const [data, setData] = React.useState([]);
	const handleAddRow = () => {
		setData([
			...data,
			{
				name: 'null',
				amount: 'null',
				unit: 'nul',
				descriptions: 'null',
				dateLine: 'null',
				plant: 'null',
			},
		]);
	};
	return (
		<div>
			<Card className='p-4'>
				<table className='table table-modern mb-0'>
					<thead>
						<tr>
							<th>Stt</th>
							<th className='text-center'>Nhệm vụ</th>
							<th className='text-center'>Số lượng</th>
							<th className='text-center'>Đơn vị tính</th>
							<th className='text-center'>Ghi Chú</th>
							<th className='text-center'>Thời hạn</th>
							<th className='text-center'>Kế hoạch dự kiến</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((item, index) => (
							<tr>
								<td>{index + 1}</td>
								<td contentEditable='true' className='text-center'>
									<div>{item.name}</div>
								</td>
								<td contentEditable='true' className='text-center'>
									{item.amount}
								</td>
								<td contentEditable='true' className='text-center'>
									{item.unit}
								</td>
								<td contentEditable='true' className='text-center'>
									{item.descriptions}
								</td>
								<td contentEditable='true' className='text-center'>
									{item.dateLine}
								</td>
								<td contentEditable='true' className='text-center'>
									{item.plant}
								</td>
							</tr>
						))}
						<tr>
							<Button icon='Add' onClick={handleAddRow}>
								Thêm mới
							</Button>
						</tr>
					</tbody>
				</table>
			</Card>
		</div>
	);
};
export default TableWorkTrack;
