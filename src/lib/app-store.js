import { useSyncExternalStore } from "react";
const KEY = "floripa-abordo-state";
const EMPTY = { user: null, favorites: [], activeRoute: null, recentTrips: [], readNotifications: [] };
let state = load();
const listeners = new Set();
function load() {
    if (typeof window === "undefined")
        return EMPTY;
    try {
        const parsed = JSON.parse(localStorage.getItem(KEY) || "");
        return { ...EMPTY, ...parsed };
    }
    catch {
        return EMPTY;
    }
}
function persist() {
    if (typeof window !== "undefined")
        localStorage.setItem(KEY, JSON.stringify(state));
    listeners.forEach((l) => l());
}
export const store = {
    get: () => state,
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
    login: (name, email) => { state = { ...state, user: { name, email } }; persist(); },
    logout: () => { state = { ...state, user: null }; persist(); },
    toggleFav: (id) => {
        const has = state.favorites.includes(id);
        state = { ...state, favorites: has ? state.favorites.filter((x) => x !== id) : [...state.favorites, id] };
        persist();
    },
    setRoute: (r) => { state = { ...state, activeRoute: r }; persist(); },
    addTrip: (trip) => {
        const entry = { ...trip, id: `${Date.now()}`, createdAt: Date.now() };
        state = { ...state, recentTrips: [entry, ...state.recentTrips].slice(0, 20) };
        persist();
    },
    clearTrips: () => { state = { ...state, recentTrips: [] }; persist(); },
    markNotificationRead: (id) => {
        if (state.readNotifications.includes(id))
            return;
        state = { ...state, readNotifications: [...state.readNotifications, id] };
        persist();
    },
};
export function useApp() {
    return useSyncExternalStore(store.subscribe, store.get, () => EMPTY);
}
