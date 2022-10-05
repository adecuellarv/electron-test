const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort, ReadlineParser } = require('serialport')
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const saveimage = document.getElementById('saveimage');

let port;
const Assignment = () => {
    const [teamBlue, setTeamBlue] = useState([]);
    const [teamRed, setTeamRed] = useState([]);
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [retorno, setRetorno] = useState('\r');
    const [datoSend, setDatoSend] = useState('A001@255:000');
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);


    const sendCommands = async () => {

        const port = new SerialPort({
            path: 'COM1',
            baudRate: 9600,
            databits: 8,
            parity: 'even',
            stopbits: 1,
            flowControl: false,
            //autoOpen: false
        });

        let totalItems = 0, totalSuccess = 0;

        const bothArrays = teamBlue.concat(teamRed);

        const respGroupOne = await
            new Promise(async function (resolve, reject) {
                await bothArrays.map(async item => {
                    if (item.canalesDMX.length && item.canalesDMX.length) {
                        await item.canalesDMX.map(async (i, k) => {
                            totalItems = totalItems + 1;
                            const codeToSend = `A${i.toString().padStart(3, "0")}@${k === 2 ? '0' : '255'}:000`;
                            //console.log('enviando...', codeToSend);
                            const resp = await new Promise(async function (resolve, reject) {
                                const subresp = await executecCMD(codeToSend, port);
                                resolve(subresp);
                            })
                            if (resp) totalSuccess = totalSuccess + 1;

                            resolve(true);
                        });
                    }
                })
            });

        if (respGroupOne) {
            if (totalItems === totalSuccess) {
                port.close();
                return true;
            } else {
                //alert('Error al enviar datos');
                port.close();
                return false;
            }
        }
    };

    const executecCMD = async (code, port) => {

        const resp = await new Promise(async function (resolve, reject) {
            console.log('sending...', code)
            port.write(code);
            console.log('retorno...', '0x0D')
            //port.write('\r');
            port.write('0x0D');
            console.log('fin');
            resolve(false);

            /*
            await port.write(code);
            const parser = await port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
            await parser.on('data', function(data) {
                console.log('data_info', data);
            });
            resolve(false);*/
            /*
            port.write(code, function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message)
                }
                resolve(true);
            });
            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
            parser.on('data', function(data) {
                console.log('data_info', data);
            });

            port.on('error', function (err) {
                console.log(err);
                resolve(false);
                //grabar error en el log///
                //console.log('Error general: ', err.message)
            });*/
        });

        return resp;
    }

    
    useEffect(() => {
        port = new SerialPort({
            path: 'COM1',
            baudRate: 115200,
            databits: 8,
            parity: 'none',
            stopbits: 1,
            flowControl: false,

            //autoOpen: false
        });
    }, []);

    const sendData = () => {
        port.write("A001@255:000\r")
        console.log(port);
    };



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
            <div className="mb-3">
                <label className="form-label">Retorno de carro</label>
                <input
                    onChange={(e) => setRetorno(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="/r" 
                    disabled
                    />
                <label className="form-label">Comando</label>
                <input
                    onChange={(e) => setDatoSend(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="A001@255:000"
                    disabled />

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={sendData}>Enviar dato</button>
            </div>
        </div>
    )
};

if (document.getElementById('assignment')) {
    const root = ReactDOM.createRoot(document.getElementById('assignment'));
    root.render(<Assignment />);
}