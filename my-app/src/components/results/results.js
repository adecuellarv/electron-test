const React = require('react');
const ReactDOM = require('react-dom/client');
const bg_barco = document.getElementById('bg_barco');
const logo = document.getElementById('logo');
const btn_start_again = document.getElementById('btn_start_again');


const Results = ({ setPage, teamWinner }) => {
    
    const start = () => {
        localStorage.clear();
        setPage(1);
    };

    return (
        <div className="home-container"
            style={{
                backgroundImage: `linear-gradient(45deg, rgb(255 255 255 / 58%), rgb(255 255 255 / 73%)), url(${bg_barco?.src})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                padding: 100
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                }}
            >
                <img
                    src={logo?.src}
                    style={{
                        width: '30%',
                    }}
                />

                <h1
                    className='machineFont'
                    style={{
                        fontSize: 78,
                        color: '#1975cb'
                    }}
                >Equipo {teamWinner} <br />vencedor</h1>
            </div>
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <h1
                    className='machineFont'
                    style={{
                        fontSize: 56,
                        color: '#1975cb',
                        cursor: 'pointer'
                    }}
                    onClick={start}
                >INICIO 
                    <img 
                        src={btn_start_again?.src}
                        style={{
                            width: 50
                        }}
                    />
                </h1>
            </div>
        </div>
    )
};