const React = require('react');
const ReactDOM = require('react-dom/client');
const bgimage = document.getElementById('bgimage_2');
const bgmenu = document.getElementById('bgmenu');
const btn_menu = document.getElementById('menu');
//const btn_close = document.getElementById('btn_close');
//const btn_settings = document.getElementById('btn_settings');
//const btn_back = document.getElementById('btn_back');
//const bginstructions = document.getElementById('bginstructions');

const LateralMenu = ({ setShowMenu }) => { console.log('-', btn_menu?.src)
    return (
        <div
            style={{
                width: 70,
                textAlign: 'center',
                height: '100vh',
                position: 'absolute',
                top: 20,
                right: 0,
                zIndex: 1
            }}
        >
            <div>
                <img
                    style={{
                        cursor: 'pointer'
                    }} 
                    src={btn_menu?.src} 
                    onClick={() => setShowMenu(true)}
                />
            </div>
        </div>
    )
};

if (document.getElementById('lateral-menu')) {
    const root = ReactDOM.createRoot(document.getElementById('lateral-menu'));
    root.render(<LateralMenu />);
}