const React = require('react');
const ReactDOM = require('react-dom/client');
const { exec } = require('child_process');
const { useState } = require('react');

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

    const start = () => {

        if (teamBlue.length && teamRed.length) {
            if (teamBlue.length <= 8 && teamRed.length <= 8) {
                if (teamBlue.length === teamRed.length) {
                    localStorage.setItem("teamBlue", JSON.stringify(teamBlue));
                    localStorage.setItem("teamRed", JSON.stringify(teamRed));
                    
                } else {
                    alert('Asegurate que la cantidad de jugadores sea la misma para ambos equipos');
                }
            } else {
                alert('El máximo de jugadores es 8');
            }
        } else alert('Selecciona posiciones de equipos');
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <button
                            style={{
                                textAlign: 'center'
                            }}
                            onClick={start}
                        >Comiencen</button>
                    </div>
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <h1>Equipo azul</h1>
                            </div>
                            <div className="col-sm-6">

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