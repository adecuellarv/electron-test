const React = require('react');
const ReactDOM = require('react-dom/client');
const { ipcRenderer } = require('electron');
const { useState, useRef, useEffect } = require('react');

const bgimage = document.getElementById('bgimage');
const logo = document.getElementById('logo');
const boxleft = document.getElementById('boxleft');
const boxright = document.getElementById('boxright');
const barras1 = document.getElementById('barras1');
const barras2 = document.getElementById('barras2');
const barras3 = document.getElementById('barras3');
const circles1 = document.getElementById('circles');
const circles2 = document.getElementById('circles2');

const mainvideo = document.getElementById('mainvideo');

const small_error = document.getElementById('small_error');
const small_success1 = document.getElementById('small_success1');

const medium_error = document.getElementById('medium_error');
const medium_success1 = document.getElementById('medium_success1');
const medium_success2 = document.getElementById('medium_success2');

const large_error = document.getElementById('large_error');
const large_success1 = document.getElementById('large_success1');
const large_success2 = document.getElementById('large_success2');
const large_success3 = document.getElementById('large_success3');


let delayResend = 480, seconds; //5min
//let success = false, error = false;

ipcRenderer.on('screen2:time', (e, time) => {
    //delayResend = time;
});
const ScreenRed = () => {
    const videoRef = useRef(null);
    const [sizeBtnPositions, setSizeBtnPositions] = useState(50);
    const [paddingTopContent, setPaddingTopContent] = useState(0);
    const [itemsKilled, setItemsKilled] = useState([]);
    const [itemsFailed, setItemsFailed] = useState([]);
    const [videoToShow, setVideoToShow] = useState(mainvideo?.getAttribute('src'));
    const [seconds, setSeconds] = useState(delayResend);
    //const [delay, setDelay] = useState(+delayResend);
    //const minutes = Math.floor(delay / 60);
    //const seconds = Math.floor(delay % 60);
    const refBoxLeft = useRef(null);
    const refLogo = useRef(null);
    const refBoxParentLeft = useRef(null);

    const getColorBtn = (team, row, column) => {
        if (itemsKilled.length) {
            const position = itemsKilled.findIndex(item => item.name === `${row}${column}`);
            if (position !== -1) {
                return 'point-red';
            }
        }
        if (itemsFailed.length) {
            const position = itemsFailed.findIndex(item => item.name === `${row}${column}`);
            if (position !== -1) {
                return 'point-white';
            }
        }
    };

    const getVideoSuccess = (info) => {

        const { totalItems, teamBlue, boatNumber } = info;

        if (teamBlue.length) {
            const listElementsByBoat = teamBlue.filter(i => i.boatNumber === boatNumber && i.killed === "true");
            const restKillers = totalItems - listElementsByBoat.length;
            //console.log('totalItems', totalItems, 'restKillers', restKillers, 'listElementsByBoat', listElementsByBoat)
            switch (totalItems) {
                case 1:
                    return small_success1.getAttribute('src');
                case 2:
                    if (restKillers === 0) {
                        return medium_success2.getAttribute('src');
                    } else if (restKillers === 1) {
                        return medium_success1.getAttribute('src');
                    }
                case 3:
                    if (restKillers === 0) {
                        return large_success3.getAttribute('src');
                    } else if (restKillers === 1) {
                        return large_success2.getAttribute('src');
                    } else if (restKillers === 2) {
                        return large_success1.getAttribute('src');
                    }
                default:
                    break;
            }

        }
    };

    ipcRenderer.on('screen2:teamRed', (e, teamRed) => {
        const killeds = teamRed.filter(i => i.killed === 'true');
        setItemsKilled(killeds);
    });

    ipcRenderer.on('screen2:teamRedFailed', (e, teamRedFailed) => {
        const faileds = teamRedFailed.filter(i => i.failed === 'true');
        setItemsFailed(faileds);
    });

    ipcRenderer.on('screen2:error', (e, status) => {
        setVideoToShow(large_error?.getAttribute('src'));
        videoRef.current?.load();
        setTimeout(() => {
            setVideoToShow(mainvideo?.getAttribute('src'));
            videoRef.current?.load();
        }, 5000);
    });

    ipcRenderer.on('screen2:success', (e, info) => {
        //console.log('entro-success');
        console.log(getVideoSuccess(info));
        const videoSrc = getVideoSuccess(info);

        setVideoToShow(videoSrc);
        videoRef.current?.load();
        setTimeout(() => {
            setVideoToShow(mainvideo?.getAttribute('src'));
            videoRef.current?.load();
        }, 5000);
    });


    useEffect(() => {
        const handleResize = () => {
            const widthLeft = refBoxLeft?.current?.offsetWidth;
            if (widthLeft) {
                const size = (widthLeft - 140) / 8;
                setSizeBtnPositions(size - 2);
            }
            const heightLogo = refLogo?.current.offsetHeight;
            const heightBoxes = refBoxLeft?.current.offsetHeight;
            if (heightBoxes && heightLogo) {
                const heightWindow = window?.innerHeight;
                if (heightWindow) {
                    const div = heightWindow - (heightBoxes + heightLogo);
                    if (div > 0) {
                        setPaddingTopContent(heightWindow < 800 ? (div / 2) - 40 : (div / 2));
                    }
                }
            }

        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /*
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);*/
    
    useEffect(() => {

        const timer = setInterval(() => {
            setSeconds(seconds - 1);
        }, 1000);

        if (seconds === 0) {
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer);
        };
    });


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
                    transform: 'scale(.84)'
                }}
            >
                <div
                    className="container"
                    style={{
                        //paddingTop: paddingTopContent
                    }}
                >
                    <div className="row">
                        <div
                            className="col-sm-12"
                            style={{
                                textAlign: 'center',
                                //marginTop: 30,
                            }}
                            ref={refLogo}
                        >
                            <img
                                src={logo?.src}
                                style={{
                                    width: '20%',
                                }}
                            />
                        </div>
                        <div className="col-sm-6" style={{ marginTop: -30 }}>
                            <div
                                style={{
                                    backgroundImage: `url(${boxleft?.src})`,
                                    backgroundPosition: '50% 50%',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'relative',
                                    width: '100%',
                                    //height: 'calc(100vh - 170px)',
                                }}
                                ref={refBoxParentLeft}
                            >
                                <div className="div-array" ref={refBoxLeft}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label className="machineFont" style={{ color: '#1975cb', fontSize: 22, marginBottom: 10 }}>Equipo azul</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-1"
                                            style={{
                                                marginTop: sizeBtnPositions
                                            }}
                                        >
                                            {listLetters.map((i, key) =>
                                                <div
                                                    key={key}
                                                    style={{
                                                        paddingRight: 10,
                                                        width: sizeBtnPositions,
                                                        height: sizeBtnPositions + 7,
                                                    }}
                                                >
                                                    <label
                                                        style={{


                                                            textAlign: 'center',
                                                            color: '#fff'
                                                        }}
                                                    >{i}</label>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-11">

                                            {listNumbers.map((j, k) =>
                                                <label
                                                    key={k}
                                                    className="machineFont"
                                                    style={{
                                                        width: sizeBtnPositions,
                                                        height: sizeBtnPositions,
                                                        textAlign: 'center',
                                                        color: '#fff'
                                                    }}
                                                >{j}</label>
                                            )}

                                            {listLetters.map((i, key) =>
                                                <div key={key}>
                                                    {listNumbers.map((j, k) =>
                                                        <div
                                                            className={
                                                                `box-lists machineFont`}
                                                            style={{
                                                                width: sizeBtnPositions,
                                                                height: sizeBtnPositions,
                                                            }}
                                                            key={k}

                                                        >
                                                            <div
                                                                className={getColorBtn(2, i, j)}
                                                                style={{
                                                                    marginTop: sizeBtnPositions - 38
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6" style={{ marginTop: -30 }}>
                            <div
                                style={{
                                    backgroundImage: `url(${boxright?.src})`,
                                    backgroundPosition: '50% 50%',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        width: refBoxLeft?.current?.offsetWidth,
                                        height: refBoxLeft?.current?.offsetHeight - 10,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 70
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <img
                                                src={barras3?.src}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <img
                                                src={circles1?.src}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-12">
                                            <div
                                                style={{
                                                    position: 'relative'
                                                }}
                                            >
                                                <video
                                                    controls={false}
                                                    autoPlay={true}
                                                    loop={true}
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                    ref={videoRef}
                                                >
                                                    <source src={videoToShow} />
                                                </video>
                                                {seconds <= 20 &&
                                                    < div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            textAlign: 'center',
                                                            width: '100%',
                                                            top: 130,
                                                            color: '#fff'
                                                        }}
                                                    >
                                                        <h1
                                                            className='machineFont'
                                                            style={{ fontSize: 60 }}
                                                        >{Math.floor(seconds % 60)} SEG</h1>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <img
                                                src={barras1?.src}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-4">
                                            <img
                                                src={barras2?.src}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </div>
                                        <div className="col-sm-4">
                                            <img
                                                src={circles2?.src}
                                                style={{
                                                    width: '100%',
                                                    marginTop: -30,
                                                    position: 'relative',
                                                    zIndex: 1
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
};

if (document.getElementById('screen-red')) {
    const root = ReactDOM.createRoot(document.getElementById('screen-red'));
    root.render(<ScreenRed />);
}