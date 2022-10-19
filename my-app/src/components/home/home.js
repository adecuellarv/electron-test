const React = require('react');
const ReactDOM = require('react-dom/client');
const bgimage = document.getElementById('bgimage');
const boxcenter = document.getElementById('boxcenter');
const buttonstart = document.getElementById('buttonstart');

const Home = ({ startGame }) => {
    return (
        <div className="home-container"
            style={{
                backgroundImage: `linear-gradient(45deg,rgba(0, 0, 0, 0.30),rgba(0, 0, 0, 0.30) ), url(${bgimage?.src})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
            }}
        >
            <div
                style={{
                    backgroundImage: `url(${boxcenter?.src})`,
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                    width: '50%',
                    margin: '0 auto',
                    height: '50%',
                    top: '50%',
                    transform: 'translateY(-50%)'
                    //
                    //height: 'calc(100vh - 100px)',
                    //paddingTop: 100
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '25%',
                        left: '37.5%',
                        //margin: '0 auto',
                        bottom: '-20%'
                    }}
                >

                    <img src={buttonstart?.src}
                        style={{
                            width: '100%'
                        }}
                        onClick={startGame}
                    />

                </div>
            </div>
        </div>
    )
};