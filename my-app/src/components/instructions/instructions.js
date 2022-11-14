const React = require('react');
const ReactDOM = require('react-dom/client');
const pop_inst = document.getElementById('pop_inst');

const Instructions = ({ setPage }) => {
    return (
        <div className="home-container"
            style={{
                backgroundImage: `url(${pop_inst?.src})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                //height: 200
            }}
            onClick={() => setPage(3)}
        >

        </div>
    )
};