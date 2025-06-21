import React from 'react'

export const Input = ({ name, data, handleChange }) => {
    return (
        <input
            name={name}
            value={data[name]}
            placeholder={name}
            onChange={handleChange}
            maxLength={6}
            required={true}
        />
    )
}
