import React from 'react';
import './InventoryCardsList.scss';

export const InventoryCardsList = ({ items = [] }) => {
    return (
        <div className="inventory-cards">
            {items.map((item, index) => (
                <div key={index} className="inventory-cards__card">
                    {item.count <= 0 ? (
                        <div className="inventory-cards__status inventory-cards__status--low-stock">⚠</div>
                    ) : (
                        <div className="inventory-cards__status inventory-cards__status--available">✔</div>
                    )}
                    <span>{item.name || 'N/A'}</span>
                </div>
            ))}
        </div>
    );
};