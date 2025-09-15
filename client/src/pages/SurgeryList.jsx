import { useState, useEffect } from 'react';

const SurgeryList = ({ onViewSurgery }) => {
    const [surgeries, setSurgeries] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/surgeries')
            .then(response => response.json())
            .then(data => setSurgeries(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h2>Upcoming Surgeries</h2>
            {surgeries.map((surgery) => (
                <div key={surgery._id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
                    <h3>{surgery.surgeryType}</h3>
                    <p>Date: {new Date(surgery.dateTime).toLocaleString()}</p>
                    <p>Surgeon: {surgery.surgeon}</p>
                    <p>Patient: {surgery.patient?.name}</p>

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
                </div>
            ))}
        </div>
    );
};

export default SurgeryList;