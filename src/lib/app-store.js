import { useSyncExternalStore } from "react";

const KEY = "floripa-abordo-state";
const EMPTY = {
  user: null,
  favorites: [],
  activeRoute: null,
  recentTrips: [],
  readNotifications: [],
  accounts: [],
  theme: "light",
};

let state = load();
const listeners = new Set();

function load() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "");
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  applyTheme(state.theme);
  listeners.forEach((l) => l());
}

// Apply theme on initial load
applyTheme(state.theme);

export const store = {
  get: () => state,
  subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  // Login if account exists, otherwise create one. Returns { ok, error }.
  authenticate: (email, password) => {
    const e = (email || "").trim().toLowerCase();
    if (!e || !password) return { ok: false, error: "Preencha e-mail e senha." };
    const existing = state.accounts.find((a) => a.email === e);
    if (existing) {
      if (existing.password !== password) return { ok: false, error: "Senha incorreta." };
      state = { ...state, user: { name: existing.name, email: existing.email } };
      persist();
      return { ok: true, created: false };
    }
    const name = e.split("@")[0] || "Navegante";
    const account = { name, email: e, password };
    state = {
      ...state,
      accounts: [...state.accounts, account],
      user: { name, email: e },
    };
    persist();
    return { ok: true, created: true };
  },
  signup: (name, email, password) => {
    const e = (email || "").trim().toLowerCase();
    if (!name || !e || !password) return { ok: false, error: "Preencha todos os campos." };
    if (state.accounts.some((a) => a.email === e)) {
      return { ok: false, error: "Já existe uma conta com este e-mail." };
    }
    const account = { name, email: e, password };
    state = {
      ...state,
      accounts: [...state.accounts, account],
      user: { name, email: e },
    };
    persist();
    return { ok: true };
  },
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
    if (state.readNotifications.includes(id)) return;
    state = { ...state, readNotifications: [...state.readNotifications, id] };
    persist();
  },
  setTheme: (theme) => {
    state = { ...state, theme: theme === "dark" ? "dark" : "light" };
    persist();
  },
  toggleTheme: () => {
    const next = state.theme === "dark" ? "light" : "dark";
    state = { ...state, theme: next };
    persist();
  },
};

export function useApp() {
  return useSyncExternalStore(store.subscribe, store.get, () => EMPTY);
}
