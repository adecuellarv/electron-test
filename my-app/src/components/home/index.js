const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort } = require('serialport')
const { useState, useEffect } = require('react');
const audio = document.getElementById('audio');

let port;
const Index = () => {
    const [page, setPage] = useState(1);
    const [teamWinner, setTeamWinner] = useState('');
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        ipcRenderer.on('main:endgame', (e, endgame) => {
            setPage(6);
        });
    }, []);

    useEffect(() => {
        port = new SerialPort({
            path: 'COM1',
            baudRate: 115200,
            databits: 8,
            parity: 'none',
            stopbits: 1,
            flowControl: false
        });

    }, []);

    const startGame = async () => {
        executecCMD('C');
        localStorage.clear();
        setPage(2);
        const totalLoadersBlue = await boardBlue(true);
        if (totalLoadersBlue === 49) {
            await boardRed(true);
            //const totalLoadersRed = await boardRed(true);
            //if (totalLoadersRed) setPage(2);
        }
    };

    const getDMXCode = (team, row, column, rowNum, columnNum) => {
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
        //console.log(team, row, column, rowNum, columnNum, 'canales: ' + canalesDMX)
        return canalesDMX;
    }

    const boardBlue = async (on) => {
        let rowNum = 0, totalElements = 0;
        for (const lettle of listLetters) {
            let columnNum = 0;
            for (const number of listNumbers) {
                const dmxList = getDMXCode(1, lettle, number, rowNum, columnNum);
                let countDmx = 0;
                for (const dmx of dmxList) {
                    const codeToSend = `A${dmx.toString().padStart(3, "0")}@${countDmx === 1 ? '128' : '000'}:000`;
                    await executecCMD(codeToSend);
                    countDmx++;
                }
                columnNum++;
                totalElements++;
            }
            rowNum++;
        }
        return totalElements;
    };

    const boardRed = async () => {
        let rowNum = 0, totalElements = 0;
        for (const lettle of listLetters) {
            let columnNum = 0;
            for (const number of listNumbers) {
                const dmxList = getDMXCode(2, lettle, number, rowNum, columnNum);
                let countDmx = 0;
                for (const dmx of dmxList) {
                    const codeToSend = `A${dmx.toString().padStart(3, "0")}@${countDmx === 1 ? '128' : '000'}:000`;
                    await executecCMD(codeToSend);
                    countDmx++;
                }
                columnNum++;
                totalElements++;
            }
            rowNum++;
        }
        return totalElements;
    };

    const executecCMD = async (code) => {
        await wait(100)
        if (!port?.port) {
            port.write(`${code}\r`);
            console.log(`${code}\r`);
        }
        return true;
    };

    const wait = ms => new Promise((r, j) => setTimeout(r, ms))

    return (
        <>
            {page === 1 &&
                <Home
                    startGame={startGame}
                />
            }
            {page === 2 &&
                <Instructions
                    setPage={setPage}
                />
            }
            {page === 3 &&
                <Assignment
                    port={port}
                    setPage={setPage}
                />
            }
            {page === 4 &&
                <RamdomTeam
                    setPage={setPage}
                />
            }
            {page === 5 &&
                <Desk1
                    port={port}
                    setPage={setPage}
                    setTeamWinner={setTeamWinner}
                />
            }
            {page === 6 &&
                <Results
                    setPage={setPage}
                    teamWinner={teamWinner}
                />
            }

            <LateralMenu
                setShowMenu={setShowMenu}
            />

            {showMenu &&
                <Menu
                    setShowMenu={setShowMenu}
                    setPage={setPage}
                />
            }

            <audio
                autoPlay={true}
                controls={false}
                loop={true}
                src={audio?.src}
            >
                <source src={audio.src} type="audio/mp3" />
            </audio>

        </>
    )
};


if (document.getElementById('home')) {
    const root = ReactDOM.createRoot(document.getElementById('home'));
    root.render(<Index />);
}