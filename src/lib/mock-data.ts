export const terminals = [
    { id: "t1", name: "Terminal Centro", area: "Centro", coords: [-27.5969, -48.5495], schedule: "06:00 - 22:00", capacity: 120, services: ["Café", "Wi-Fi", "Acessibilidade"] },
    { id: "t2", name: "Terminal Beira-Mar", area: "Beira-Mar Norte", coords: [-27.5824, -48.5476], schedule: "06:30 - 21:00", capacity: 80, services: ["Café", "Loja"] },
    { id: "t3", name: "Terminal Lagoa", area: "Lagoa da Conceição", coords: [-27.6028, -48.4691], schedule: "07:00 - 20:00", capacity: 60, services: ["Bar", "Wi-Fi"] },
    { id: "t4", name: "Terminal Ribeirão", area: "Ribeirão da Ilha", coords: [-27.7172, -48.5640], schedule: "07:00 - 19:00", capacity: 50, services: ["Restaurante"] },
    { id: "t5", name: "Terminal Sambaqui", area: "Sambaqui", coords: [-27.4914, -48.5371], schedule: "06:30 - 21:30", capacity: 70, services: ["Café", "Mirante"] },
    { id: "t6", name: "Terminal Canasvieiras", area: "Canasvieiras", coords: [-27.4283, -48.4584], schedule: "07:00 - 22:00", capacity: 100, services: ["Loja", "Wi-Fi", "Aluguel"] },
    { id: "t7", name: "Terminal Costeira", area: "Costeira do Pirajubaé", coords: [-27.6361, -48.5294], schedule: "06:00 - 20:00", capacity: 65, services: ["Café"] },
];
export const suggestions = [
    {
        id: "r1", label: "Centro → Sambaqui", from: "t1", to: "t5", type: "rapida",
        distanceKm: 8.2, durationMin: 22, priceBRL: 14.5, conditions: "Calmo",
        path: [[-27.5969, -48.5495], [-27.55, -48.555], [-27.52, -48.55], [-27.4914, -48.5371]],
    },
    {
        id: "r2", label: "Centro → Ribeirão da Ilha", from: "t1", to: "t4", type: "turistica",
        distanceKm: 18.4, durationMin: 48, priceBRL: 32, conditions: "Ondas leves",
        path: [[-27.5969, -48.5495], [-27.63, -48.56], [-27.68, -48.58], [-27.7172, -48.5640]],
    },
    {
        id: "r3", label: "Beira-Mar → Canasvieiras", from: "t2", to: "t6", type: "economica",
        distanceKm: 22.1, durationMin: 55, priceBRL: 19, conditions: "Calmo",
        path: [[-27.5824, -48.5476], [-27.52, -48.52], [-27.46, -48.48], [-27.4283, -48.4584]],
    },
    {
        id: "r4", label: "Lagoa → Centro", from: "t3", to: "t1", type: "tranquila",
        distanceKm: 12.5, durationMin: 35, priceBRL: 22, conditions: "Calmo",
        path: [[-27.6028, -48.4691], [-27.6, -48.5], [-27.5969, -48.5495]],
    },
];
export const notifications = [
    { id: "n1", icon: "cloud", title: "Tempo bom até as 18h", body: "Mar calmo previsto para sua rota Centro → Sambaqui.", time: "agora", tag: "Clima" },
    { id: "n2", icon: "alert", title: "Alerta marítimo", body: "Ondas de até 1,5m após às 19h na costa norte.", time: "1h", tag: "Aviso" },
    { id: "n3", icon: "tag", title: "Promoção Ribeirão", body: "30% off em rotas turísticas neste fim de semana.", time: "3h", tag: "Promo" },
    { id: "n4", icon: "route", title: "Rota alterada", body: "Terminal Lagoa com partidas atrasadas em 10min.", time: "ontem", tag: "Rota" },
];
export const FLORIPA_CENTER = [-27.5949, -48.548];
