const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort, ReadlineParser } = require('serialport')
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const saveimage = document.getElementById('saveimage');
const clean_btn = document.getElementById('clean_btn');

const acorazado = document.getElementById('acorazado');
const fragata = document.getElementById('fragata');
const portaviones = document.getElementById('portaviones');

let countSelectedRed = 1, countSelectedBlue = 1;
const Assignment = ({ port, setPage }) => {
    const scree1Active = true //localStorage.getItem('screen1');
    const scree2Active = true //localStorage.getItem('screen2');
    const [teamBlue, setTeamBlue] = useState([]);
    const [teamRed, setTeamRed] = useState([]);
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [boatNumberBlue, setBoatNumberBlue] = useState(1);
    const [boatNumberRed, setBoatNumberRed] = useState(1);
    const [turnChose, setTurnChose] = useState(1);
    const [choseBoat, setChoseBoat] = useState();
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);
    const refContentMain = useRef(null);

    const validateBoatSize = (lengthBoat, teamArray, boatNumber) => {
        const lenghtByBoatNumber = teamArray.filter(i => i.boatNumber === boatNumber);
        if (lengthBoat === lenghtByBoatNumber.length) {
            return true;
        } else {
            return false;
        }
    };

    const chooseByBoat = (lengthBoat) => {
        setChoseBoat(lengthBoat)
        if (turnChose === 1) {
            if (teamBlue.length) {
                const validate = validateBoatSize(lengthBoat, teamBlue, boatNumberBlue);
                if (validate) {
                    setBoatNumberBlue(parseInt(boatNumberBlue) + 1);
                    countSelectedBlue = 1;
                } else {
                    alert('Los participantes para este barco debe ser ' + lengthBoat);
                }
            } else alert('Selecciona posiciones para el barco');
        } else {
            if (teamRed.length) {
                const validate = validateBoatSize(lengthBoat, teamRed, boatNumberRed);
                if (validate) {
                    setBoatNumberRed(parseInt(boatNumberRed) + 1);
                    countSelectedBlue = 1;
                } else {
                    alert('Los participantes para este barco debe ser ' + lengthBoat);
                }
            } else alert('Selecciona posiciones para el barco');
        }
    };

    const saveByBoatBlue = () => {
        if (teamBlue.length) {
            setBoatNumberBlue(parseInt(boatNumberBlue) + 1);
            countSelectedBlue = 1;
        } else alert('Selecciona posiciones para el barco');
    };

    const saveByBoatRed = () => {
        if (teamRed.length) {
            setBoatNumberRed(parseInt(boatNumberRed) + 1);
            countSelectedRed = 1;
        } else alert('Selecciona posiciones para el barco');
    };

    const saveChoice = (team, row, column, rowNum, columnNum) => {
        const filaNum = rowNum + 1, position = columnNum + 1;
        const canalesDMX = [];
        if (filaNum < 8) {
            let startIn;
            if (team === 1) {
                startIn = 1;
                if (filaNum > 1) {
                    startIn = (filaNum - 1) * 21 + 1;
                }
            } else {
                startIn = 162;
                if (filaNum > 1) {
                    startIn = (filaNum - 1) * 21 + 162;
                }
            }

            const topByPosition = position * 3 + startIn;
            const startByPostion = topByPosition - 3;
            for (let index = startByPostion; index < topByPosition; index++) {
                const element = index;
                canalesDMX.push(element);
            }
        }

        if (team === 1) {
            let newArray = teamBlue;
            const position = newArray.findIndex(item => item.name === `${row}${column}`);

            if (position === -1) {
                const obj = {
                    row,
                    column,
                    name: `${row}${column}`,
                    canalesDMX,
                    boatNumber: boatNumberBlue
                }
                newArray.push(obj);
            } else {
                const boatNumber = newArray[position].boatNumber;
                const filtered = newArray.filter(function (i, index, arr) {
                    return i.boatNumber !== boatNumber;
                });

                newArray = filtered;
            }

            if (countSelectedBlue <= 3) {
                setTeamBlue([...newArray]);
                //countSelectedBlue++;
            } else alert('El máximo de integrantes por barco es de 3')


        } else {
            let newArray = teamRed;
            const position = newArray.findIndex(item => item.name === `${row}${column}`);

            if (position === -1) {
                const obj = {
                    row,
                    column,
                    name: `${row}${column}`,
                    canalesDMX,
                    boatNumber: boatNumberRed
                }
                newArray.push(obj);
            } else {
                const boatNumber = newArray[position].boatNumber;
                const filtered = newArray.filter(function (i, index, arr) {
                    return i.boatNumber !== boatNumber;
                });

                newArray = filtered;
            }
            if (countSelectedRed <= 3) {
                setTeamRed([...newArray]);
                //countSelectedRed++;
            } else alert('El máximo de integrantes por barco es de 3')

        }
    };

    const isActive = (team, name) => {
        if (team === 1) {
            const newArray = teamBlue;
            const position = newArray.findIndex(item => item.name === name);
            if (position === -1) return false;
            else return true;
        } else {
            const newArray = teamRed;
            const position = newArray.findIndex(item => item.name === name);
            if (position === -1) return false;
            else return true;
        }
    }

    const start = async () => {
        //if (scree1Active && scree2Active) {
        if (teamBlue.length && teamRed.length) {
            if (teamBlue.length <= 8 && teamRed.length <= 8) {
                //if (teamBlue.length === teamRed.length) {
                localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
                localStorage.setItem("teamRed", JSON.stringify(teamRed));
                if (port?.port)
                    await executecCMD('C');
                const resp = await sendCommands();
                if (resp) {
                    //window.location.href = "game-deskt1.html";
                    setPage(4);
                }
            } else {
                alert('El máximo de jugadores es 8');
            }
        } else alert('Selecciona posiciones de equipos');
        //} else alert('No se han detectado pantallas conectadas');
    }

    const saveSection = (team) => {
        //console.log('team', team)
        if (team === 1) {
            if (teamBlue.length) {
                const boatTemporalNumber =  boatNumberBlue - 1;
                const validate = validateBoatSize(choseBoat, teamBlue, boatTemporalNumber);
                if(validate){
                    setTurnChose(2);
                }else{
                    alert('Selecciona un tipo de barco');
                }
            } else alert('Selecciona posiciones de equipo');
        }
        if (team === 2) {
            if (teamRed.length) {
                const boatTemporalNumber =  boatNumberRed - 1;
                const validate = validateBoatSize(choseBoat, teamRed, boatTemporalNumber);
                if(validate){
                    start();
                }else{
                    alert('Selecciona un tipo de barco');
                }
            } else alert('Selecciona posiciones de equipo');
        }
    };

    const cleanSection = (team) => {
        if (team === 1) {
            setTeamBlue([]);
        }
        if (team === 2) {
            setTeamRed([]);
        }
    };

    const sendCommands = () => {

        if (!port?.port) {
            const bothArrays = teamBlue.concat(teamRed);

            bothArrays.map(item => {
                if (item.canalesDMX.length) {
                    item.canalesDMX.map((i, k) => {
                        const codeToSend = `A${i.toString().padStart(3, "0")}@${k === 2 ? '255' : '000'}:000`;
                        executecCMD(codeToSend);
                    });
                }
            })
            return true;
        } else {
            alert('No se ha podido conectar con el puerto COM1');
            return false;
        }
    };

    const executecCMD = async (code) => {
        port.write(`${code}\r`);
        console.log(`${code}\r`);
        return true;
    }

    const checkLocalStorage = () => {
        const teamBlueLocalStorage = JSON.parse(localStorage.getItem('teamBlue'));
        const teamRedLocalStorage = JSON.parse(localStorage.getItem('teamRed'));

        if (teamBlueLocalStorage && teamBlueLocalStorage.length) {
            setTeamBlue(teamBlueLocalStorage);
        }

        if (teamRedLocalStorage && teamRedLocalStorage.length) {
            setTeamRed(teamRedLocalStorage);
        }
    };

    useEffect(() => {
        checkLocalStorage();
        const handleResize = () => {

            const widthLeft = refBoxLeft?.current?.offsetWidth;
            if (widthLeft) {
                const size = (widthLeft - 140) / 7;
                setSizeBtnPositions(size - 2);
            }/*
            const heightLogo = refLogo?.current.offsetHeight;
            //const heightBtn = refBtn?.current.offsetHeight;
            const heightBoxes = refBoxLeft?.current.offsetHeight;
            if (heightBoxes && heightLogo) {
                const heightWindow = window?.innerHeight;
                if (heightWindow) {
                    const div = heightWindow - (heightBoxes + heightLogo);
                    if (div > 0) {
                        setPaddingTopContent(heightWindow < 800 ? (div / 2) - 40 : (div / 2));
                    }
                }
            }*/

        };
        //localStorage.clear();
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                //height: refContentMain?.current?.clientHeight
            }}
        >
            <div
                className='responsiveDivAssingment'
            >
                <div className="row">
                    <div className="col-sm-12">
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={logo?.src}
                                style={{
                                    width: 200,
                                    height: 50
                                }}
                            />
                        </div>
                    </div>

                    <div className='col-sm-12'>
                        <div
                            style={{
                                //transform: 'scale(.98)',
                            }}
                        >
                            <div className='row'>
                                <div className="col-sm-6"

                                >
                                    <div
                                        style={{
                                            backgroundImage: `url(${boxleft?.src})`,
                                            backgroundPosition: '50% 50%',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            //position: 'relative',
                                            width: '100%',
                                            height: 650,
                                            //top: -600
                                            top: 0
                                        }}
                                    >
                                        {turnChose === 1 ?
                                            <div className="div-array" ref={refBoxLeft}>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <label className='machineFont titleIntructionsAssigment'>1.- Seleccionar coordenadas</label>
                                                        <label className="machineFont" style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                                    </div>
                                                </div>
                                                {listLetters.map((i, key) =>
                                                    <div key={key}>
                                                        {listNumbers.map((j, k) => {
                                                            return (
                                                                <button
                                                                    className={`buttons-lists_asg machineFont ${isActive(1, `${i}${j}`) ? 'button-active-b' : ''}`}
                                                                    style={{
                                                                        width: sizeBtnPositions,
                                                                        height: sizeBtnPositions,
                                                                        fontSize: sizeBtnPositions / 3
                                                                    }}
                                                                    key={k}
                                                                    onClick={() => saveChoice(1, i, j, key, k)}
                                                                >
                                                                    {`${i}${j}`}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            :
                                            <div className="div-array boatsSelection" ref={refBoxLeft}>
                                                <div className='row'>
                                                    <div className='col-sm-10' style={{ textAlign: 'left', marginBottom: 30 }}>
                                                        <label className='machineFont titleIntructionsAssigment'>2.- Haz click para seleccionar tipo de embarcación por cantidad de jugadores</label>
                                                    </div>
                                                    <div className='col-sm-2'></div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img
                                                        src={portaviones?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block'
                                                        }}
                                                        onClick={() => chooseByBoat(3)}
                                                    />
                                                    <img
                                                        src={acorazado?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block',
                                                            paddingTop: 30
                                                        }}
                                                        onClick={() => chooseByBoat(2)}
                                                    />
                                                    <img
                                                        src={fragata?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block',
                                                            paddingTop: 30
                                                        }}
                                                        onClick={() => chooseByBoat(1)}
                                                    />
                                                    <div className='row'>
                                                        <div className='col-sm-6'>
                                                            <img
                                                                onClick={() => cleanSection(2)}
                                                                src={clean_btn?.src}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    paddingTop: 30,
                                                                    width: '50%'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='col-sm-6'>
                                                            <img
                                                                onClick={() => saveSection(2)}
                                                                src={saveimage?.src}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    paddingTop: 30,
                                                                    width: '50%'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div
                                        style={{
                                            backgroundImage: `url(${boxright?.src})`,
                                            backgroundPosition: '50% 50%',
                                            backgroundSize: 'contain',
                                            backgroundRepeat: 'no-repeat',
                                            //position: 'relative',
                                            width: '100%',
                                            height: 650,
                                            //top: -600
                                            top: 0
                                        }}
                                    >
                                        {turnChose === 2 ?
                                            <div className="div-array">
                                                <div className="row">
                                                    <div className="col-sm-12" style={{ textAlign: 'right' }}>
                                                        <label className='machineFont titleIntructionsAssigment'>1.- Seleccionar coordenadas</label>
                                                        <label className="machineFont" style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                                    </div>
                                                </div>
                                                {listLetters.map((i, key) =>
                                                    <div key={key}>
                                                        {listNumbers.map((j, k) =>
                                                            <button
                                                                className={`buttons-lists_asg machineFont ${isActive(2, `${i}${j}`) ? 'button-active-r' : ''}`}
                                                                style={{
                                                                    width: sizeBtnPositions,
                                                                    height: sizeBtnPositions,
                                                                    fontSize: sizeBtnPositions / 3
                                                                }}
                                                                key={k}
                                                                onClick={() => saveChoice(2, i, j, key, k)}
                                                            >
                                                                {`${i}${j}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            :
                                            <div className="div-array boatsSelection" ref={refBoxLeft}>
                                                <div className='row'>
                                                    <div className='col-sm-2'></div>
                                                    <div className='col-sm-10' style={{ textAlign: 'right', marginBottom: 30 }}>
                                                        <label className='machineFont titleIntructionsAssigment'>2.- Haz click para seleccionar tipo de embarcación por cantidad de jugadores</label>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <img
                                                        src={portaviones?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block'
                                                        }}
                                                        onClick={() => chooseByBoat(3)}
                                                    />
                                                    <img
                                                        src={acorazado?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block',
                                                            paddingTop: 30
                                                        }}
                                                        onClick={() => chooseByBoat(2)}
                                                    />
                                                    <img
                                                        src={fragata?.src}
                                                        style={{
                                                            width: 260,
                                                            margin: '0 auto',
                                                            display: 'block',
                                                            paddingTop: 30
                                                        }}
                                                        onClick={() => chooseByBoat(1)}
                                                    />
                                                    <div className='row'>
                                                        <div className='col-sm-6'>
                                                            <img
                                                                onClick={() => cleanSection(1)}
                                                                src={clean_btn?.src}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    paddingTop: 30,
                                                                    width: '50%'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='col-sm-6'>
                                                            <img
                                                                onClick={() => saveSection(1)}
                                                                src={saveimage?.src}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    paddingTop: 30,
                                                                    width: '50%'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
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

if (document.getElementById('assignment')) {
    const root = ReactDOM.createRoot(document.getElementById('assignment'));
    root.render(<Assignment />);
}