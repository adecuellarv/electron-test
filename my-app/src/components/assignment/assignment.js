const React = require('react');
const ReactDOM = require('react-dom/client');
const { exec } = require('child_process');
const { useEffect, useState } = require('react');

const Assignment = () => {
    const [teamBlue, setTeamBlue] = useState([]);
    const [teamRed, setTeamRed] = useState([]);

    const saveChoice = (team, row, column) => {
        if (team === 1) {
            const newArray = teamBlue;
            const position = newArray.findIndex(item => item.name === `${row}${column}`);

            if (position === -1) {
                const obj = {
                    row,
                    column,
                    name: `${row}${column}`
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
                    name: `${row}${column}`
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

    const saveBlue = () => {
        localStorage.setItem("teamBlue", teamBlue);
    };

    const saveRed = () => {
        localStorage.setItem("teamRed", teamRed);
    };

    const start = () => {
        const lteamBlue = localStorage.getItem("teamBlue");
        const lteamRead = localStorage.getItem("teamRed");
        if (lteamBlue && lteamBlue.length && lteamRead && lteamRead.length) {

        } else alert('Selecciona posiciones de equipos');
    }


    return (
        <>
            <div className="container">
                <div className="row">
                    <button
                        style={{
                            position: 'absolute',
                            top: 30
                        }}
                        onClick={start}
                    >Comiencen</button>
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1>Equipo azul</h1>
                            </div>
                            <div className="col-sm-6">
                                <button onClick={saveBlue}>Guardar</button>
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
                                <button onClick={saveRed}>Guardar</button>
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

if (document.getElementById('assignment')) {
    const root = ReactDOM.createRoot(document.getElementById('assignment'));
    root.render(<Assignment />);
}