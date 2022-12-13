const { useState } = require('react');
const React = require('react');
const ReactDOM = require('react-dom/client');
const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const bgimage = document.getElementById('bgimage_2');
const bgmenu = document.getElementById('bgmenu');
const btn_menu = document.getElementById('menu');
const btn_close = document.getElementById('btn_close');
const btn_closemenu = document.getElementById('btn_closemenu');
const btn_settings = document.getElementById('btn_settings');
const btn_back = document.getElementById('btn_back');
const bgpopup = document.getElementById('bgpopup');

const Menu = ({ setShowMenu, setPage }) => {
    const [menuType, setMenuType] = useState(1);
    const [time, setTime] = useState(480);

    const changePage = (number) => {
        setShowMenu(false);
        setPage(number);
    };

    const sendTime = () => {
        const value = time * 60;

        ipcRenderer.send('screen1:time', value);
        ipcRenderer.send('screen2:time', value);

        Swal.fire({
            icon: 'success',
            title: 'Tiempo cambiado',
            text: 'Con exito',
            timer: 900,
            showCancelButton: false,
            showConfirmButton: false
        })
    }

    const sendScreens = () => {
        ipcRenderer.send('main:createscreens', true);
        Swal.fire({
            icon: 'success',
            title: 'Envio de pantallas',
            text: 'Realizado con exito',
            timer: 900,
            showCancelButton: false,
            showConfirmButton: false
        })
    };

    const seTGame = () => {
        Swal.fire({
            title: 'Reiniciar',
            text: "¿Esta seguro que desea reiniciar el juego?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Reiniciar'
          }).then((result) => {
            if (result.isConfirmed) {
              
                localStorage.clear();
                ipcRenderer.send('screen1:teamRedFailed', []);
                ipcRenderer.send('screen1:teamRed', []);
                ipcRenderer.send('screen1:winner', '');
                ipcRenderer.send('screen1:startRamdomTeam', false);
                ipcRenderer.send('screen1:startGame', false);
                ipcRenderer.send('screen1:winRamdomTeam', '');
                ipcRenderer.send('screen2:teamRedFailed', []);
                ipcRenderer.send('screen2:teamRed', []);
                ipcRenderer.send('screen2:winner', '');
                ipcRenderer.send('screen2:startRamdomTeam', false);
                ipcRenderer.send('screen2:startGame', false);
                ipcRenderer.send('screen2:winRamdomTeam', '');
                cleanBoard();
                changePage(1)
            }
          })
        
    };

    const cleanBoard = async () => {
        const code = 'C';
        if (!port?.port) {
            port.write(`${code}\r`);
            console.log(`${code}\r`);
        }
    }

    return (
        <div className="background-menu"
            style={{
                background: `rgba(0, 0, 0, 0.90)`,
                top: 0,
                left: 0,
                height: '100vh',
                width: '100%',
                position: 'absolute',
                zIndex: 1
            }}
        >
            {menuType === 1 &&
                <div
                    style={{
                        position: 'relative',
                        backgroundImage: `url(${bgimage?.src})`,
                        backgroundPosition: '50% 50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: 600,
                        margin: '0px auto', 
                        top: 30,
                        borderRadius: 50,
                        padding: 50
                        //clipPath: 'polygon(10% 5%, 84% 4%, 100% 20%, 100% 80%, 84% 95%, 18% 96%, 0% 80%, 0% 20%)'
                    }}
                >
                    <img
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 50,
                            cursor: 'pointer'
                        }}
                        src={btn_closemenu?.src}
                        onClick={() => setShowMenu(false)}
                    />
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 30,
                            position: 'relative',
                            padding: 20

                        }}
                    >
                        <h1 className="machineFont">MENÚ</h1>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => changePage(2)}
                        >
                            <label className="machineFont">INSTRUCCIONES</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => changePage(3)}
                        >
                            <label className="machineFont">ASIGNAR COORDENADAS</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => changePage(4)}
                        >
                            <label className="machineFont">MONEDA AL AIRE</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => changePage(5)}
                        >
                            <label className="machineFont">JUEGO</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => setMenuType(2)}
                        >
                            <label className="machineFont">AYUDA</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => setMenuType(3)}
                        >
                            <label className="machineFont">CONFIGURACIÓN</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={seTGame}
                        >
                            <label className="machineFont">REINICIAR JUEGO</label>
                        </div>
                    </div>
                </div>
            }
            {menuType === 2 &&
                <div
                    style={{
                        position: 'relative',
                        backgroundImage: `url(${bgpopup?.src})`,
                        backgroundPosition: '50% 50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '70%',
                        margin: '0 auto',
                        top: 100,
                        borderRadius: 50,
                        padding: 50
                        //clipPath: 'polygon(10% 5%, 84% 4%, 100% 20%, 100% 80%, 84% 95%, 18% 96%, 0% 80%, 0% 20%)'
                    }}
                >
                    <img
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 50,
                            cursor: 'pointer'
                        }}
                        src={btn_closemenu?.src}
                        onClick={() => setMenuType(1)}
                    />
                    <div
                        style={{
                            //background: '#fff',
                            borderRadius: 30,
                            position: 'relative',
                            padding: 20

                        }}
                    >
                        <h1 className="machineFont">CONFIGURACIÓN DE PANTALLA</h1>

                        <div>
                            <h4 className="machineFont">MÉTODO 1</h4>
                        </div>
                        <p className="machineFont">
                            1.- Para alinear las pantallas en su lugar, encender los proyectores.
                        </p>
                        <p className="machineFont">
                            2.- Cerrar la aplicación.
                        </p>
                        <p className="machineFont">
                            1.- Abrir nuevamente la aplicación (una vez ya encendidos los proyectores se alinearán automaticamente)
                        </p>
                        <div>
                            <h4 className="machineFont">MÉTODO 2</h4>
                        </div>
                        <p className="machineFont">
                            1.- Arrastrar la pantalla del equipo azul desde la pantalla panel de control hasta el proyector 1 y soltar.
                        </p>
                        <p className="machineFont">
                            2.- Arrastrar la pantalla del equipo rojo desde la pantalla panel de control hasta el proyector 2 y soltar.
                        </p>
                    </div>

                </div>
            }
            {menuType === 3 &&
                <div
                    style={{
                        position: 'relative',
                        backgroundImage: `url(${bgimage?.src})`,
                        backgroundPosition: '50% 50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '40%',
                        margin: '0 auto',
                        top: 100,
                        borderRadius: 50,
                        padding: 50
                        //clipPath: 'polygon(10% 5%, 84% 4%, 100% 20%, 100% 80%, 84% 95%, 18% 96%, 0% 80%, 0% 20%)'
                    }}
                >
                    <img
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 50,
                            cursor: 'pointer'
                        }}
                        src={btn_closemenu?.src}
                        onClick={() => setMenuType(1)}
                    />
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 30,
                            position: 'relative',
                            padding: 20

                        }}
                    >
                        <h1 className="machineFont">CONFIGURACIÓN</h1>
                        <div>
                            <h4 className="machineFont">ALÍNEAR PANTALLAS</h4>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={sendScreens}
                        >
                            <label className="machineFont">ENVIAR PANTALLAS A PROYECTORES</label>
                        </div>
                        {true &&
                            <div>
                                <div style={{ paddingTop: 30 }}>
                                    <h4 className="machineFont">MINUTOS DEL JUEGO</h4>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <input
                                            className="form-control"
                                            onChange={(e) => setTime(e.target.value)}
                                            placeholder="8"
                                            type={"number"}
                                            min="1"
                                            pattern="^[0-9]+"
                                        //value="8"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <button
                                            class="btn btn-dark"
                                            onClick={sendTime}
                                        //style={{ float: 'right' }}
                                        >Guardar tiempo</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                </div>
            }
        </div>
    )
};

if (document.getElementById('menu')) {
    const root = ReactDOM.createRoot(document.getElementById('menu'));
    root.render(<Menu />);
}