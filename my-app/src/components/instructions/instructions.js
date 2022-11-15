const React = require('react');
const { useState, useRef, useEffect } = require('react');
const ReactDOM = require('react-dom/client');
const bgimage = document.getElementById('bgimage_2');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const bgpopup = document.getElementById('bgpopup');
const acorazado = document.getElementById('acorazado');
const fragata = document.getElementById('fragata');
const portaviones = document.getElementById('portaviones');
const btnstart = document.getElementById('btnstart');

const Instructions = ({ setPage }) => {
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBtn = useRef(null);
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
                style={{
                    transform: 'scale(.90)',
                }}
            >
                <div className="row">
                    <div className="col-sm-12">
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={logo?.src}
                                style={{
                                    width: 200,
                                    height: 50
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div
                            style={{
                                backgroundImage: `url(${boxleft?.src})`,
                                backgroundPosition: '50% 50%',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                                width: '100%',
                                height: 600
                            }}
                        >

                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div
                            style={{
                                backgroundImage: `url(${boxright?.src})`,
                                backgroundPosition: '50% 50%',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                position: 'relative',
                                width: '100%',
                                height: 600
                            }}
                        >

                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div
                            style={{
                                //transform: 'scale(.98)',
                            }}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${bgpopup?.src})`,
                                    backgroundPosition: '50% 50%',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'absolute',
                                    width: '100%',
                                    height: 600,
                                    //top: -600
                                    top: 50
                                }}
                            >

                                <div className='row'>
                                    <div className="col-sm-6" style={{
                                        paddingTop: 70,
                                        paddingLeft: 200,
                                    }}>
                                        <h1 className="machineFont">Intrucciones</h1>
                                        <div>
                                            <p className="machineFont" style={{ fontSize: 18 }}><strong>1.- </strong>
                                                Formar equipos Rojo y azul
                                            </p>
                                            <p className="machineFont" style={{ fontSize: 18 }}><strong>2.- </strong>
                                                Formar embarcaciones de 3, 2 o 1 jugadores según la cantidad de participantes en cada equipo, empezar por las de 3 y 2 y al final si sobran jugadores individuales (máximo 8 jugadores por equipo).
                                            </p>
                                            <p className="machineFont" style={{ fontSize: 18 }}><strong>3.- </strong>
                                                Elegir cada equipo o jugador sus coordenadas colocandose en el tablero real, si son embarcación deberán colocarse juntos para crear su tipo de barco ya sea en posición vertical u horizontal.
                                            </p>
                                            <p className="machineFont" style={{ fontSize: 18 }}><strong>4.- </strong>
                                                Operador naval guardar las posiciones de cada equipo en el panel de control.
                                            </p>
                                            <p className="machineFont" style={{ fontSize: 18 }}><strong>5.- </strong>
                                                Comienza la Batalla Naval.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6" style={{
                                        paddingTop: 70,
                                        paddingRight: 200,
                                        textAlign: 'center'
                                    }}>
                                        <img
                                            src={portaviones?.src}
                                            style={{
                                                width: '60%',
                                                margin: '0 auto',
                                                display: 'inline-block'
                                            }}
                                        />
                                        <img
                                            src={acorazado?.src}
                                            style={{
                                                width: '60%',
                                                margin: '0 auto',
                                                display: 'inline-block',
                                                paddingTop: 30
                                            }}
                                        />
                                        <img
                                            src={fragata?.src}
                                            style={{
                                                width: '60%',
                                                margin: '0 auto',
                                                display: 'inline-block',
                                                paddingTop: 30
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-sm-12"
                        style={{
                            textAlign: 'center',
                        }}
                        ref={refBtn}
                    >
                        <img
                            src={btnstart?.src}
                            style={{
                                width: 200
                            }}
                            onClick={() => setPage(3)}
                        ></img>
                    </div>
                </div>
            </div>
        </div>
    )
};