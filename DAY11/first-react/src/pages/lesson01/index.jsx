import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../public/vite.svg';
import './lesson01.css';
import MyGallery from '../../MyGallery';

//kiro
//Google antigravity
const alts = {
    react: 'React logo',
    vite: 'Vite logo',
};

//function的名稱開頭要大寫
function ImgVite(props) {
    console.log('ImgVite props:', props);
    //變數的名稱需要駝峰式命名法
    //const imgVite = <img src={viteLogo} className="logo" alt="Vite logo" />;
    return <img src={viteLogo} className="logo" alt={alts.vite} />;
}

function LinkReact() {
    const imgReact = <img src={reactLogo} className="logo react" alt="React logo" />;
    return (
        <a href="https://react.dev" target="_blank">
            {imgReact}
            <ImgVite />
        </a>
    );
}

function Lesson01() {
    const [count, setCount] = useState(0);
    const h1Title = <h1>Vite + React</h1>;

    const imgReact = <img src={reactLogo} className="logo react" alt="React logo" />;

    const handleClick = () => {
        console.log('Logo clicked!');
    };
    const alertClick = () => {
        alert('Logo clicked!');
    };

    return (
        <>
            <MyGallery />
            <div>
                <a href="https://vite.dev" target="_blank">
                    <ImgVite Loki="hello" /> {/*需要結尾符號 "_/" */}
                    {imgReact}
                </a>
                <br /> {/*需要結尾符號 "_/" */}
                <hr /> {/*需要結尾符號 "_/" */}
                <LinkReact />
                {/* <a href="https://react.dev" target="_blank">
                    {imgReact}
                    <ImgVite />
                </a> */}
            </div>
            {h1Title}
            <div className="card" style={{ color: 'blue' }}>
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs" style={{ color: 'red' }}>
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default Lesson01;
