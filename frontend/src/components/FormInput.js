import React from 'react';

const FormInput = ({ label, type = 'text', value, name, onChange, placeholder, required = false }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full px-3 py-2 border border-border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
      />
    </div>
  );
};

const FormTextarea = ({ label, value, name, onChange, placeholder, rows = 3 }) => {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="block w-full px-3 py-2 border border-border-gray rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
        ></textarea>
      </div>
    );
  };

export { FormInput, FormTextarea };