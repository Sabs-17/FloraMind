const PLANT_KEYWORDS = {
  roseira: 'rosa',
  rosas: 'rosa',
  rosa: 'rosa',
  orquidea: 'orquidea',
  orquídea: 'orquidea',
  cacto: 'cacto',
  suculenta: 'suculenta',
  samambaia: 'samambaia',
  bonsai: 'bonsai',
  monstera: 'monstera',
  filodendro: 'filodendro',
  costela: 'costela-de-adao',
  violeta: 'violeta',
  lirio: 'lirio',
  palmeira: 'palmeira',
  lavanda: 'lavanda',
  manjericao: 'manjericao',
};

function normalizeText(message) {
  if (!message || typeof message !== 'string') return '';
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function detectPlant(message) {
  const text = normalizeText(message);
  for (const keyword of Object.keys(PLANT_KEYWORDS)) {
    if (text.includes(keyword)) return PLANT_KEYWORDS[keyword];
  }
  return null;
}

export function updateMemory(memory = {}, detectedPlant, detectedIntent = null) {
  const next = { ...(memory || {}) };
  if (detectedPlant) {
    if (!next.firstPlantMentioned) next.firstPlantMentioned = detectedPlant;
    next.currentPlant = detectedPlant;
    next.mentionedPlants = Array.isArray(next.mentionedPlants) ? next.mentionedPlants : [];
    if (!next.mentionedPlants.includes(detectedPlant)) next.mentionedPlants.push(detectedPlant);
  }

  if (detectedIntent) next.currentIntent = detectedIntent;

  return next;
}

export function memoryToText(memory = {}) {
  if (!memory || typeof memory !== 'object') return '';
  const parts = [];
  if (memory.firstPlantMentioned) parts.push(`- Primeira planta: ${memory.firstPlantMentioned}`);
  if (memory.currentPlant) parts.push(`- Planta atual: ${memory.currentPlant}`);
  if (Array.isArray(memory.mentionedPlants) && memory.mentionedPlants.length > 0) {
    parts.push(`- Plantas mencionadas: ${memory.mentionedPlants.join(', ')}`);
  }
  if (memory.currentIntent) parts.push(`- Intenção atual: ${memory.currentIntent}`);
  if (parts.length === 0) return '';
  return `Memória da conversa:\n${parts.join('\n')}`;
}

export default {
  detectPlant,
  updateMemory,
  memoryToText,
};
