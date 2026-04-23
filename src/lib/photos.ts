/**
 * All real photo paths for Amazon Samaúma Lodge.
 * Drop files into /public/fotos_reais_amazon/ using the filenames below.
 * No code change needed when swapping a photo — just replace the file.
 */
const BASE = "/fotos_reais_amazon";

export const photos = {
  // ── Core shots (used across multiple pages) ──────────────────────────────
  /** Main lodge exterior / aerial view */
  lodge:       `${BASE}/lodge.webp`,
  /** Fishing action shot — hero for the Pesca page */
  pesca:       `${BASE}/pesca.webp`,
  /** Nature / forest / river — hero for the Ecoturismo page */
  ecoturismo:  `${BASE}/pesca-boca-tucunare.webp`,

  // ── Rooms & Facilities ───────────────────────────────────────────────────
  /** Interior of the Standard room (upload quarto-standard.webp to replace) */
  quartoStandard: `${BASE}/quarto-standard.png`,
  /** Interior of the Family room (upload quarto-familia.webp to replace) */
  quartoFamilia:  `${BASE}/lodge.webp`,
  /** Restaurant / dining area */
  restaurante:    `${BASE}/restaurante.webp`,
  /** Owner portrait */
  proprietario:   `${BASE}/proprietario.webp`,

  // ── Fishing gallery (7 slots) ────────────────────────────────────────────
  /** Tucunaré being held / catch moment */
  pescaTucunare:     `${BASE}/pesca-tucunare-new.webp`,
  /** Boat leaving at dawn */
  pescaBarco:        `${BASE}/pesca-barco.webp`,
  /** Sunset on the river while fishing */
  pescaPorDoSol:     `${BASE}/pesca-por-do-sol.webp`,
  /** Igarapé / narrow creek fishing spot */
  pescaIgarape:      `${BASE}/pesca-igarape.webp`,
  /** Underwater shot of fish / river */
  pescaUnderwater:   `${BASE}/pesca-underwater.webp`,
  /** Rods, lures and gear laid out */
  pescaEquipamentos: `${BASE}/pesca-equipamentos.webp`,
  /** Group photo — anglers with trophies on the deck */
  pescaGrupo:        `${BASE}/pesca-grupo.webp`,

  // ── Ecotourism tour galleries ────────────────────────────────────────────
  /** Safari amazônico — wildlife on the river */
  tourSafari:    `${BASE}/ecoturismo.webp`,
  /** Safari amazônico — second shot */
  tourSafari2:   `${BASE}/pesca-no-rio.webp`,
  /** Trilhas na floresta — trail walk */
  tourTrilhas:   `${BASE}/pesca-barco.webp`,
  /** Trilhas na floresta — second shot */
  tourTrilhas2:  `${BASE}/ecoturismo.webp`,
  /** Pôr do sol no rio */
  tourPorDoSol:  `${BASE}/pesca-por-do-sol.webp`,
  /** Expedição noturna — night boat / jacarés */
  tourNoturna:   `${BASE}/pesca-por-do-sol.webp`,
  /** Expedição noturna — second shot */
  tourNoturna2:  `${BASE}/pesca-por-do-sol-new.webp`,
  /** Cultura ribeirinha — community visit */
  tourCultura:   `${BASE}/pesca-grupo.webp`,
  /** Roteiro personalizado — map / planning */
  tourRoteiro:   `${BASE}/pesca-trofeu.webp`,
} as const;
