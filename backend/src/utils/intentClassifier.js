const PLANT_KEYWORDS = {
  roseira: 'rosa',
  rosas: 'rosa',
  rosa: 'rosa',
  orquidea: 'orquidea',
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
  suculentas: 'suculenta',
  cactos: 'cacto',
  carnivora: 'planta carnivora',
  carnivoras: 'plantas carnivoras',
  alface: 'alface',
};

function normalizeText(message) {
  if (!message || typeof message !== 'string') return '';
  return message
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function detectPlant(message) {
  const text = normalizeText(message);
  for (const keyword of Object.keys(PLANT_KEYWORDS)) {
    if (text.includes(keyword)) {
      return PLANT_KEYWORDS[keyword];
    }
  }
  return null;
}

function detectIntent(message) {
  const text = normalizeText(message);

  if (
    text.includes('por que') ||
    text.includes('porque') ||
    text.includes('como funciona') ||
    text.includes('qual a funcao') ||
    text.includes('para que') ||
    text.includes('o que e') ||
    text.includes('porque')
  ) {
    return 'explanation';
  }

  if (
    text.includes('como cuidar') ||
    text.includes('cuidar de') ||
    text.includes('regar') ||
    text.includes('sol') ||
    text.includes('luz') ||
    text.includes('cultivar') ||
    text.includes('como plantar') ||
    text.includes('substrato') ||
    text.includes('vaso') ||
    text.includes('adubo') ||
    text.includes('fertilizante') ||
    text.includes('quais os cuidados')
  ) {
    return 'care';
  }

  if (
    text.includes('que planta') ||
    text.includes('que e essa') ||
    text.includes('que planta e essa') ||
    text.includes('identificar') ||
    text.includes('qual planta') ||
    text.includes('qual e essa planta')
  ) {
    return 'identification';
  }

  if (
    text.includes('amarela') ||
    text.includes('folhas amarelas') ||
    text.includes('manchas') ||
    text.includes('doente') ||
    text.includes('praga') ||
    text.includes('fungo') ||
    text.includes('apodrecendo') ||
    text.includes('murchando')
  ) {
    return 'disease';
  }

  if (
    (text.includes('quantas vezes') && text.includes('regar')) ||
    text.includes('quando regar') ||
    text.includes('regas') ||
    text.includes('regue') ||
    text.includes('frequencia de rega')
  ) {
    return 'watering';
  }

  if (
    text.includes('adubo') ||
    text.includes('fertilizante') ||
    text.includes('adubar') ||
    text.includes('nutrientes') ||
    text.includes('com que adubar')
  ) {
    return 'fertilization';
  }

  if (
    text.includes('toxica') ||
    text.includes('venenosa') ||
    text.includes('perigosa para') ||
    text.includes('gatos') ||
    text.includes('caes') ||
    text.includes('animais de estimacao')
  ) {
    return 'toxicity';
  }

  return 'general';
}

function buildPrompt(intent, userMessage, plant = null) {
  const plantHint = plant ? `Planta identificada: ${plant}.\n\n` : '';

  switch (intent) {
    case 'explanation':
      return `${plantHint}Voce e um especialista em botanica.\n\nO usuario quer uma EXPLICACAO cientifica e educativa.\n\nNAO de dicas de cultivo.\nNAO faca passo a passo de cuidados.\n\nUse secoes separadas com emojis e linhas horizontais para organizar a resposta.\nCada secao deve ter o titulo em negrito no topo e o texto explicativo na linha seguinte.\nExemplo: **📘 Por que isso acontece?**\n\nAs plantas carnívoras vivem...\n\nPergunta:\n"${userMessage}"\n`;

    case 'care':
      return `${plantHint}Voce e um especialista em jardinagem.\n\nO usuario quer dicas praticas de cultivo e cuidados.\n\nForneca secoes separadas com emojis e divisores visuais.\nUse topicos em negrito como **☀️ Luz**, **💧 Rega**, **🌱 Solo**, **🪴 Adubacao**.\n\nPergunta:\n"${userMessage}"\n`;

    case 'identification':
      return `${plantHint}Voce e um especialista em botanica.\n\nO usuario quer ajudar a identificar uma planta ou um problema visual.\n\nResponda com perguntas ou descricoes que ajudem na identificacao e sugira como confirmar a planta.\n\nPergunta:\n"${userMessage}"\n`;

    case 'disease':
      return `${plantHint}Voce e um especialista em fitopatologia.\n\nO usuario esta perguntando sobre sintomas de doenca ou problema na planta.\n\nExplique possiveis causas e indique sinais para confirmar, sem prescrever tratamentos medicos.\n\nPergunta:\n"${userMessage}"\n`;

    case 'watering':
      return `${plantHint}Voce e um especialista em rega de plantas.\n\nO usuario quer saber sobre rega e frequencia de irrigacao.\n\nExplique a melhor rotina de rega, sinais de excesso e falta de agua.\n\nPergunta:\n"${userMessage}"\n`;

    case 'fertilization':
      return `${plantHint}Voce e um especialista em adubacao.\n\nO usuario quer saber sobre adubo, nutrientes ou fertilizacao.\n\nExplique qual tipo de adubo e mais indicado, periodicidade e sinais de deficiencia.\n\nPergunta:\n"${userMessage}"\n`;

    case 'toxicity':
      return `${plantHint}Voce e um especialista em toxicidade de plantas.\n\nO usuario quer saber se a planta e toxica ou perigosa para pets.\n\nExplique o risco e ofereca alternativas seguras de manejo.\n\nPergunta:\n"${userMessage}"\n`;

    default:
      return `${plantHint}Voce e um especialista em botanica.\n\nResponda de forma clara e objetiva.\n\nPergunta:\n"${userMessage}"\n`;
  }
}

module.exports = {
  detectIntent,
  detectPlant,
  buildPrompt,
};





