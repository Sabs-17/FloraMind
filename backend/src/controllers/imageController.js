const axios = require('axios');

const PEXELS_KEY = process.env.PEXELS_API_KEY;

const searchImages = async (req, res) => {
  const query = req.query.query;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'O parâmetro query é obrigatório.' });
  }

  if (!PEXELS_KEY) {
    return res.status(500).json({ error: 'PEXELS_API_KEY não configurada.' });
  }

  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        Authorization: PEXELS_KEY,
      },
      params: {
        query: query.trim(),
        per_page: 5,
        page: 1,
      },
      timeout: 15000,
    });

    const photos = Array.isArray(response.data?.photos) ? response.data.photos : [];
    const images = photos
      .map((photo) => ({
        id: photo.id,
        url: photo.src?.medium || photo.src?.large2x || photo.src?.original,
        alt: photo.alt || query.trim(),
      }))
      .filter((item) => item.url);

    console.debug('[Pexels] query:', query, 'imagesEncontradas:', images.length);
    return res.json({ images });
  } catch (error) {
    console.error('Erro ao buscar imagem no Pexels:', error.response?.data || error.message || error);

    let detail = error.response?.data || error.message || 'Erro desconhecido ao buscar imagem.';
    if (typeof detail !== 'string') {
      try {
        detail = JSON.stringify(detail);
      } catch {
        detail = String(detail);
      }
    }

    return res.status(500).json({
      error: 'Não foi possível buscar imagem no Pexels.',
      detail,
    });
  }
};

module.exports = { searchImages };
