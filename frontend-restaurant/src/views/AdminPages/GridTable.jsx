import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GridTable.css';

const GridTable = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tables', { headers });
                setTables(response.data);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, []);

    const handleGridClick = async (x, y) => {
        if (selectedTable && selectedTable.id) {
            const userData = JSON.parse(localStorage.getItem("user"));
            const headers = {
                Authorization: `Bearer ${userData.access_token}`,
                'Content-Type': 'application/json',
            };

            const updatedTable = {
                ...selectedTable,
                emplacement_X: x,
                emplacement_Y: y,
            };

            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/edit_tables/${selectedTable.id}`, updatedTable, { headers });
                setTables(tables.map(table => (table.id === selectedTable.id ? response.data : table)));
                setSelectedTable(null);
                console.log('Table updated successfully:', response.data);
            } catch (error) {
                console.error('Error updating table:', error);
            }
        }
    };

    const handleTableSelect = (table) => {
        setSelectedTable(table);
    };

    return (
        <div className="grid-table-container">
            <h2>Restaurant Table Management</h2>
            <div className="grid">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="row">
                        {Array.from({ length: 10 }).map((_, colIndex) => {
                            const table = tables.find(table => table.emplacement_X === colIndex && table.emplacement_Y === rowIndex);
                            return (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    className={`cell ${table ? 'occupied' : ''}`}
                                    onClick={() => handleGridClick(colIndex, rowIndex)}
                                >
                                    {table ? 'T' : ''}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="table-list">
                <h3>Select a Table to Move</h3>
                <ul>
                    {tables.map(table => (
                        <li
                            key={`table-${table.id}`}  // Ensure that `table.id` is being used
                            onClick={() => handleTableSelect(table)}
                            className={selectedTable && selectedTable.id === table.id ? 'selected' : ''}
                        >
                            Table {table.id} - Seats: {table.nombrePlace}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedTable && (
                <div className="selected-table-info">
                    <h3>Selected Table</h3>
                    <p>ID: {selectedTable.id}</p>
                    <p>Seats: {selectedTable.nombrePlace}</p>
                    <p>Current Position: ({selectedTable.emplacement_X}, {selectedTable.emplacement_Y})</p>
                </div>
            )}
        </div>
    );
};

export default GridTable;
