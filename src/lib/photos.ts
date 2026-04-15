/**
 * All real photo paths for Amazon Samaúma Lodge.
 * Drop files into /public/fotos_reais_amazon/ using the filenames below.
 * No code change needed when swapping a photo — just replace the file.
 */
const BASE = "/fotos_reais_amazon";

export const photos = {
  // ── Core shots (used across multiple pages) ──────────────────────────────
  /** Main lodge exterior / aerial view */
  lodge:       `${BASE}/lodge.jpg`,
  /** Fishing action shot — hero for the Pesca page */
  pesca:       `${BASE}/pesca.jpg`,
  /** Nature / forest / river — hero for the Ecoturismo page */
  ecoturismo:  `${BASE}/pesca-boca-tucunare.png`,

  // ── Rooms & Facilities ───────────────────────────────────────────────────
  /** Interior of the Standard room (upload quarto-standard.jpg to replace) */
  quartoStandard: `${BASE}/lodge.jpg`,
  /** Interior of the Family room (upload quarto-familia.jpg to replace) */
  quartoFamilia:  `${BASE}/lodge.jpg`,
  /** Restaurant / dining area */
  restaurante:    `${BASE}/restaurante.jpg`,
  /** Owner portrait */
  proprietario:   `${BASE}/proprietario.jpg`,

  // ── Fishing gallery (7 slots) ────────────────────────────────────────────
  /** Tucunaré being held / catch moment */
  pescaTucunare:     `${BASE}/pesca-tucunare-new.png`,
  /** Boat leaving at dawn */
  pescaBarco:        `${BASE}/pesca-barco.jpg`,
  /** Sunset on the river while fishing */
  pescaPorDoSol:     `${BASE}/pesca-por-do-sol.jpg`,
  /** Igarapé / narrow creek fishing spot */
  pescaIgarape:      `${BASE}/pesca-igarape.jpg`,
  /** Underwater shot of fish / river */
  pescaUnderwater:   `${BASE}/pesca-underwater.jpg`,
  /** Rods, lures and gear laid out */
  pescaEquipamentos: `${BASE}/pesca-equipamentos.jpg`,
  /** Group photo — anglers with trophies on the deck */
  pescaGrupo:        `${BASE}/pesca-grupo.jpg`,

  // ── Ecotourism tour galleries ────────────────────────────────────────────
  // Upload tour-safari.jpg, tour-trilhas.jpg etc. to override these fallbacks.
  /** Safari amazônico — wildlife on the river */
  tourSafari:    `${BASE}/ecoturismo.jpg`,
  /** Safari amazônico — second shot */
  tourSafari2:   `${BASE}/pesca-no-rio.png`,
  /** Trilhas na floresta — trail walk */
  tourTrilhas:   `${BASE}/pesca-barco.jpg`,
  /** Trilhas na floresta — second shot */
  tourTrilhas2:  `${BASE}/ecoturismo.jpg`,
  /** Pôr do sol no rio */
  tourPorDoSol:  `${BASE}/pesca-por-do-sol.jpg`,
  /** Expedição noturna — night boat / jacarés */
  tourNoturna:   `${BASE}/pesca-por-do-sol.jpg`,
  /** Expedição noturna — second shot */
  tourNoturna2:  `${BASE}/pesca-por-do-sol-new.png`,
  /** Cultura ribeirinha — community visit */
  tourCultura:   `${BASE}/pesca-grupo.jpg`,
  /** Roteiro personalizado — map / planning */
  tourRoteiro:   `${BASE}/pesca-trofeu.png`,
} as const;
