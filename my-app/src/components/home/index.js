const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport')
const { useState, useEffect } = require('react');

let port;
const Index = () => {
    const [page, setPage] = useState(1);

    useEffect(() => {
        port = new SerialPort({
            path: 'COM1',
            baudRate: 115200,
            databits: 8,
            parity: 'none',
            stopbits: 1,
            flowControl: false
        });
    }, [])

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
                />
            }
        </>
    )
};


if (document.getElementById('home')) {
    const root = ReactDOM.createRoot(document.getElementById('home'));
    root.render(<Index />);
}