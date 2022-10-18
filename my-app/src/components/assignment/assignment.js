const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort, ReadlineParser } = require('serialport')
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const saveimage = document.getElementById('saveimage');

const Assignment = ({ port, setPage }) => {
    const [teamBlue, setTeamBlue] = useState([]);
    const [teamRed, setTeamRed] = useState([]);
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [boatNumberBlue, setBoatNumberBlue] = useState(1);
    const [boatNumberRed, setBoatNumberRed] = useState(1);
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);

    const saveByBoatBlue = () => { 
        setBoatNumberBlue(parseInt(boatNumberBlue) + 1);
    };

    const saveByBoatRed = () => {
        setBoatNumberRed(parseInt(boatNumberRed) + 1);
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
                const filtered = newArray.filter(function(i, index, arr){ 
                    return i.boatNumber !== boatNumber;
                });
                
                newArray = filtered;
            }
            

            setTeamBlue([...newArray]);
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
                const filtered = newArray.filter(function(i, index, arr){ 
                    return i.boatNumber !== boatNumber;
                });
                
                newArray = filtered;
            }

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

    const start = async () => {
        if (teamBlue.length && teamRed.length) {
            if (teamBlue.length <= 8 && teamRed.length <= 8) {
                //if (teamBlue.length === teamRed.length) {
                localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
                localStorage.setItem("teamRed", JSON.stringify(teamRed));
                const resp = await sendCommands();
                if (resp) {
                    //window.location.href = "game-deskt1.html";
                    setPage(3);
                }
            } else {
                alert('El máximo de jugadores es 8');
            }
        } else alert('Selecciona posiciones de equipos');
    }

    const sendCommands = () => {

        if (!port?.port) {
            const bothArrays = teamBlue.concat(teamRed);

            bothArrays.map(item => {
                if (item.canalesDMX.length) {
                    item.canalesDMX.map((i, k) => {
                        const codeToSend = `A${i.toString().padStart(3, "0")}@${k === 2 ? '255' : '0'}:000`;
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
        localStorage.clear();
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
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label className="machineFont" style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                        </div>
                                        <div
                                            className="col-sm-8"
                                            style={{ textAlign: 'right', marginBottom: 10 }}
                                        >
                                            <button
                                                className="machineFont"
                                                onClick={saveByBoatBlue}
                                                style={{
                                                    marginRight: 15,
                                                    border: 0,
                                                    padding: '5px 25px',
                                                    fontSize: 22
                                                }}
                                            >Guardar barco</button>
                                        </div>
                                    </div>
                                    {listLetters.map((i, key) =>
                                        <div key={key}>
                                            {listNumbers.map((j, k) => {
                                                //port = port + 3;
                                                //count = count + 1;

                                                //console.log('port', port)
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
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label className="machineFont" style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                        </div>
                                        <div
                                            className="col-sm-8"
                                            style={{ textAlign: 'right', marginBottom: 10 }}
                                        >
                                            <button
                                                className="machineFont"
                                                onClick={saveByBoatRed}
                                                style={{
                                                    marginRight: 15,
                                                    border: 0,
                                                    padding: '5px 25px',
                                                    fontSize: 22
                                                }}
                                            >Guardar barco</button>
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