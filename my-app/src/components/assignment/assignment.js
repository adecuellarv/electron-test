const React = require('react');
const ReactDOM = require('react-dom');
const { exec } = require('child_process');

const Assignment = () => {

    return (
        <>
            <h1>Assignment react</h1>
        </>
    )
};

if (document.getElementById('assignment')) {
    ReactDOM.render(<Assignment />, document.getElementById('assignment'));
}