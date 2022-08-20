const React = require('react');
const ReactDOM = require('react-dom/client');
//const bg  = require("./img/bg.png");
//import * as bg from './img/bg.png';
//const { exec } = require('child_process');
const bgimage = document.getElementById('bgimage');
const boxcenter = document.getElementById('boxcenter');
const buttonstart = document.getElementById('buttonstart');
const Home = () => {
    const height = window.innerHeight;
    const test = () => {
        //exec('start chrome');
        //alert('amonos');
    };
    console.log('height', height)
    return (
        <div className="home-container"
            style={{
                backgroundImage: `linear-gradient(45deg,rgba(0, 0, 0, 0.30),rgba(0, 0, 0, 0.30) ), url(${bgimage?.src})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'contain',
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
                    height: 'calc(100vh - 100px)',
                    paddingTop: 100
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '20%',
                        left: '40%',
                        //margin: '0 auto',
                        bottom: '0px'
                    }}
                >
                    <a href="assignment.html">
                        <img src={buttonstart?.src}
                            style={{
                                width: '100%'
                            }}
                        />
                    </a>
                </div>
            </div>

        </div>
    )
};


if (document.getElementById('home')) {
    const root = ReactDOM.createRoot(document.getElementById('home'));
    root.render(<Home />);
}