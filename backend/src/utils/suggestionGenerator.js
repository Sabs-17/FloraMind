// Sistema inteligente de geração de sugestões dinâmicas baseado no contexto

const CONTEXT_PATTERNS = {
  watering: {
    keywords: ['regar', 'água', 'umidade', 'seco', 'molhado', 'frequência', 'rega'],
    suggestions: [
      (plant) => `🌡️ Como medir a umidade do solo de ${plant || 'forma correta'}`,
      (plant) => `🧴 Qual água é melhor para regar ${plant || 'minha planta'}`,
      (plant) => `📅 Rega em diferentes estações para ${plant || 'esta planta'}`,
      (plant) => `⚠️ Sinais de excesso de água em ${plant || 'plantas'}`,
    ]
  },
  lighting: {
    keywords: ['luz', 'sol', 'sombra', 'penumbra', 'claridade', 'escuro', 'exposto'],
    suggestions: [
      (plant) => `☀️ Horas de luz ideal para ${plant || 'esta planta'}`,
      (plant) => `🪟 Como adaptar ${plant || 'minha planta'} a diferentes ambientes`,
      (plant) => `💡 Sinais de pouca/muita luz em ${plant || 'plantas'}`,
      (plant) => `📍 Melhor posição pra ${plant || 'sua planta'} na casa`,
    ]
  },
  soil: {
    keywords: ['substrato', 'solo', 'terra', 'composto', 'drenagem', 'pH', 'acidez'],
    suggestions: [
      (plant) => `🌱 Melhor proporção de substrato para ${plant || 'esta planta'}`,
      (plant) => `♻️ Como renovar o solo sem danificar ${plant || 'a planta'}`,
      (plant) => `🪴 Qual vaso usar com qual substrato para ${plant || 'seu cultivo'}`,
      (plant) => `🔄 Frequência de troca de substrato em ${plant || 'plantas internas'}`,
    ]
  },
  fertilization: {
    keywords: ['adubo', 'fertilizante', 'nutriente', 'NPK', 'deficiência', 'adubação'],
    suggestions: [
      (plant) => `📊 Dosagem correta de adubo para ${plant || 'sua planta'}`,
      (plant) => `🌙 Melhor época para adubar ${plant || 'durante o ano'}`,
      (plant) => `🧪 Sinais de deficiência nutricional em ${plant || 'plantas'}`,
      (plant) => `♻️ Adubos orgânicos caseiros para ${plant || 'cultivo responsável'}`,
    ]
  },
  disease: {
    keywords: ['praga', 'doença', 'fungos', 'bactéria', 'vírus', 'cochinilha', 'afídeo', 'amarelada', 'manchas', 'podridão'],
    suggestions: [
      (plant) => `🔬 Como confirmar se é praga ou doença em ${plant || 'sua planta'}`,
      (plant) => `🧴 Produtos naturais para tratar ${plant || 'plantas infestadas'}`,
      (plant) => `🔪 Quando e como podar partes afetadas de ${plant || 'sua planta'}}`,
      (plant) => `🛡️ Como prevenir futuras pragas em ${plant || 'seu jardim'}}`,
    ]
  },
  propagation: {
    keywords: ['propagar', 'muda', 'estaca', 'semear', 'reproduzir', 'clone', 'multiplicar'],
    suggestions: [
      (plant) => `🌱 Melhor método de propagação para ${plant || 'esta planta'}`,
      (plant) => `⏱️ Quanto tempo leva até ter uma nova ${plant || 'planta adulta'}}`,
      (plant) => `💧 Cuidados especiais com mudas de ${plant || 'novas plantas'}}`,
      (plant) => `🪴 Como montar estação de propagação para ${plant || 'suas mudas'}}`,
    ]
  },
  identification: {
    keywords: ['identificar', 'que planta', 'qual é', 'reconhecer', 'nome'],
    suggestions: [
      (plant) => `📸 Características principais para reconhecer ${plant || 'essa espécie'}`,
      (plant) => `🌼 Diferença entre variedades de ${plant || 'esta planta'}`,
      (plant) => `🔍 Como fotografar para identificar plantas desconhecidas`,
      (plant) => `📚 Plantas similares a ${plant || 'esta que você encontrou'}}`,
    ]
  },
  toxicity: {
    keywords: ['tóxica', 'venenosa', 'perigosa', 'pet', 'gato', 'cachorro', 'segurança', 'criança'],
    suggestions: [
      (plant) => `⚠️ Sintomas se um pet ingerir ${plant || 'esta planta'}}`,
      (plant) => `🐾 Plantas seguras como alternativa a ${plant || 'esta espécie'}}`,
      (plant) => `🚫 Onde guardar ${plant || 'plantas tóxicas'}} com segurança`,
      (plant) => `🆘 O que fazer em caso de intoxicação`,
    ]
  },
  general_care: {
    keywords: ['cuidado', 'como cuidar', 'dica', 'rotina', 'manutenção'],
    suggestions: [
      (plant) => `📋 Checklist mensal de cuidados para ${plant || 'sua planta'}}`,
      (plant) => `🔄 Quando fazer limpeza das folhas de ${plant || 'plantas internas'}}`,
      (plant) => `✂️ Técnicas corretas de poda para ${plant || 'seu cultivo'}}`,
      (plant) => `🪴 Como fazer replantio de ${plant || 'sua planta'}} sem estressar`,
    ]
  }
};

