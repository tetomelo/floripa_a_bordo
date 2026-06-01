import { useSyncExternalStore } from "react";
import type { RouteSuggestion } from "./mock-data";

export interface RecentTrip {
  id: string;
  origin: string;
  destination: string;
  originCoords: [number, number];
  destinationCoords: [number, number];
  createdAt: number;
}

interface AppState {
  user: { name: string; email: string } | null;
  favorites: string[];
  activeRoute: RouteSuggestion | null;
  recentTrips: RecentTrip[];
  readNotifications: string[];
}

const KEY = "floripa-abordo-state";
const EMPTY: AppState = { user: null, favorites: [], activeRoute: null, recentTrips: [], readNotifications: [] };
let state: AppState = load();
const listeners = new Set<() => void>();

function load(): AppState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "");
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  login: (name: string, email: string) => { state = { ...state, user: { name, email } }; persist(); },
  logout: () => { state = { ...state, user: null }; persist(); },
  toggleFav: (id: string) => {
    const has = state.favorites.includes(id);
    state = { ...state, favorites: has ? state.favorites.filter((x) => x !== id) : [...state.favorites, id] };
    persist();
  },
  setRoute: (r: RouteSuggestion | null) => { state = { ...state, activeRoute: r }; persist(); },
  addTrip: (trip: Omit<RecentTrip, "id" | "createdAt">) => {
    const entry: RecentTrip = { ...trip, id: `${Date.now()}`, createdAt: Date.now() };
    state = { ...state, recentTrips: [entry, ...state.recentTrips].slice(0, 20) };
    persist();
  },
  clearTrips: () => { state = { ...state, recentTrips: [] }; persist(); },
  markNotificationRead: (id: string) => {
    if (state.readNotifications.includes(id)) return;
    state = { ...state, readNotifications: [...state.readNotifications, id] };
    persist();
  },
};

export function useApp() {
  return useSyncExternalStore(store.subscribe, store.get, () => EMPTY);
}
