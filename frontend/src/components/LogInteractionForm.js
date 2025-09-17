import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField } from '../app/features/interactionSlice';
import { FormInput, FormTextarea } from './FormInput';
import { FileText, Beaker, Send } from 'lucide-react';

const LogInteractionForm = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.interaction.form);
    const aiSuggestions = useSelector((state) => state.interaction.aiSuggestions);

    const handleChange = (e) => {
        dispatch(updateFormField({ field: e.target.name, value: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">Interaction Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="HCP Name" name="hcp_name" value={formData.hcp_name} onChange={handleChange} placeholder="Search or select HCP..." />
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Interaction Type</label>
                    <select name="interaction_type" value={formData.interaction_type} onChange={handleChange} className="block w-full px-3 py-2 border border-border-gray rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                        <option>Meeting</option>
                        <option>Call</option>
                        <option>Email</option>
                    </select>
                </div>
                <FormInput label="Date" type="date" name="interaction_date" value={formData.interaction_date} onChange={handleChange} />
                <FormInput label="Time" type="time" name="interaction_time" value={formData.interaction_time} onChange={handleChange} />
            </div>
            <FormInput label="Attendees" name="attendees" value={formData.attendees} onChange={handleChange} placeholder="Enter names or search..." />
            <FormTextarea label="Topics Discussed" name="topics_discussed" value={formData.topics_discussed} onChange={handleChange} placeholder="Enter key discussion points..." />
            
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-text-primary">Materials Shared / Samples Distributed</h3>
                <div className="p-4 border border-dashed border-border-gray rounded-md text-center text-text-secondary">
                    <p>No materials added</p>
                </div>
                <div className="p-4 border border-dashed border-border-gray rounded-md text-center text-text-secondary">
                    <p>No samples added</p>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-text-primary mb-2">Observed/Inferred HCP Sentiment</h3>
                <div className="flex items-center space-x-4">
                    {['Positive', 'Neutral', 'Negative'].map(sentiment => (
                        <label key={sentiment} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sentiment"
                                value={sentiment}
                                checked={formData.sentiment === sentiment}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-brand-blue focus:ring-brand-blue"
                            />
                            <span className="text-sm text-text-primary">{sentiment}</span>
                        </label>
                    ))}
                </div>
            </div>

            <FormTextarea label="Outcomes" name="outcomes" value={formData.outcomes} onChange={handleChange} placeholder="Key outcomes or agreements..." />
            <FormTextarea label="Follow-up Actions" name="follow_up_actions" value={formData.follow_up_actions} onChange={handleChange} placeholder="Enter next steps or tasks..." />
            
            <div>
                <h3 className="text-sm font-semibold text-text-primary mb-2">AI Suggested Follow-ups:</h3>
                <ul className="space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-brand-blue hover:underline cursor-pointer">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LogInteractionForm;