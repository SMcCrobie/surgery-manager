import { useState, useEffect } from 'react';

const Surgery = ({ surgeryId, onBack }) => {
    const [surgery, setSurgery] = useState(null);

    useEffect(() => {
        if (surgeryId) {
            fetch(`http://localhost:3000/api/surgeries/${surgeryId}`)
                .then(response => response.json())
                .then(data => setSurgery(data))
                .catch(error => console.error('Error:', error));
        }
    }, [surgeryId]);

    if (!surgery) {
        return <div>Loading surgery details...</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem' }}>
                ← Back to List
            </button>

            <h2>Surgery Details</h2>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
                <h3>{surgery.surgeryType}</h3>

                <div style={{ marginBottom: '1rem' }}>
                    <strong>Date & Time:</strong> {new Date(surgery.dateTime).toLocaleString()}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <strong>Surgeon:</strong> {surgery.surgeon}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <strong>Patient:</strong> {surgery.patient?.name}
                </div>

                {surgery.patient?.birthdate && (
                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Patient Birthdate:</strong> {new Date(surgery.patient.birthdate).toLocaleDateString()}
                    </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                    <strong>Status:</strong> {surgery.status}
                </div>

                {surgery.notes && (
                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Notes:</strong> {surgery.notes}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Surgery;