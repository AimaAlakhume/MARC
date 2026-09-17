import './App.scss'
import { NavBar } from './components/NavBar/NavBar'
import { InventoryTracker } from './components/InventoryTracker/InventoryTracker'
import { ItemLocator } from './components/ItemLocator/ItemLocator'

const App = () => {
    return (
        <div className="app">
            <NavBar />
            <ItemLocator />
            {/* Earlier design iteration, not used in the study: <InventoryTracker /> */}
        </div>
    );
}

export default App;