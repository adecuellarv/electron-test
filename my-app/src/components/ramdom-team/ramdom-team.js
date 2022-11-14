const { useState, useEffect } = require('react');
const React = require('react');
const ReactDOM = require('react-dom/client');
const pop_inst = document.getElementById('pop_inst');

const teams = [1, 2];
let timer;
const RamdomTeam = ({ setPage }) => {
    const [firstTeam, setFirstTeam] = useState('');
    const [start, setStart] = useState(false);
    const [seconds, setSeconds] = useState(30);

    const startRamdomChose = () => {
        setStart(true);
    }

    useEffect(() => {
        if (seconds !== 0 && start) {
            timer = setInterval(() => {
                const random = Math.floor(Math.random() * teams.length);
                console.log('random', random)
                if (random === 0) setFirstTeam('Azul');
                if (random === 1) setFirstTeam('Rojo'); 
                setSeconds(seconds - 1);
            }, 100);
        }

        if (seconds === 0) {
            clearInterval(timer);
            setStart(false);
        }

        return () => {
            clearInterval(timer);
        };
    }, [start, seconds]);

    return (
        <div className="home-container"
            style={{
                //backgroundImage: `url(${pop_inst?.src})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                //height: 200
            }}
        //onClick={() => setPage(3)}
        >
            <button
                onClick={startRamdomChose}
            >Empezar volado</button>
            <h1 style={{ color: 'white' }}>Primer turno</h1>
            <p style={{ color: 'white' }}>{firstTeam}</p>
        </div>
    )
};