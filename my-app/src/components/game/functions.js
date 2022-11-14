const React = require('react');
const { useState, useRef, useEffect } = require('react');
const ReactDOM = require('react-dom/client');
const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const bgpopup = document.getElementById('bgpopup');
const coingif = document.getElementById('coingif');

const listLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const listNumbers = [1, 2, 3, 4, 5, 6, 7];

const arrayOptions = () => {
    listLetters.map((i) => {
        listNumbers.map((j) => {
            console.log('(' + i + ',' + j + ')')
        });
    });
};

const teams = [1, 2];
let timer;
const minTime = 40;
const RamdomTeamScreen = ({ starRamdom, firstTeam }) => { 
    const [seconds, setSeconds] = useState(minTime);
    const [temporalTeamChose, setTemporalTeamChose] = useState('');

    useEffect(() => {
        if (seconds !== 0 && starRamdom) {
            timer = setInterval(() => {
                const random = Math.floor(Math.random() * teams.length);
                if (random === 0) setTemporalTeamChose('Azul');
                if (random === 1) setTemporalTeamChose('Rojo');
                setSeconds(seconds - 1);
            }, 100);
        }

        if (seconds === 0) {
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [starRamdom, seconds]);


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

                                        <div>
                                            <div>
                                                {!starRamdom === 1 ?
                                                    <img src={coingif?.src} />
                                                    :
                                                    <img src={coingif?.src} />
                                                }
                                            </div>
                                            <div>
                                                <p className="machineFont" style={{ fontSize: 22 }}>
                                                    Primer turno
                                                </p>
                                                <p className="machineFont" style={{ fontSize: 20 }}>{firstTeam ? firstTeam : temporalTeamChose}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};