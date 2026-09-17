import React from 'react';
import './InventoryCards.scss';

export const InventoryCards = ({ item = {}, ledState = false, isDeprecated = false }) => {
    const getBoxStyle = () => {
        if (isDeprecated) return 'inventory-box inventory-box--red';
        return 'inventory-box';
    };

    const getIndicator = () => {
        if (isDeprecated) return <div className="indicator indicator--red"></div>;
        return ledState ? <div className="indicator indicator--blue"></div> : <div className="indicator"></div>;
    };

    const isLowStock = item.count <= 0;

    return (
        <div className={getBoxStyle()}>
            {item.image && (
                <div className="inventory-box__image-container">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="inventory-box__image"
                    />
                </div>
            )}
            <h3 className="inventory-box__name">{item.name || 'N/A'}</h3>
            <p className="inventory-box__compartment">Compartment: {item.compartment || 'Unknown'}</p>
            <p className="inventory-box__quantity">Quantity: {item.count || 0}</p>
            {getIndicator()}
        </div>
    );
};
