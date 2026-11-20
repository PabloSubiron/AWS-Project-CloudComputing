const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = {
    async login(nif, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nif, password })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || 'Error en login');
        return data.user;
    },

    async getReservations(facility, date) {
        // date object to YYYY-MM-DD string
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
        const params = new URLSearchParams();
        if (facility) params.append('facility', facility);
        if (dateStr) params.append('date', dateStr);
        
        const res = await fetch(`${API_URL}/reservations?${params}`);
        const data = await res.json();
        return data.reservations || [];
    },

    async getUserReservations(userId) {
        const res = await fetch(`${API_URL}/reservations?userId=${userId}`);
        const data = await res.json();
        return data.reservations || [];
    },

    async deleteReservation(reservaId) {
        const res = await fetch(`${API_URL}/reservations/${reservaId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || 'Error al cancelar la reserva');
        return data;
    },

    async createIncident(incidentData) {
        const res = await fetch(`${API_URL}/incidents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incidentData)
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || 'Error al enviar incidencia');
        return data.incident;
    },

    async createReservation(reservationData) {
        const { date, ...rest } = reservationData;
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
        
        const res = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rest, date: dateStr })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || 'Error al reservar');
        return data.reservation;
    },

    async getGroupInfo(groupName, userId) {
        const params = userId ? `?userId=${userId}` : '';
        const res = await fetch(`${API_URL}/groups/${groupName}${params}`);
        return await res.json();
    },

    async joinGroup(groupName, userId) {
        const res = await fetch(`${API_URL}/groups/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupName, userId })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || 'Error al unirse');
        return data;
    }
};