function detectContextPatterns(responseText) {
  const lowerResponse = responseText.toLowerCase();
  const detectedPatterns = [];

  for (const [context, data] of Object.entries(CONTEXT_PATTERNS)) {
    const matchCount = data.keywords.filter(keyword =>
      lowerResponse.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > 0) {
      detectedPatterns.push({ context, matchCount, suggestions: data.suggestions });
    }
  }

  // Sort by match count (most relevant first)
  return detectedPatterns.sort((a, b) => b.matchCount - a.matchCount);
}

function generateDynamicSuggestions(responseText, intent, plant = null, historyLength = 0) {
  const patterns = detectContextPatterns(responseText);
  const suggestions = [];

  // Get suggestions from detected patterns
  if (patterns.length > 0) {
    // Primary pattern
    const primaryPattern = patterns[0].suggestions;
    suggestions.push(primaryPattern[historyLength % primaryPattern.length](plant));

    // Secondary patterns if available
    if (patterns.length > 1) {
      const secondaryPattern = patterns[1].suggestions;
      suggestions.push(secondaryPattern[(historyLength + 1) % secondaryPattern.length](plant));
    }

    // Add variety by using different indices based on plant
    if (patterns.length > 2) {
      const tertiaryPattern = patterns[2].suggestions;
      suggestions.push(tertiaryPattern[(historyLength + 2) % tertiaryPattern.length](plant));
    }
  }

  // If no patterns detected or need more suggestions, use intent-based
  if (suggestions.length < 3) {
    const intentSuggestions = {
      explanation: [
        (plant) => `📚 Aprofunde em características de ${plant || 'esta planta'}`,
        (plant) => `🔬 Processo biológico por trás do problema em ${plant || 'plantas'}}`,
        (plant) => `🧬 Adaptações naturais de ${plant || 'esta espécie'}}`,
      ],
      care: [
        (plant) => `📋 Calendário anual de cuidados para ${plant || 'sua planta'}}`,
        (plant) => `🛠️ Ferramentas essenciais para cuidar de ${plant || 'plantas'}}`,
        (plant) => `💪 Como fortalecer ${plant || 'uma planta'}} fraca`,
      ],
      disease: [
        (plant) => `🧪 Teste caseiro para confirmar o problema em ${plant || 'sua planta'}}`,
        (plant) => `📖 Guia completo de pragas comuns em ${plant || 'plantas internas'}}`,
      ],
    };

    const fallback = intentSuggestions[intent] || [];
    for (let i = suggestions.length; i < 3 && i < 4; i++) {
      if (fallback[i % fallback.length]) {
        suggestions.push(fallback[i % fallback.length](plant));
      }
    }
  }

  // Remove duplicates and limit to 4
  const uniqueSuggestions = [...new Set(suggestions)].slice(0, 4);
  return uniqueSuggestions;
}

function filterSuggestions(suggestions, userText) {
  const normalizeForCompare = (t) =>
    String(t || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s]/gi, '')
      .trim();

  const normalizedUser = normalizeForCompare(userText);

  return suggestions
    .filter((s) => {
      if (!normalizeForCompare(s)) return false;
      const n = normalizeForCompare(s);
      // Avoid suggesting exactly what the user asked
      return !(normalizedUser && (n === normalizedUser || n.includes(normalizedUser) || normalizedUser.includes(n)));
    })
    .slice(0, 4);
}

module.exports = {
  generateDynamicSuggestions,
  filterSuggestions,
  detectContextPatterns,
};
