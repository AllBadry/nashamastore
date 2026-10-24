import React from 'react';

/**
 * حقل إدخال مع تسمية وأيقونة وإخفاء/إظهار لكلمة المرور.
 */
const AuthField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  autoComplete,
  onToggle,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block font-ar text-xs text-gray-400">
      {label}
    </label>

    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </span>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white/[0.03] py-3.5 pr-12 ${
          onToggle ? 'pl-12' : 'pl-4'
        } text-sm text-white placeholder-gray-600 outline-none transition-colors duration-300 focus:border-[#8b151a]/70 focus:bg-white/[0.05] ${
          error ? 'border-red-500/60' : 'border-white/12'
        }`}
      />

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={type === 'password' ? 'إظهار كلمة المرور' : 'إخفاء كلمة المرور'}
          className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {type === 'password' ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
              </>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.4 5.2A9.9 9.9 0 0112 5c5 0 9 4.5 10 7-.4 1-1.2 2.4-2.4 3.7M6.2 6.7C4.3 8 3 9.8 2 12c1 2.5 5 7 10 7 1.7 0 3.3-.5 4.7-1.3"
              />
            )}
          </svg>
        </button>
      )}
    </div>

    {error && (
      <p id={`${id}-error`} className="font-ar text-[11px] text-red-400">
        {error}
      </p>
    )}
  </div>
);

export default AuthField;
