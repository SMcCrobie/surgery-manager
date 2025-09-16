import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const SurgeryList = ({ onViewSurgery }) => {
    const [surgeries, setSurgeries] = useState([]);

    function fetchSurgeries() {
        fetch(`${API_BASE_URL}/surgeries`)
            .then(response => response.json())
            .then(data => setSurgeries(data))
            .catch(error => console.error('Error:', error));
    }


    useEffect(() => {
      fetchSurgeries();
    }, []);

    function cancelSurgery(id) {
        fetch(`${API_BASE_URL}/surgeries/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }})
            .then(response => response.json())
            .then(data => console.log('Cancelled:', data))
            .then(fetchSurgeries);
    }

    return (
        <div>
            <h2>Upcoming Surgeries</h2>
            {surgeries.map((surgery) => (
                <div key={surgery._id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
                    <h3>{surgery.surgeryType}</h3>
                    <p>Date: {new Date(surgery.dateTime).toLocaleString()}</p>
                    <p>Surgeon: {surgery.surgeon}</p>
                    <p>Patient: {surgery.patient?.name}</p>

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center'
                    }}>

                    <button
                        onClick={() => onViewSurgery(surgery._id)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        View Details
                    </button>

                    <button
                        onClick={() => cancelSurgery(surgery._id)}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: `red`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default SurgeryList;