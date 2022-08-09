const React = require('react');
const ReactDOM = require('react-dom');
const { exec } = require('child_process');

const Home = () => {
    const test = () => {
        //exec('start chrome');
        //alert('amonos');
    };

    return (
        <>
            <h1>Home</h1>

            <a href="assignment.html">Comenzar</a>
        </>
    )
};

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}