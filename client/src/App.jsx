import { useState } from 'react';
import Cookies from 'js-cookie';
import { Session } from './components/Session';
import { Login } from './components/Login';
import { TOKEN_HEADER_KEY } from '../constants';
import './App.css';

function App() {
    const token = Cookies.get(TOKEN_HEADER_KEY);
    const [location, setLocation] = useState(token ? 'game' : 'login');
    return (
        <>
            {location === 'login' && <Login setLocation={setLocation} />}
            {location === 'game' && <Session setLocation={setLocation} />}
        </>
    );
}

export default App;
