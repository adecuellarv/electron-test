const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport')
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const barras1 = document.getElementById('barras1');
const barras2 = document.getElementById('barras2');
const barras3 = document.getElementById('barras3');
const circles1 = document.getElementById('circles');
const circles2 = document.getElementById('circles2');

const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');

const seconds = 300; //5min

const ScreenBlue = ({ port, setPage, setTeamWinner }) => {
    const teamBlue = JSON.parse(localStorage.getItem('teamBlue'));
    const teamRed = JSON.parse(localStorage.getItem('teamRed'));

    const [turnOF, setTurnOF] = useState(1);
    const [itemSelected, setItemSelected] = useState({});
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [itemsSelected, setItemsSelected] = useState([]);
    const [render, setRender] = useState(false);
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [successBlue, setSuccessBlue] = useState(0);
    const [successRed, setSuccessRed] = useState(0);
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBoxParentLeft = useRef(null);

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

        if (itemSelected?.name === `${row}${column}`) {
            setItemSelected({});
        } else
            setItemSelected({
                team,
                row,
                column,
                name: `${row}${column}`,
                canalesDMX
            })
    };

    const send = () => {
        if (itemSelected?.name) {
            if (turnOF === 1) {
                const position = teamRed.findIndex(item => item.name === itemSelected.name);
                if (position !== -1) {
                    actionsSuccess(1, 2, position);
                } else {
                    actionsError(1, 2);
                }
                setTurnOF(2);
            } else {
                const position = teamBlue.findIndex(item => item.name === itemSelected.name);
                if (position !== -1) {
                    actionsSuccess(2, 1, position);
                } else {
                    actionsError(2, 1);
                }
                setTurnOF(1);
            }
        } else {
            alert('Selecciona una posición');
        }
    };

    const actionsSuccess = (teamGame, teamShutter, positionArray) => {
        //console.log('1.- enviar señal a jorge');
        sendCommands(itemSelected?.canalesDMX, 'success');
        if (teamGame === 1) {
            console.log('2.- enviar video1 a pantalla equipo azul');
            console.log('3.- actualizar pantalla de equipo azul');
        } else {
            console.log('2.- enviar video1 a pantalla equipo rojo');
            console.log('3.- actualizar pantalla de equipo rojo');
        }

        if (teamShutter === 2) {
            teamRed[positionArray].killed = 'true';
            localStorage.setItem("teamRed", JSON.stringify(teamRed));
            setSuccessBlue(successBlue + 1);
        }
        if (teamShutter === 1) {
            teamBlue[positionArray].killed = 'true';
            localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
            setSuccessRed(successRed + 1);
        }

        setItemSelected({});
    };

    const actionsError = (teamGame, teamShutter) => {
        //console.log('1.- enviar señal a jorge');
        sendCommands(itemSelected?.canalesDMX, 'error');
        if (teamGame === 1) {
            console.log('2.- enviar video2 a pantalla equipo azul');
            console.log('3.- actualizar pantalla de equipo azul');
        } else {
            console.log('2.- enviar video2 a pantalla equipo rojo');
            console.log('3.- actualizar pantalla de equipo rojo');
        }

        const newArray = itemsSelected;
        if (newArray.length) {
            const position = itemsSelected.findIndex(item => item.teamShutter === teamShutter && item.name === itemSelected.name);
            if (position === -1) {
                const obj = {
                    teamShutter,
                    name: itemSelected.name,
                    canalesDMX: itemSelected.canalesDMX
                };
                newArray.push(obj);
            }
        } else {
            const obj = {
                teamShutter,
                name: itemSelected.name,
                canalesDMX: itemSelected.canalesDMX
            };
            newArray.push(obj);
        }

        setItemsSelected([...newArray]);
        setItemSelected({});
    };

    const sendCommands = (canalesDMX, typeSend) => {
        if (!port?.port) {
            if (canalesDMX.length) {
                canalesDMX.map((i, k) => {
                    let codeToSend = '';
                    if (typeSend === 'success') {
                        codeToSend = `A${i.toString().padStart(3, "0")}@${k === 0 ? '255' : '0'}:000`;
                    }
                    if (typeSend === 'error') {
                        codeToSend = `A${i.toString().padStart(3, "0")}@255:000`;
                    }
                    executecCMD(codeToSend);
                });
            }
        } else {
            alert('No se ha podido conectar con el puerto COM1');
        }
    };

    const executecCMD = async (code) => {
        port.write(`${code}\r`);
        console.log(`${code}\r`);
        return true;
    }

    const getColorBtn = (team, row, column) => {
        /*
        const shootFailed_ = JSON.parse(localStorage.getItem('shootFailed'));
        console.log('shootFailed_', shootFailed_)
        const shootFailed = shootFailed_ ? shootFailed_ : [];
        console.log('shootFailed', shootFailed)
        let teamCurrently = team === 1 ? 2 : 1;
        if (itemSelected?.team == teamCurrently && itemSelected?.name === `${row}${column}`) {
            return 'btn-onfucus';
        } else {
            if (team === 1) {
                const position = teamRed.findIndex(item => item.name === `${row}${column}`);
                if (position !== -1 && teamRed[position]?.killed === 'true') {
                    return 'btn-red';
                } else {
                    const positionS = shootFailed.findIndex(item => item.teamShutter === 2 && item.name === `${row}${column}`);
                    if (positionS !== -1) {
                        return 'btn-white';
                    }
                }
            }

            if (team === 2) {
                const position = teamBlue.findIndex(item => item.name === `${row}${column}`);
                if (position !== -1 && teamBlue[position]?.killed === 'true') {
                    return 'btn-red';
                } else {
                    const positionS = shootFailed.findIndex(item => item.teamShutter === 1 && item.name === `${row}${column}`);
                    if (positionS !== -1) {
                        return 'btn-white';
                    }
                }
            }
        }*/
    };
    /*
    useEffect(() => {
        if (itemsSelected.length) {
            setRender(true);
            setTimeout(() => {
                localStorage.setItem("shootFailed", JSON.stringify(itemsSelected));
                setRender(false);
            }, 100);
        }
    }, [itemsSelected]);

    useEffect(() => {
        if (successBlue >= teamRed.length) {
            setTeamWinner('Azul');
            setPage(4);
        }
    }, [successBlue]);

    useEffect(() => {
        if (successRed >= teamBlue.length) {
            setTeamWinner('Rojo');
            setPage(4);
        }
    }, [successRed]);*/

    useEffect(() => {
        const shootFailed = JSON.parse(localStorage.getItem('shootFailed'));
        setItemsSelected(shootFailed ? shootFailed : []);
        const handleResize = () => {
            const widthLeft = refBoxLeft?.current?.offsetWidth;
            if (widthLeft) {
                const size = (widthLeft - 140) / 8;
                setSizeBtnPositions(size - 2);
            }
            const heightLogo = refLogo?.current.offsetHeight;
            const heightBoxes = refBoxLeft?.current.offsetHeight;
            if (heightBoxes && heightLogo) {
                const heightWindow = window?.innerHeight;
                if (heightWindow) {
                    const div = heightWindow - (heightBoxes + heightLogo);
                    if (div > 0) {
                        setPaddingTopContent(heightWindow < 800 ? (div / 2) - 40 : (div / 2));
                    }
                }
            }

        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        /*
        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalId);*/
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
            }}
        >
            <div
                className="container"
                style={{
                    paddingTop: paddingTopContent
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
                    <div className="col-sm-6" style={{ marginTop: -30 }}>
                        <div
                            style={{
                                backgroundImage: `url(${boxleft?.src})`,
                                backgroundPosition: '50% 50%',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                                width: '100%',
                                //height: 'calc(100vh - 170px)',
                            }}
                            ref={refBoxParentLeft}
                        >
                            <div className="div-array" ref={refBoxLeft}>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label className="machineFont" style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-1"
                                        style={{
                                            marginTop: sizeBtnPositions
                                        }}
                                    >
                                        {listLetters.map((i, key) =>
                                            <div
                                                key={key}
                                                style={{
                                                    paddingRight: 10,
                                                    width: sizeBtnPositions,
                                                    height: sizeBtnPositions + 7,
                                                }}
                                            >
                                                <label
                                                    style={{


                                                        textAlign: 'center',
                                                        color: '#fff'
                                                    }}
                                                >{i}</label>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-sm-11">

                                        {listNumbers.map((j, k) =>
                                            <label
                                                key={k}
                                                className="machineFont"
                                                style={{
                                                    width: sizeBtnPositions,
                                                    height: sizeBtnPositions,
                                                    textAlign: 'center',
                                                    color: '#fff'
                                                }}
                                            >{j}</label>
                                        )}

                                        {listLetters.map((i, key) =>
                                            <div key={key}>
                                                {listNumbers.map((j, k) =>
                                                    <div
                                                        className={
                                                            `box-lists machineFont  
                                                    ${getColorBtn(2, i, j)}
                                                `}
                                                        style={{
                                                            width: sizeBtnPositions,
                                                            height: sizeBtnPositions,
                                                        }}
                                                        key={k}

                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6" style={{ marginTop: -30 }}>
                        <div
                            style={{
                                backgroundImage: `url(${boxright?.src})`,
                                backgroundPosition: '50% 50%',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                                //width: '100%',
                                width: refBoxParentLeft?.current?.offsetWidth + 62,
                                height: refBoxParentLeft?.current?.offsetWidth + 62,
                                padding: 75,
                                //height: 'calc(100vh - 170px)',
                            }}
                        >
                            <div className="row">
                                <div className="col-sm-6">
                                    <img
                                        src={barras3?.src}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <img
                                        src={circles1?.src}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <video
                                        controls={false}
                                        autoPlay={true}
                                        loop={true}
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <source src={video1?.src} type="video/webm" />
                                        Your browser does not support HTML video.
                                    </video>
                                </div>
                                <div className="col-sm-4">
                                    <img
                                        src={barras1?.src}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <img
                                        src={barras2?.src}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <img
                                        src={circles2?.src}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

if (document.getElementById('screen-blue')) {
    const root = ReactDOM.createRoot(document.getElementById('screen-blue'));
    root.render(<ScreenBlue />);
}