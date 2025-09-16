import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const Surgery = ({ surgeryId, onBack }) => {
    const [surgery, setSurgery] = useState(null);
    const [originalSurgery, setOriginalSurgery] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isNewSurgery = surgeryId === 'new';

    // Default empty surgery for new surgeries
    const getEmptySurgery = () => ({
        surgeryType: '',
        dateTime: new Date().toISOString(),
        surgeon: '',
        patient: {
            name: '',
            birthdate: '',
            age: ''
        },
        status: 'scheduled'
    });

    useEffect(() => {
        if (surgeryId && surgeryId !== 'new') {
            fetchSurgery();
        } else {
            // Initialize with empty surgery for new surgery
            const emptySurgery = getEmptySurgery();
            setSurgery(emptySurgery);
            setOriginalSurgery(emptySurgery);
            setHasChanges(false);
        }
    }, [surgeryId]);

    const fetchSurgery = () => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/surgeries/${surgeryId}`)
            .then(response => response.json())
            .then(data => {
                setSurgery(data);
                setOriginalSurgery(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
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
        setIsLoading(true);
        try {
            const url = isNewSurgery
                ? `${API_BASE_URL}/surgeries`
                : `${API_BASE_URL}/surgeries/${surgeryId}`;

            const method = isNewSurgery ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surgery)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isNewSurgery ? 'create' : 'update'} surgery`);
            }

            const result = await response.json();

            if (isNewSurgery) {
                // For new surgery, just go back to the list
                onBack();
            } else {
                // For existing surgery, update the local state
                setSurgery(result.surgery);
                setOriginalSurgery(result.surgery);
                setHasChanges(false);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isNewSurgery) {
            onBack();
        } else {
            setSurgery(originalSurgery);
            setHasChanges(false);
        }
    };

    const formatDateTimeForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format for datetime-local input
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 10); // Format for date input
    };

    if (isLoading || (!isNewSurgery && !surgery)) {
        return <div>Loading surgery details...</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem' }}>
                ← Back to List
            </button>

            <h2>{isNewSurgery ? 'Add New Surgery' : 'Edit Surgery'}</h2>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Surgery Type:</strong>
                    </label>
                    <input
                        type="text"
                        value={surgery?.surgeryType || ''}
                        onChange={(e) => handleInputChange('surgeryType', e.target.value)}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                        placeholder="Enter surgery type"
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Date & Time:</strong>
                    </label>
                    <input
                        type="datetime-local"
                        value={surgery?.dateTime ? formatDateTimeForInput(surgery.dateTime) : ''}
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
                        value={surgery?.surgeon || ''}
                        onChange={(e) => handleInputChange('surgeon', e.target.value)}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                        placeholder="Enter surgeon name"
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Patient Name:</strong>
                    </label>
                    <input
                        type="text"
                        value={surgery?.patient?.name || ''}
                        onChange={(e) => handleInputChange('patient', e.target.value, true, 'name')}
                        style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                        placeholder="Enter patient name"
                    />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Patient Birthdate:</strong>
                    </label>
                    <input
                        type="date"
                        value={surgery?.patient?.birthdate ? formatDateForInput(surgery.patient.birthdate) : ''}
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
                        value={surgery?.patient?.age || ''}
                        onChange={(e) => handleInputChange('patient', parseInt(e.target.value) || '', true, 'age')}
                        style={{ padding: '0.5rem', width: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
                        placeholder="Age"
                    />
                </div>

                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center'}}>
                    <label style={{ minWidth: '150px', marginRight: '1rem' }}>
                        <strong>Status:</strong>
                    </label>
                    <select
                        value={surgery?.status || 'scheduled'}
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
                {(hasChanges || isNewSurgery) && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: isLoading ? '#6c757d' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {isLoading ? 'Saving...' : (isNewSurgery ? 'Create Surgery' : 'Save Changes')}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {isNewSurgery ? 'Cancel' : 'Cancel Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Surgery;