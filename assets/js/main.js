
document.addEventListener('alpine:init', () => {
    Alpine.data('roomList', () => ({
        rooms: [],
        filteredRooms: [],
        filters: {
            price: '',
            type: '',
            occupancy: ''
        },

        // Modal state
        showModal: false,
        currentRoomImages: [],
        currentImageIndex: 0,

        async init() {
            try {
                const response = await fetch('data/rooms.json');
                this.rooms = await response.json();
                this.filteredRooms = this.rooms;
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        },

        applyFilters() {
            this.filteredRooms = this.rooms.filter(room => {
                let matchesPrice = true;
                if (this.filters.price) {
                    const price = room.price_monthly_1;
                    if (this.filters.price === '1') matchesPrice = price < 1000000;
                    else if (this.filters.price === '2') matchesPrice = price >= 1000000 && price <= 2000000;
                    else if (this.filters.price === '3') matchesPrice = price > 2000000;
                }

                let matchesOccupancy = true;
                if (this.filters.occupancy) {
                    matchesOccupancy = room.max_occupancy >= parseInt(this.filters.occupancy);
                }

                let matchesType = true;
                if (this.filters.type) {
                    const facString = room.facilities.join(' ').toLowerCase();
                    if (this.filters.type === 'token') {
                        // Heuristic: contains 'token' but not 'non-token'
                        matchesType = facString.includes('token') && !facString.includes('non-token');
                    } else if (this.filters.type === 'non-token') {
                        matchesType = facString.includes('non-token');
                    }
                }

                return matchesPrice && matchesOccupancy && matchesType;
            });
        },

        formatPrice(price) {
            return new Intl.NumberFormat('id-ID').format(price);
        },

        // Modal functions
        openModal(images) {
            this.currentRoomImages = images || [];
            this.currentImageIndex = 0;
            this.showModal = true;
            document.body.style.overflow = 'hidden'; // Prevent scroll
        },

        closeModal() {
            this.showModal = false;
            document.body.style.overflow = 'auto';
        },

        nextImage() {
            if (this.currentRoomImages.length > 0) {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.currentRoomImages.length;
            }
        },

        prevImage() {
            if (this.currentRoomImages.length > 0) {
                this.currentImageIndex = (this.currentImageIndex - 1 + this.currentRoomImages.length) % this.currentRoomImages.length;
            }
        }
    }));
});
