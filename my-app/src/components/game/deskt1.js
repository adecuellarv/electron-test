const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport');
const { ipcRenderer } = require('electron');
const { useState, useRef, useEffect } = require('react');
const Swal = require('sweetalert2')

const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const shutt = document.getElementById('shutt');
const saveimage = document.getElementById('saveimage');

const seconds = 300; //5min

const Desk1 = ({ port, setPage, setTeamWinner }) => {
    const startTeam = localStorage.getItem('startTeam');
    const teamBlue = JSON.parse(localStorage.getItem('teamBlue'));
    const teamRed = JSON.parse(localStorage.getItem('teamRed'));
    const shootFailed = JSON.parse(localStorage.getItem('shootFailed'));

    const [turnOF, setTurnOF] = useState(parseInt(startTeam));
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
    const refBtn = useRef(null);

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
                Swal.fire({
                    title: 'Turno',
                    text: 'Rojo',
                    timer: 900,
                    showCancelButton: false,
                    showConfirmButton: false
                })
            } else {
                const position = teamBlue.findIndex(item => item.name === itemSelected.name);
                if (position !== -1) {
                    actionsSuccess(2, 1, position);
                } else {
                    actionsError(2, 1);
                }
                setTurnOF(1);
                Swal.fire({
                    title: 'Turno',
                    text: 'Azul',
                    timer: 900,
                    showCancelButton: false,
                    showConfirmButton: false
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Selecciona una posición'
            })
        }
    };

    const actionsSuccess = (teamGame, teamShutter, positionArray) => {
        //console.log('1.- enviar señal a jorge');
        sendCommands(itemSelected?.canalesDMX, 'success', teamShutter, itemSelected?.row);
        //console.log('2.- enviar video1 a pantalla equipo azul');
        //console.log('3.- actualizar pantalla de equipo azul');

        if (teamShutter === 2) {
            teamRed[positionArray].killed = 'true';
            localStorage.setItem("teamRed", JSON.stringify(teamRed));
            setSuccessBlue(successBlue + 1);

            //succes pantalla
            const boatNumber = teamRed[positionArray].boatNumber;
            const totalItems = teamRed.filter(i => i.boatNumber === boatNumber);
            ipcRenderer.send('screen1:success', {
                totalItems: totalItems.length,
                boatNumber,
                teamRed
            });


        }
        if (teamShutter === 1) {
            teamBlue[positionArray].killed = 'true';
            localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
            setSuccessRed(successRed + 1);

            //succes pantalla
            const boatNumber = teamBlue[positionArray].boatNumber;
            const totalItems = teamBlue.filter(i => i.boatNumber === boatNumber);
            ipcRenderer.send('screen2:success', {
                totalItems: totalItems.length,
                boatNumber,
                teamBlue
            });
        }

        setItemSelected({});
    };

    const actionsError = (teamGame, teamShutter) => {
        //console.log('1.- enviar señal a jorge');
        sendCommands(itemSelected?.canalesDMX, 'error');
        if (teamGame === 1) {
            ipcRenderer.send('screen1:error', 1);
            //console.log('2.- enviar video2 a pantalla equipo azul');
            //console.log('3.- actualizar pantalla de equipo azul');
        } else {
            ipcRenderer.send('screen2:error', 1);
            //console.log('2.- enviar video2 a pantalla equipo rojo');
            //console.log('3.- actualizar pantalla de equipo rojo');
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

    const sendCommands = (canalesDMX, typeSend, teamShutter, row) => {
        if (!port?.port) {
            if (canalesDMX.length) {
                canalesDMX.map((i, k) => {
                    let codeToSend = '';
                    if (typeSend === 'success') {
                        codeToSend = `A${i.toString().padStart(3, "0")}@${k === 0 ? '255' : '000'}:000`;
                    }
                    if (typeSend === 'error') {
                        codeToSend = `A${i.toString().padStart(3, "0")}@255:000`;
                    }
                    executecCMD(codeToSend);
                });
            }
            if (typeSend === 'success') {
                const codeAir = getCodeAir(teamShutter, row);
                executecCMD(`A${codeAir}@255:000`);

                setTimeout(() => {
                    executecCMD(`A${codeAir}@000:000`);
                }, 2000);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se ha podido conectar con el puerto COM1'
            })
        }
    };

    const executecCMD = async (code) => {
        port.write(`${code}\r`);
        console.log(`${code}\r`);
        return true;
    }

    const getColorBtn = (team, row, column) => {
        const shootFailed_ = JSON.parse(localStorage.getItem('shootFailed'));
        const shootFailed = shootFailed_ ? shootFailed_ : [];
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
        }
    };

    const sendFaileds = (items) => {
        if (items && items.length) {
            const newFormShootBlue = [], newFormShootRed = [];
            items.map(i => {

                if (i.teamShutter === 2) {
                    const obj = {
                        name: i.name,
                        failed: 'true'
                    }

                    newFormShootBlue.push(obj);
                }

                if (i.teamShutter === 1) {
                    const obj = {
                        name: i.name,
                        failed: 'true'
                    }

                    newFormShootRed.push(obj);
                }

            });
            if (newFormShootBlue.length)
                ipcRenderer.send('screen1:teamRedFailed', newFormShootBlue);
            if (newFormShootRed.length)
                ipcRenderer.send('screen2:teamRedFailed', newFormShootRed);
        }
    };

    const getCodeAir = (teamKilled, row) => {
        if (teamKilled === 1) {
            switch (row) {
                case 'A':
                    return '148';
                case 'B':
                    return '149';
                case 'C':
                    return '150';
                case 'D':
                    return '151';
                case 'E':
                    return '152';
                case 'F':
                    return '153';
                case 'G':
                    return '154';

                default:
                    break;
            }
        }
        if (teamKilled === 2) {
            switch (row) {
                case 'A':
                    return '155';
                case 'B':
                    return '156';
                case 'C':
                    return '157';
                case 'D':
                    return '158';
                case 'E':
                    return '159';
                case 'F':
                    return '160';
                case 'G':
                    return '161';
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        if (itemsSelected.length) {
            setRender(true);
            setTimeout(() => {
                localStorage.setItem("shootFailed", JSON.stringify(itemsSelected));
                sendFaileds(itemsSelected);
                setRender(false);
            }, 100);
        }
    }, [itemsSelected]);

    useEffect(() => {
        if (successBlue >= teamRed.length) {
            setTeamWinner('Azul');
            ipcRenderer.send('screen1:winner', 'Azul');
            ipcRenderer.send('screen2:winner', 'Azul');
            setPage(6);
        }
    }, [successBlue]);

    useEffect(() => {
        if (successRed >= teamBlue.length) {
            setTeamWinner('Rojo');
            ipcRenderer.send('screen1:winner', 'Rojo');
            ipcRenderer.send('screen2:winner', 'Rojo');
            setPage(6);
        }
    }, [successRed]);

    useEffect(() => {
        if (teamBlue.length) {
            ipcRenderer.send('screen2:teamRed', teamBlue);
        }
    }, [teamBlue]);

    useEffect(() => {
        if (teamRed.length) {
            ipcRenderer.send('screen1:teamRed', teamRed);
        }
    }, [teamRed]);

    useEffect(() => {
        const shootFailed = JSON.parse(localStorage.getItem('shootFailed'));
        setItemsSelected(shootFailed ? shootFailed : []);
        const handleResize = () => {
            const widthLeft = refBoxLeft?.current?.offsetWidth;
            if (widthLeft) {
                const size = (widthLeft - 140) / 7;
                setSizeBtnPositions(size - 2);
            }
            /*
            const heightLogo = refLogo?.current.offsetHeight;
            const heightBtn = refBtn?.current.offsetHeight;
            const heightBoxes = refBoxLeft?.current.offsetHeight;
            if (heightBoxes && heightLogo) {
                const heightWindow = window?.innerHeight;
                if (heightWindow) {
                    const div = heightWindow - (heightBoxes + heightLogo + heightBtn);
                    if (div > 0) {
                        setPaddingTopContent(heightWindow < 800 ? (div / 2) - 40 : (div / 2));
                    }
                }
            }*/

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
                    <div className="col-sm-6" style={{ marginTop: -30 }}>
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
                            <div className="div-array" ref={refBoxLeft}>
                                <div className="row">
                                    <div className="col-sm-12" style={{ textAlign: 'left', marginBottom: 10 }}>
                                        <label className='machineFont titleIntructionsAssigment'>Turno equipo rojo disparar al</label>
                                        <label className="machineFont" style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                    </div>

                                </div>
                                {listLetters.map((i, key) =>
                                    <div key={key}>
                                        {listNumbers.map((j, k) =>
                                            <button
                                                className={
                                                    `buttons-lists machineFont  
                                                    ${getColorBtn(2, i, j)}
                                                `}
                                                style={{
                                                    width: sizeBtnPositions,
                                                    height: sizeBtnPositions,
                                                    fontSize: sizeBtnPositions / 3
                                                }}
                                                key={k}
                                                onClick={() => saveChoice(1, i, j, key, k)}
                                                disabled={turnOF === 1 || getColorBtn(2, i, j) === 'btn-red' || getColorBtn(2, i, j) === 'btn-white'}
                                            >
                                                {`${i}${j}`}
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                        <div
                            className="col-sm-12"
                            style={{ textAlign: 'center', marginTop: 10 }}
                        >
                            <img
                                disabled={turnOF === 1}
                                onClick={turnOF === 1 ? null : send}
                                src={shutt?.src}
                                style={{
                                    cursor: 'pointer',
                                    paddingTop: 10,
                                    width: '20%',
                                    opacity: turnOF === 1 ? .5 : 1
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6" style={{ marginTop: -30 }}>
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
                            <div className="div-array">
                                <div className="row">
                                    <div className="col-sm-12" style={{ textAlign: 'right', marginBottom: 10 }}>
                                        <label className='machineFont titleIntructionsAssigment'>Turno equipo azul disparar al</label>
                                        <label className="machineFont" style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                    </div>
                                </div>
                                {listLetters.map((i, key) =>
                                    <div key={key}>
                                        {listNumbers.map((j, k) =>
                                            <button
                                                className={
                                                    `buttons-lists machineFont ${getColorBtn(1, i, j)}`}
                                                style={{
                                                    width: sizeBtnPositions,
                                                    height: sizeBtnPositions,
                                                    fontSize: sizeBtnPositions / 3
                                                }}
                                                key={k}
                                                onClick={() => saveChoice(2, i, j, key, k)}
                                                disabled={turnOF === 2 || getColorBtn(1, i, j) === 'btn-red' || getColorBtn(1, i, j) === 'btn-white'}
                                            //disabled={turnOF === 2}
                                            >
                                                {`${i}${j}`}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className="col-sm-12"
                            style={{ textAlign: 'center', marginTop: 10 }}
                        >
                            <img
                                disabled={turnOF === 2}
                                onClick={turnOF === 2 ? null : send}
                                src={shutt?.src}
                                style={{
                                    cursor: 'pointer',
                                    paddingTop: 10,
                                    width: '20%',
                                    opacity: turnOF === 2 ? .5 : 1
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="col-sm-12"
                        style={{
                            textAlign: 'center',
                            marginTop: 20
                        }}
                        ref={refBtn}
                    >

                    </div>
                </div>
            </div>
        </div>
    )
};

if (document.getElementById('game-deskt1')) {
    const root = ReactDOM.createRoot(document.getElementById('game-deskt1'));
    root.render(<Desk1 />);
}