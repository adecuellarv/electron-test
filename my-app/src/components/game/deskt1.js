const React = require('react');
const ReactDOM = require('react-dom/client');
const { exec } = require('child_process');
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const saveimage = document.getElementById('saveimage');
const Desk1 = () => {
    const [turnOF, setTurnOF] = useState(1);
    const [itemSelected, setItemSelected] = useState({});
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);

    const saveChoice = (team, row, column) => {
        if (itemSelected?.name === `${row}${column}`) {
            setItemSelected({});
        } else
            setItemSelected({
                team,
                row,
                column,
                name: `${row}${column}`
            })
    };

    const send = () => {
        const teamBlue = JSON.parse(localStorage.getItem('teamBlue'));
        const teamRed = JSON.parse(localStorage.getItem('teamRed'));
        if (itemSelected?.name) {
            if (turnOF === 1) {
                const position = teamRed.findIndex(item => item.name === itemSelected.name);
                if (position !== -1) {
                    console.log('1.- enviar señal a jorge');
                    console.log('2.- enviar video1 a pantalla equipo azul');
                    console.log('3.- actualizar pantalla de equipo azul');
                    console.log('4.- marcar rojo en pantalla principial (aquí)');
                } else {
                    console.log('2.- enviar video2 a pantalla equipo azul');
                    console.log('3.- actualizar pantalla de equipo azul');
                    console.log('4.- marcar blanco en pantalla principial (aquí)');
                }
                setTurnOF(2);
            } else {
                const position = teamBlue.findIndex(item => item.name === itemSelected.name);
                if (position !== -1) {
                    console.log('1.- enviar señal a jorge');
                    console.log('2.- enviar video1 a pantalla equipo rojo');
                    console.log('3.- actualizar pantalla de equipo rojo');
                    console.log('4.- marcar rojo en pantalla principial (aquí)');
                } else {
                    console.log('2.- enviar video2 a pantalla equipo rojo');
                    console.log('3.- actualizar pantalla de equipo rojo');
                    console.log('4.- marcar blanco en pantalla principial (aquí)');
                }
                setTurnOF(1);
            }
        } else {
            alert('Selecciona una posición');
        }
    };

    const isActive = (team, name) => {
        return false;
        /*
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
        }*/
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
            if (heightBoxes && heightLogo) {
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
                        >
                            <div className="div-array" ref={refBoxLeft}>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                    </div>
                                    <div className="col-sm-6">
                                        <button
                                            disabled={turnOF === 1}
                                            onClick={send}
                                        >Enviar</button>
                                    </div>
                                </div>
                                {listLetters.map((i, key) =>
                                    <div key={key}>
                                        {listNumbers.map((j, k) =>
                                            <button
                                                className={`buttons-lists ${isActive(1, `${i}${j}`) ? 'button-active-b' : ''}`}
                                                style={{
                                                    width: sizeBtnPositions,
                                                    height: sizeBtnPositions,
                                                    fontSize: sizeBtnPositions / 3
                                                }}
                                                key={k}
                                                onClick={() => saveChoice(1, i, j)}
                                                disabled={turnOF === 1}
                                            >
                                                {`${i}${j}`}
                                            </button>
                                        )}
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
                                    <div className="col-sm-6">
                                        <label style={{ color: '#ff0000', fontSize: 22, marginBottom: 10 }}>Equipo rojo</label>
                                    </div>
                                    <div className="col-sm-6">
                                        <button
                                            disabled={turnOF === 2}
                                            onClick={send}
                                        >Enviar</button>
                                    </div>
                                </div>
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
                                                onClick={() => saveChoice(2, i, j)}
                                                disabled={turnOF === 2}
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