const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport')
const { useState, useEffect } = require('react');

let port;
const Index = () => {
    const [page, setPage] = useState(1);
    const [teamWinner, setTeamWinner] = useState('');

    useEffect(() => {
        port = new SerialPort({
            path: 'COM1',
            baudRate: 115200,
            databits: 8,
            parity: 'none',
            stopbits: 1,
            flowControl: false
        });
        localStorage.clear();
    }, []);

    return (
        <>
            {page === 1 &&
                <Home
                    setPage={setPage}
                />
            }
            {page === 2 &&
                <Assignment
                    port={port}
                    setPage={setPage}
                />
            }
            {page === 3 &&
                <Desk1
                    port={port}
                    setPage={setPage}
                    setTeamWinner={setTeamWinner}
                />
            }
            {page === 4 &&
                <Results
                    setPage={setPage}
                    teamWinner={teamWinner}
                />
            }
        </>
    )
};


if (document.getElementById('home')) {
    const root = ReactDOM.createRoot(document.getElementById('home'));
    root.render(<Index />);
}