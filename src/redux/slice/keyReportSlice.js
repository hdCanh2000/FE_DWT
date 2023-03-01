import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllReport } from '../../pages/dailyWorkTracking/services';

const initialState = {
	reports: [],
	report: {},
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
	},
});
