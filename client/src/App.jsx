import './App.css'
import { useState } from 'react';
import SurgeryList from "./pages/SurgeryList.jsx";
import Surgery from "./pages/Surgery.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState('list');
    const [selectedSurgeryId, setSelectedSurgeryId] = useState(null);

    const handleViewSurgery = (surgeryId) => {
        setSelectedSurgeryId(surgeryId);
        setCurrentPage('surgery');
    };

    const handleBackToList = () => {
        setCurrentPage('list');
        setSelectedSurgeryId(null);
    };

    const handleAddSurgery = () => {
        setSelectedSurgeryId('new');
        setCurrentPage('surgery');
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>Surgery Manager</h1>
            </header>

            <main>
                {currentPage === 'list' && (
                    <SurgeryList onViewSurgery={handleViewSurgery}
                                 onAddSurgery={handleAddSurgery}/>
                )}
                {currentPage === 'surgery' && (
                    <Surgery
                        surgeryId={selectedSurgeryId}
                        onBack={handleBackToList}
                    />
                )}
            </main>
        </div>
    )
}

export default App