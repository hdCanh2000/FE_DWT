import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllReport } from '../../pages/dailyWorkTracking/services';

const initialState = {
	reports: [],
	report: {},
	records: [],
	record: {},
};

export const fetchReport = createAsyncThunk('keyReport/allReport', async () => {
	const response = await getAllReport();
	return response.result.data.map((report) => {
		return {
			...report,
			name: report.name,
			id: report.id,
			departmentId: report.departmentId,
			dailyWorkId: report.dailyWorkId,
			createdAt: report.createdAt,
			updatedAt: report.updatedAt,
		};
	});
});

// export const fetchAllRecord = createAsyncThunk('keyReport/record', async (data) => {
// 	const response = await createRecord(data);
// 	console.log(response);
// 	return response.data;
// });

// eslint-disable-next-line import/prefer-default-export
export const keyReportSlice = createSlice({
	name: 'keyReport',
	initialState,
	reducers: {},
	extraReducers: {
		// fetch Reports
		[fetchReport.pending]: (state) => {
			state.loading = true;
		},
		[fetchReport.fulfilled]: (state, action) => {
			state.loading = false;
			state.reports = action.payload ? [...action.payload] : [];
		},
		[fetchReport.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
		// fetch Record
		// [fetchAllRecord.pending]: (state) => {
		// 	state.loading = true;
		// },
		// [fetchAllRecord.fulfilled]: (state, action) => {
		// 	state.loading = false;
		// 	console.log('action', action);
		// 	state.records = [...state.records, ...action.payload];
		// },
		// [fetchAllRecord.rejected]: (state, action) => {
		// 	state.loading = false;
		// 	state.error = action.error;
		// },
	},
});
