const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport')
const { useState, useEffect } = require('react');

let port;
const Index = () => {
    const [page, setPage] = useState(3);
    const [teamWinner, setTeamWinner] = useState('');

    useEffect(() => {
        port = new SerialPort({
            path: 'COM1',
            baudRate: 115200,
            databits: 8,
            parity: 'none',
            stopbits: 1,
            flowControl: false
        });
        //localStorage.clear();
    }, []);

    const startGame = async () => {
        const totalLoadersBlue = await boardBlue(true);
        if (totalLoadersBlue === 49) {
            const totalLoadersRed = await boardRed(true);
            if (totalLoadersRed) setPage(2);
        }
    };

    const boardBlue = async (on) => {
        let totalElements = 0;
        listLetters.map((i, rowNum) => {
            listNumbers.map((j, columnNum) => {
                const filaNum = rowNum + 1, position = columnNum + 1;
                //console.log('name', `${i}${j}`)
                let countCode = 0;
                if (filaNum >= 1 && filaNum <= 6) {
                    let startIn = 1;
                    if (filaNum > 1) {
                        startIn = (filaNum - 1) * 21 + 1;
                    }

                    const topByPosition = position * 3 + startIn;
                    const startByPostion = topByPosition - 3;
                    for (let index = startByPostion; index < topByPosition; index++) {
                        const element = index;
                        const codeToSend = `A${element.toString().padStart(3, "0")}@${countCode === 1 ? '128' : '0'}:000`;
                        countCode++;
                        console.log('codes-team1', codeToSend);
                        //executecCMD(codeToSend);
                    }
                }
                totalElements++;
            });
        })
        return totalElements;
    };

    const boardRed = async () => {
        let totalElements = 0;
        listLetters.map((i, rowNum) => {
            listNumbers.map((j, columnNum) => {
                const filaNum = rowNum + 1, position = columnNum + 1;
                //console.log('name', `${i}${j}`)
                let countCode = 0;
                if (filaNum >= 2 && filaNum <= 7) {
                    let startIn = 162;
                    if (filaNum > 1) {
                        startIn = (filaNum - 1) * 21 + 162;
                    }

                    const topByPosition = position * 3 + startIn;
                    const startByPostion = topByPosition - 3;
                    for (let index = startByPostion; index < topByPosition; index++) {
                        const element = index;
                        const codeToSend = `A${element.toString().padStart(3, "0")}@${countCode === 1 ? '128' : '0'}:000`;
                        countCode++;
                        console.log('codes-team2', codeToSend);
                        //executecCMD(codeToSend);
                    }
                }

                totalElements++;
            });
        })
        return totalElements;
    };

    const executecCMD = async (code) => {
        port.write(`${code}\r`);
        console.log(`${code}\r`);
        return true;
    }

    return (
        <>
            {page === 1 &&
                <Home
                    startGame={startGame}
                />
            }
            {page === 2 &&
                <Assignment
                    port={port}
                    setPage={setPage}
                />
            }
            {page === 3 &&
                <Desk1
                    port={port}
                    setPage={setPage}
                    setTeamWinner={setTeamWinner}
                />
            }
            {page === 4 &&
                <Results
                    setPage={setPage}
                    teamWinner={teamWinner}
                />
            }
        </>
    )
};


if (document.getElementById('home')) {
    const root = ReactDOM.createRoot(document.getElementById('home'));
    root.render(<Index />);
}