const React = require('react');
const { useState, useRef, useEffect } = require('react');
const ReactDOM = require('react-dom/client');
const { ipcRenderer } = require('electron');
const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const bgpopup = document.getElementById('bgpopup');
const buttonstart = document.getElementById('saveimage');
const coingif = document.getElementById('coingif');

const teams = [1, 2];
let timer;
const minTime = 40;
const RamdomTeam = ({ setPage }) => {
    const [firstTeam, setFirstTeam] = useState('');
    const [start, setStart] = useState(false);
    const [seconds, setSeconds] = useState(minTime);
    const refLogo = useRef(null);
    const refBtn = useRef(null);

    const startRamdomChose = () => {
        setStart(true);
        setSeconds(minTime);
        ipcRenderer.send('screen1:startRamdomTeam', true);
        ipcRenderer.send('screen2:startRamdomTeam', true);
    }

    const starGame = () => {
        setPage(4);
        ipcRenderer.send('screen1:startGame', true);
        ipcRenderer.send('screen2:startGame', true);
    }

    useEffect(() => {
        if (seconds !== 0 && start) {
            timer = setInterval(() => {
                const random = Math.floor(Math.random() * teams.length);
                if (random === 0) setFirstTeam('Azul');
                if (random === 1) setFirstTeam('Rojo');
                setSeconds(seconds - 1);
            }, 100);
        }

        if (seconds === 0) {
            clearInterval(timer);
            setStart(false);
            ipcRenderer.send('screen1:winRamdomTeam', firstTeam);
            ipcRenderer.send('screen1:startRamdomTeam', false);
            ipcRenderer.send('screen2:winRamdomTeam', firstTeam);
            ipcRenderer.send('screen2:startRamdomTeam', false);
            //ipcRenderer.send('screen2:winRamdomTeam', firstTeam);
        }

        return () => {
            clearInterval(timer);
        };
    }, [start, seconds]);


    return (
        <div
            style={{
                backgroundImage: `url(${bgimage?.src})`,
                backgroundPosition: '100% 100%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                width: '100%',
                height: '100vh',
            }}
        >
            <div
                style={{
                    transform: 'scale(.80)'
                }}
            >
                <div
                    className="container"
                    style={{
                        //paddingTop: paddingTopContent
                    }}
                >
                    <div className="row">
                        <div
                            className="col-sm-12"
                            style={{
                                textAlign: 'center',
                                //marginTop: 30,
                            }}
                            ref={refLogo}
                        >
                            <img
                                src={logo?.src}
                                style={{
                                    width: '20%',
                                }}
                            />
                        </div>
                        <div className='col-sm-12'>
                            <div
                                style={{
                                    backgroundImage: `url(${bgpopup?.src})`,
                                    backgroundPosition: '50% 50%',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'relative',
                                    width: '100%',
                                    height: '100vh',
                                    //height: 'calc(100vh - 170px)',
                                }}
                            >
                                <div className='row'>
                                    <div className="col-sm-12" style={{
                                        paddingTop: 140,
                                        textAlign: 'center'
                                    }}>
                                        <h1 className="machineFont">Tocar moneda para lanzar volado</h1>

                                        <div>
                                            <div>
                                                {!start ?
                                                    <button
                                                        onClick={startRamdomChose}
                                                    >Empezar volado</button>
                                                    :
                                                    <img src={coingif?.src} />
                                                }
                                            </div>
                                            <div>
                                                <p className="machineFont" style={{ fontSize: 22 }}>
                                                    Primer turno
                                                </p>
                                                <p className="machineFont" style={{ fontSize: 20 }}>{firstTeam}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="col-sm-12"
                            style={{
                                textAlign: 'center',
                                marginTop: -40,
                                position: 'relative',
                                zIndex: 1
                            }}
                            ref={refBtn}
                        >
                            <img
                                src={buttonstart?.src}
                                onClick={() => starGame()}
                            ></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};