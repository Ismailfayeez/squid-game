import React, { useState } from 'react'

export const Tabs = ({
    tabList = [],
    defaultTab = '',
    handleSelect = () => {},
}) => {
    const [selected, setSelected] = useState(defaultTab)

    return (
        <div className="flex">
            {tabList.map((tab) => (
                <div
                    className="text-align--center flex-grow"
                    style={{
                        background: `rgba(242, 243, 245,${
                            selected === tab ? 0.2 : 0
                        })`,
                        borderRadius: '5px',
                        padding: '5px',
                    }}
                    key={tab}
                    onClick={() => {
                        handleSelect(tab)
                        setSelected(tab)
                    }}
                >
                    {tab}
                </div>
            ))}
        </div>
    )
}
