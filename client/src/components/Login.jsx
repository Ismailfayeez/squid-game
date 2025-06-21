import React, { useEffect, useState } from 'react'
import sgBg from '../assets/sgBg.webp'
import { Tabs } from './ui/tabs/Tabs'
import { Input } from './ui/Input'
import { fetchData } from '../utils/fetchData'

export const Login = ({ setLocation }) => {
    const [tab, setSelected] = useState('new')
    const [input, setInput] = useState({ name: '', code: '' })
    const [error, setError] = useState('')
    const joinGame = tab === 'join'

    useEffect(() => {
        setError('')
    }, [tab, input])

    const handleInput = ({ target }) =>
        setInput({ ...input, [target.name]: target.value })

    const handleLogin = async () => {
        setError('')
        const { name, code } = input
        const { res } = await fetchData(
            { name, ...(joinGame ? { code } : {}) },
            joinGame ? 'PUT' : 'POST'
        )

        if (res.ok) setLocation('game')
        else {
            const { error } = await res.json()
            setError(error)
        }
    }

    return (
        <div
            className="background flex"
            style={{
                backgroundImage: `url(${sgBg})`,
            }}
        >
            <div className="black-tile flex login">
                <Tabs
                    tabList={['new', 'join']}
                    defaultTab={tab}
                    handleSelect={setSelected}
                />
                <Input name="name" data={input} handleChange={handleInput} />
                {joinGame && (
                    <Input
                        name="code"
                        data={input}
                        handleChange={handleInput}
                    />
                )}
                <div>
                    {error && <div className="error-msg">{error}</div>}
                    <button
                        className="btn margin--zero"
                        onClick={handleLogin}
                        disabled={error}
                    >
                        {tab == 'join' ? 'Join' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
    )
}
