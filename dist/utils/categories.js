"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuelType = exports.getCategory = void 0;
const getCategory = (name) => {
    const categories = [
        { id: 1, name: "Cycle" },
        { id: 2, name: "Cycle 3 wheels" },
        { id: 3, name: "Car" },
        { id: 4, name: "Bus (City)" },
        { id: 5, name: "Bus (High Way)" },
        { id: 6, name: "Light Truck (City)" },
        { id: 7, name: "Light Truck (High Way)" },
        { id: 8, name: "Heavy Truck (City)" },
        { id: 9, name: "Heavy Truck (High Way)" },
        { id: 10, name: "Trailer" },
        { id: 11, name: "Trailer (High Way)" },
        { id: 12, name: "Htawlargyi" },
        { id: 13, name: "Tractor" },
        { id: 14, name: "Small Tractor" },
        { id: 15, name: "Heavy Machinery" },
        { id: 16, name: "Commercial Vehicle" },
        { id: 17, name: "Phone Tower" },
        { id: 18, name: "Industrial Zone" },
        { id: 19, name: "Generator (Industry)" },
        { id: 20, name: "Agriculture Machine" },
        { id: 21, name: "Generator (Home Use)" },
        { id: 22, name: "Hospital" },
        { id: 23, name: "School" },
        { id: 24, name: "Super Market" },
        { id: 25, name: "Hotel" },
        { id: 26, name: "Housing" },
        { id: 27, name: "Boat" },
    ];
    const category = categories.find(category => category.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (category) {
        return category.id;
    }
    else {
        return 1;
    }
};
exports.getCategory = getCategory;
const getFuelType = (name) => {
    switch (name) {
        case "001-Octane Ron(92)":
            return 1;
        case "002-Octane Ron(95)":
            return 2;
        case "004-Diesel":
            return 4;
        case "005-Premium Diesel":
            return 5;
        default:
            return 1;
    }
};
exports.getFuelType = getFuelType;
