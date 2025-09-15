import { useState, useEffect } from 'react';

const Surgery = ({ surgeryId, onBack }) => {
    const [surgery, setSurgery] = useState(null);
    const [originalSurgery, setOriginalSurgery] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (surgeryId) {
            fetchSurgery();
        }
    }, [surgeryId]);

    const fetchSurgery = () => {
        fetch(`http://localhost:3000/api/surgeries/${surgeryId}`)
            .then(response => response.json())
            .then(data => {
                setSurgery(data);
                setOriginalSurgery(data);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleInputChange = (field, value, isNested = false, nestedField = null) => {
        setSurgery(prev => {
            let updated;
            if (isNested) {
                updated = {
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [nestedField]: value
                    }
                };
            } else {
                updated = {
                    ...prev,
                    [field]: value
                };
            }

            // Check if there are changes
            const hasChanges = JSON.stringify(updated) !== JSON.stringify(originalSurgery);
            setHasChanges(hasChanges);

            return updated;
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/surgeries/${surgeryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surgery)
            });

            if (!response.ok) {
                throw new Error('Failed to update surgery');
            }

            const updatedSurgery = await response.json();
            setSurgery(updatedSurgery.surgery);
            setOriginalSurgery(updatedSurgery.surgery);
            setHasChanges(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        setSurgery(originalSurgery);
        setHasChanges(false);
    };

    const formatDateTimeForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format for datetime-local input
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 10); // Format for date input
    };

    if (!surgery) {
        return <div>Loading surgery details...</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem' }}>
                ← Back to List
            </button>

            <h2>Edit Surgery</h2>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Surgery Type:</strong>
                    </label>
                    <input
                        type="text"
                        value={surgery.surgeryType}
                        onChange={(e) => handleInputChange('surgeryType', e.target.value)}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Date & Time:</strong>
                    </label>
                    <input
                        type="datetime-local"
                        value={formatDateTimeForInput(surgery.dateTime)}
                        onChange={(e) => handleInputChange('dateTime', new Date(e.target.value).toISOString())}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Surgeon:</strong>
                    </label>
                    <input
                        type="text"
                        value={surgery.surgeon}
                        onChange={(e) => handleInputChange('surgeon', e.target.value)}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Patient Name:</strong>
                    </label>
                    <input
                        type="text"
                        value={surgery.patient?.name || ''}
                        onChange={(e) => handleInputChange('patient', e.target.value, true, 'name')}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Patient Birthdate:</strong>
                    </label>
                    <input
                        type="date"
                        value={surgery.patient?.birthdate ? formatDateForInput(surgery.patient.birthdate) : ''}
                        onChange={(e) => handleInputChange('patient', new Date(e.target.value).toISOString(), true, 'birthdate')}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Patient Age:</strong>
                    </label>
                    <input
                        type="number"
                        value={surgery.patient?.age || ''}
                        onChange={(e) => handleInputChange('patient', parseInt(e.target.value), true, 'age')}
                        style={{ padding: '0.5rem', width: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center'}}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Status:</strong>
                    </label>
                    <select
                        value={surgery.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

            </div>
            <div style={{ marginTop: '.5rem', minHeight:'3rem'}}>
                {hasChanges && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Cancel Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Surgery;