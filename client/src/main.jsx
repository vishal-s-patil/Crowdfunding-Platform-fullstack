import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css'
import {ChainId, ThirdwebProvider} from '@thirdweb-dev/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThirdwebProvider desiredChainId={ChainId.Goerli}>
        <Router>
            <App/>
        </Router>
    </ThirdwebProvider>
)