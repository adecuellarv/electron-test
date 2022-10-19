const { useState } = require('react');
const React = require('react');
const ReactDOM = require('react-dom/client');
const bgimage = document.getElementById('bgimage_2');
const bgmenu = document.getElementById('bgmenu');
const btn_menu = document.getElementById('menu');
const btn_close = document.getElementById('btn_close');
const btn_closemenu = document.getElementById('btn_closemenu');
const btn_settings = document.getElementById('btn_settings');
const btn_back = document.getElementById('btn_back');
const bginstructions = document.getElementById('bginstructions');

const Menu = ({ setShowMenu, setPage }) => {
    const [menuType, setMenuType] = useState(1);
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
                            onClick={() => setPage(1)}
                        >
                            <label className="machineFont">INICIO</label>
                        </div>
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            onClick={() => setPage(2)}
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
                            onClick={() => setPage(3)}
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
                            <label className="machineFont">INTRUCCIONES</label>
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
                    </div>

                </div>
            }
            {menuType === 2 &&
                <div
                    style={{
                        position: 'relative',
                        backgroundImage: `url(${bginstructions?.src})`,
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
                            <h4>MÉTODO 1</h4>
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
                            <h4>MÉTODO 2</h4>
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
                        <div
                            style={{
                                border: '2px solid #000',
                                padding: 10,
                                marginTop: 10,
                                cursor: 'pointer'
                            }}
                            //onClick={() => setPage(1)}
                        >
                            <label className="machineFont">ENVIAR PANTALLAS A PROYECTORES</label>
                        </div>
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