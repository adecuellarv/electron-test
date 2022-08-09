const React = require('react');
const ReactDOM = require('react-dom/client');
const { exec } = require('child_process');
const { useState } = require('react');

const Desk1 = () => {
    const [turnOF, setTurnOF] = useState(1);
    const [itemSelected, setItemSelected] = useState({});

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

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1>Equipo azul</h1>
                            </div>
                            <div className="col-sm-6">
                                <button
                                    disabled={turnOF === 1}
                                    onClick={send}
                                >Enviar</button>
                            </div>
                        </div>
                        <div className="div-array">
                            {listLetters.map((i, key) =>
                                <div key={key}>
                                    {listNumbers.map((j, k) =>
                                        <button
                                            className={`buttons-lists ${isActive(1, `${i}${j}`) ? 'button-active-b' : ''}`}
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
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1>Equipo rojo</h1>
                            </div>
                            <div className="col-sm-6">
                                <button
                                    disabled={turnOF === 2}
                                    onClick={send}
                                >Enviar</button>
                            </div>
                        </div>
                        <div className="div-array">
                            {listLetters.map((i, key) =>
                                <div key={key}>
                                    {listNumbers.map((j, k) =>
                                        <button
                                            className={`buttons-lists ${isActive(2, `${i}${j}`) ? 'button-active-r' : ''}`}
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
            </div>
        </>
    )
};

if (document.getElementById('game-deskt1')) {
    const root = ReactDOM.createRoot(document.getElementById('game-deskt1'));
    root.render(<Desk1 />);
}