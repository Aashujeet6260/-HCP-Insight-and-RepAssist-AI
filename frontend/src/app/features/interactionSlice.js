import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  form: {
    hcp_name: '',
    interaction_type: 'Meeting',
    interaction_date: '2025-04-19',
    interaction_time: '19:36',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Positive',
    outcomes: '',
    follow_up_actions: '',
  },
  aiSuggestions: [
    '+ Schedule follow-up meeting in 2 weeks',
    '+ Send OncoBoost Phase III PDF',
    '+ Add Dr. Sharma to advisory board invite list'
  ],
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setFormData: (state, action) => {
      state.form = { ...state.form, ...action.payload };
    },
  },
});

export const { updateFormField, setFormData } = interactionSlice.actions;

export default interactionSlice.reducer;