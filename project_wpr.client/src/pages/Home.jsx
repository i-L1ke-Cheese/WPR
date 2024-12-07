import React, { useState } from 'react';
import './Home.css';

function Home() {
    // Array van auto's met afbeeldingen
    const cars = [
        { id: 1, name: 'Toyota', imageSrc: 'supra.jpg' },
        { id: 2, name: 'BMW', imageSrc: 'bmwtouring.jpeg    ' },
        { id: 3, name: 'Audi', imageSrc: 'rs7.jpg' },
        { id: 4, name: 'Mercedes', imageSrc: '2023-mercedes-s63-amg-1.jpg' }
    ];

    // State om de geselecteerde auto bij te houden
    const [selectedCar, setSelectedCar] = useState(null); // null betekent geen geselecteerde auto

    // Functie voor het aanklikken van een auto
    const handleClick = (car) => {
        setSelectedCar(car.id === selectedCar ? null : car.id); // Als dezelfde auto wordt aangeklikt, deselecteer
    };

    return (
        <div className="container">
            {/* Itereer over de lijst van auto's en toon ze */}
            {cars.map((car) => (
                <div key={car.id}>
                    <img
                        src={car.imageSrc}
                        alt={car.name}
                        className={selectedCar === car.id ? 'selected' : ''} // Voeg de 'selected' klasse toe als de auto is geselecteerd
                        onClick={() => handleClick(car)}
                    />
                </div>
            ))}
        </div>
    );
}

export default Home;
