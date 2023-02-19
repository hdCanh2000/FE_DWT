import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllReport, getAllRecordById } from '../../pages/dailyWorkTracking/services';

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

export const fetchRecordById = createAsyncThunk('keyReport/record', async (data) => {
	const response = await getAllRecordById(data);
	return response.result.data;
});

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
		[fetchRecordById.pending]: (state) => {
			state.loading = true;
		},
		[fetchRecordById.fulfilled]: (state, action) => {
			state.loading = false;
			state.records = action.payload;
		},
		[fetchRecordById.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.error;
		},
	},
});
