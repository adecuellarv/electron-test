const React = require('react');
const ReactDOM = require('react-dom/client');
const { SerialPort, ReadlineParser } = require('serialport');
const { exec } = require('child_process');
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

    const sendData = () => {
        const portid = "COM1";
        exec(`mode ${portid} BAUD=115200 PARITY=n DATA=8 STOP=1 xon=off octs=off rts=on`, (error, stdout, stderr) => {
            //exec(`start`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              alert('error al enviar info');
              return;
            } else {
              //exec(`set /p x="A001@255:000" <nul >\\\\.\\${portid}`);
              exec(`set /p x="A001@255:000" <nul >\\\\.\\${portid}`);
            }
          });
    };

    useEffect(() => {
        
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