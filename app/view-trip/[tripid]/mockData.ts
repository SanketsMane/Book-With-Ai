
export const MOCK_TRIP = {
    tripDetail: {
        destination: "Paris, France",
        duration: "3",
        budget: "Medium",
        travelers: "Couple",
        hotels: [
            {
                hotel_name: "Hotel Le Meurice",
                hotel_address: "228 Rue de Rivoli, 75001 Paris",
                price_per_night: "$400",
                hotel_image_url: "/placeholder.jpg",
                geo_coordinates: {
                    latitude: 48.8655,
                    longitude: 2.3276
                },
                rating: 4.8,
                description: "Luxury hotel with palace decor details."
            },
            {
                hotel_name: "Pullman Paris Tour Eiffel",
                hotel_address: "18 Avenue de Suffren, 75015 Paris",
                price_per_night: "$250",
                hotel_image_url: "/placeholder.jpg",
                geo_coordinates: {
                    latitude: 48.8554,
                    longitude: 2.2933
                },
                rating: 4.5,
                description: "Contemporary hotel with Eiffel Tower views."
            }
        ],
        itinerary: [
            {
                day: 1,
                best_time_to_visit_day: "Morning",
                day_plan: "Explore the historic heart of Paris and iconic landmarks.",
                activities: [
                    {
                        place_name: "Eiffel Tower",
                        place_details: "Iconic iron lady of Paris.",
                        place_image_url: "/placeholder.jpg",
                        place_address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
                        geo_coordinates: {
                            latitude: 48.8584,
                            longitude: 2.2945
                        },
                        ticket_pricing: "$25",
                        time_travel_each_location: "09:00 - 12:00",
                        best_time_to_visit: "Morning"
                    },
                    {
                        place_name: "Louvre Museum",
                        place_details: "World's largest art museum.",
                        place_image_url: "/placeholder.jpg",
                        place_address: "Musée du Louvre, 75001 Paris",
                        geo_coordinates: {
                            latitude: 48.8606,
                            longitude: 2.3376
                        },
                        ticket_pricing: "$17",
                        time_travel_each_location: "14:00 - 17:00",
                        best_time_to_visit: "Afternoon"
                    }
                ]
            },
            {
                day: 2,
                best_time_to_visit_day: "Afternoon",
                day_plan: "Enjoy the artistic side of Paris in Montmartre.",
                activities: [
                    {
                        place_name: "Sacre-Coeur Basilica",
                        place_details: "Famous white church on the hill.",
                        place_image_url: "/placeholder.jpg",
                        place_address: "35 Rue du Chevalier de la Barre, 75018 Paris",
                        geo_coordinates: {
                            latitude: 48.8867,
                            longitude: 2.3431
                        },
                        ticket_pricing: "Free",
                        time_travel_each_location: "10:00 - 12:00",
                        best_time_to_visit: "Morning"
                    }
                ]
            }
        ]
    }
};
