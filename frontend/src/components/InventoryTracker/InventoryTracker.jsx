import './InventoryTracker.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { InventoryCardsList } from '../InventoryCardsList/InventoryCardsList';
import { InventoryCards } from '../InventoryCards/InventoryCards';

export const InventoryTracker = () => {
    const [activeTab, setActiveTab] = useState('drawer'); // 'drawer' or 'compartment'
    const [currentDrawer, setCurrentDrawer] = useState(1); // Default to drawer 1
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [ledStates, setLedStates] = useState([]);
    const [isDeprecated, setIsDeprecated] = useState([]);
    const [selectedCompartment, setSelectedCompartment] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/data');
                const { inventory, ledStates, isDeprecated } = response.data;

                // Check if the response data is valid
                if (inventory && inventory.length > 0) {
                    setInventory(inventory);
                    setLedStates(ledStates);
                    setIsDeprecated(isDeprecated);
                } else {
                    console.warn('Received empty or invalid data from API, using mock data.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = () => {
        axios.get('http://localhost:8080/api/data')
            .then(response => {
                const { inventory, ledStates, isDeprecated } = response.data;
                setInventory(inventory);
                setLedStates(ledStates);
                setIsDeprecated(isDeprecated);
            })
            .catch(error => {
                console.error('Error refreshing data:', error);
            });
    };

    const handleClosePopup = () => {
        setSelectedCompartment(null);
    };

    // Get the compartments for the current drawer
    const currentDrawerData = inventory.find(drawer => drawer.drawer === currentDrawer);
    const compartments = currentDrawerData ? currentDrawerData.compartments : [];

    return (
        <div className="inventory-container">
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'drawer' ? 'tab-button--active' : ''}`}
                    onClick={() => setActiveTab('drawer')}
                >
                    Drawer
                </button>
                <button 
                    className={`tab-button ${activeTab === 'compartment' ? 'tab-button--active' : ''}`}
                    onClick={() => setActiveTab('compartment')}
                >
                    Compartment
                </button>
            </div>
            
            <div className="inventory-header">
                <h2>Drawer {currentDrawer} Inventory <button className="refresh-button" onClick={handleRefresh}>↻</button></h2>
                <p className="inventory-subtitle">Real-time status of medical supplies</p>
            </div>
            
            <div className="inventory-content">
                <div className="inventory-grid-container">
                    <InventoryCardsList
                        items={compartments.map((item, index) => ({
                            name: (
                                <InventoryCards
                                    key={index}
                                    item={item}
                                    ledState={ledStates[index]}
                                    isDeprecated={isDeprecated[index]}
                                />
                            ),
                            count: item.count,
                        }))}
                    />
                </div>
                
                <div className="item-locator">
                    <h2>Item Locator</h2>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Search for item..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="crash-cart-visual">
                        <img src="../../assets/crash-cart.jpg" alt="Crash Cart" className="crash-cart-image" />
                        <div className="hover-instruction">popup on hover: view full inventory</div>
                        
                        {selectedCompartment && (
                            <div className="compartment-popup">
                                <button className="close-popup" onClick={handleClosePopup}>×</button>
                                <h3>Drawer {currentDrawer}</h3>
                                <p>Compartment {selectedCompartment}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};