import { React } from 'react'
import './App.scss'
import { NavBar } from './components/NavBar/NavBar'
import { InventoryTracker } from './components/InventoryTracker/InventoryTracker'
import { ItemLocator } from './components/ItemLocator/ItemLocator'

const App = () => {
    return (
        <div className="app">
            <NavBar />
            <ItemLocator />
            {/* <InventoryTracker /> */}
        </div>
    );
}

export default App;