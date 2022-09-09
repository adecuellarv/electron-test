const React = require('react');
const ReactDOM = require('react-dom/client');
const { exec } = require('child_process');
const { SerialPort } = require('serialport')
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const saveimage = document.getElementById('saveimage');

const Assignment = () => {
    const [teamBlue, setTeamBlue] = useState([]);
    const [teamRed, setTeamRed] = useState([]);
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [channels, setChannels] = useState([]);
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);

    const saveChoice = (team, row, column, rowNum, columnNum) => {
        //console.log('countByRow', team, row, column)
        //console.log('position1', position1 + 1, 'position2', position2 + 1)
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
            //console.log('canalesDMX', canalesDMX)
        }

        if (team === 1) {
            const newArray = teamBlue;
            const position = newArray.findIndex(item => item.name === `${row}${column}`);

            if (position === -1) {
                const obj = {
                    row,
                    column,
                    name: `${row}${column}`,
                    canalesDMX
                }
                newArray.push(obj);
            } else
                newArray.splice(position, 1)

            setTeamBlue([...newArray]);
        } else {
            const newArray = teamRed;
            const position = newArray.findIndex(item => item.name === `${row}${column}`);

            if (position === -1) {
                const obj = {
                    row,
                    column,
                    name: `${row}${column}`,
                    canalesDMX
                }
                newArray.push(obj);
            } else
                newArray.splice(position, 1)

            setTeamRed([...newArray]);
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

    const start = () => {

        if (teamBlue.length && teamRed.length) {
            if (teamBlue.length <= 8 && teamRed.length <= 8) {
                if (teamBlue.length === teamRed.length) {
                    localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
                    localStorage.setItem("teamRed", JSON.stringify(teamRed));
                    if (sendCommands()) {
                        window.location.href = "game-deskt1.html";
                    }
                } else {
                    alert('Asegurate que la cantidad de jugadores sea la misma para ambos equipos');
                }
            } else {
                alert('El máximo de jugadores es 8');
            }
        } else alert('Selecciona posiciones de equipos');
    }

    const sendCommands = () => { 
        
        const port = new SerialPort({
            path: 'COM1',
            baudRate: 9600,
            databits: 8,
            parity: 'even',
            stopbits: 1,
            flowControl: false
        })
        //executecCMD('hola', port);
        //console.log(teamBlue, teamRed); 
        const portid = 'COM1';
        /*
        exec(`mode ${portid} BAUD=9600 PARITY=n DATA=8 STOP=1 xon=off octs=off rts=off`, (error, stdout, stderr) => {
            //exec(`start`, (error, stdout, stderr) => {
            if (error) {
                //console.error(`exec error: ${error}`);
                alert(`error al enviar datos`);
                return;
            } else {*/

        teamBlue.map(item => {
            //console.log('position', item.name)
            if (item.canalesDMX && item.canalesDMX.length) {
                item.canalesDMX.map((i, k) => {
                    const codeToSend = `A${i.toString().padStart(3, "0")}@${k === 2 ? '0' : '255'}:000`;
                    executecCMD(codeToSend, port);
                    //console.log('enviar: ', `A${i.toString().padStart(3, "0")}@${k === 2 ? '0' : '255'}:000`)
                });
            }
        });
        teamRed.map(item => {
            //console.log('position', item.name)
            if (item.canalesDMX && item.canalesDMX.length) {
                item.canalesDMX.map((i, k) => {
                    const codeToSend = `A${i.toString().padStart(3, "0")}@${k === 2 ? '0' : '255'}:000`;
                    executecCMD(codeToSend, port);
                    //console.log('enviar: ', `A${i.toString().padStart(3, "0")}@${k === 2 ? '0' : '255'}:000`)
                });
            }
        });
        /*}
    });*/

        return false;

    };

    const executecCMD = (code, port) => {
        
        port.write(code, function (err) {
            if (err) {
                alert(err.message);
                return console.log('Error on write: ', err.message)
            }
            console.log('message written')
        })

        // Open errors will be emitted as an error event
        port.on('error', function (err) {
            console.log('Error general: ', err.message)
            alert(err.message)
        })

        //console.log(`mode ${portid} BAUD=9600 PARITY=n DATA=8 STOP=1 xon=off octs=off rts=off`);
        //exec(`set /p x="${code}" <nul >\\\\.\\${portid}`);
    }

    useEffect(() => {
        const handleResize = () => {
            const widthLeft = refBoxLeft?.current?.offsetWidth;
            if (widthLeft) {
                const size = (widthLeft - 140) / 7;
                setSizeBtnPositions(size - 2);
            }
            const heightLogo = refLogo?.current.offsetHeight;
            const heightBtn = refBtn?.current.offsetHeight;
            const heightBoxes = refBoxLeft?.current.offsetHeight;
            if (heightBoxes && heightLogo && heightBtn) {
                const heightWindow = window?.innerHeight;
                if (heightWindow) {
                    const div = heightWindow - (heightBoxes + heightLogo + heightBtn);
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
                    //top: '50%',
                    //transform: 'translateY(-50%)',
                    //height: 'calc(100vh - 100px)'
                }}
            >
                <div className="container"
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
                            >

                                <div className="div-array" ref={refBoxLeft}>
                                    <label style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                    {listLetters.map((i, key) =>
                                        <div key={key}>
                                            {listNumbers.map((j, k) => {
                                                //port = port + 3;
                                                //count = count + 1;

                                                //console.log('port', port)
                                                return (
                                                    <button
                                                        className={`buttons-lists ${isActive(1, `${i}${j}`) ? 'button-active-b' : ''}`}
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
                                    width: '100%',
                                    //height: 'calc(100vh - 170px)',
                                }}
                            >
                                <div className="div-array">
                                    <label style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                    {listLetters.map((i, key) =>
                                        <div key={key}>
                                            {listNumbers.map((j, k) =>
                                                <button
                                                    className={`buttons-lists ${isActive(2, `${i}${j}`) ? 'button-active-r' : ''}`}
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
                            <img
                                onClick={start}
                                src={saveimage?.src}
                                style={{
                                    cursor: 'pointer'
                                }}
                            />

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