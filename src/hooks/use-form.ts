import React, { useState } from 'react'

export const useForm = <T>(form: T) => {
    const [formData, setFormData] = useState<typeof form>(form)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getFieldProps = (name: keyof typeof form) => ({
        name,
        value: formData[name],
        onChange: handleChange,
    })


    return {
        formData,
        handleChange,
        getFieldProps
    }
}
