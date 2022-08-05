const React = require('react');
const ReactDOM = require('react-dom');
const { exec } = require('child_process');

const Home = () => {
    const test = () => {
        exec('start chrome');
    };

    return (
        <>
            <h1>Home</h1>

            <button onClick={test}>Click me</button>
        </>
    )
};

//export default Home;

if (document.getElementById('home')) {
    ReactDOM.render(<Home />, document.getElementById('home'));
}