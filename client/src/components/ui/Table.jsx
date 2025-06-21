import React from 'react'

export const Table = ({ rows, headers }) => {
    return (
        <table style={{ width: '100%' }}>
            <tr>
                {headers.map((head) => (
                    <th style={{ textAlign: 'center' }}>{head}</th>
                ))}
            </tr>
            {rows.map((row) => (
                <tr>
                    {row.map((data) => (
                        <td style={{ textAlign: 'center' }}>{data}</td>
                    ))}
                </tr>
            ))}
        </table>
    )
}
