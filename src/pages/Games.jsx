import React, { useEffect, useMemo, useState } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { fetchGames } from '../data/catalogApi';
import GamesHero from '../components/games/GamesHero';
import PlatformBanner from '../components/games/PlatformBanner';
import GameGrid from '../components/games/GameGrid';
import { useLang } from '../i18n';

const sorters = {
  featured: (a, b) => b.rating - a.rating,
  rating: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  discount: (a, b) => (b.old - b.price) - (a.old - a.price),
};

const Games = () => {
  const { t } = useLang();
  const [activePlatform, setActivePlatform] = useState('all');
  const [sort, setSort] = useState('featured');
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { games } = await fetchGames();
        if (!active) return;
        setCatalog(games);
        setError(false);
      } catch {
        if (!active) return;
        setError(true);
        setCatalog([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const counts = useMemo(() => {
    const map = {};
    catalog.forEach((g) => g.platforms.forEach((p) => {
      map[p] = (map[p] || 0) + 1;
    }));
    return map;
  }, [catalog]);

  const games = useMemo(() => {
    const list = catalog.filter(
      (g) => activePlatform === 'all' || g.platforms.includes(activePlatform)
    );
    return [...list].sort(sorters[sort]);
  }, [catalog, activePlatform, sort]);

  useEffect(() => {
    document.title = t('games.meta.title');
  }, [t]);

  // الصفحة طويلة وتُحمَّل بشكل كسول بعد إقلاع التطبيق؛ نعيد حساب مواضع
  // التمرير (خصوصاً حركات الفوتر) بعد تركيب المحتوى.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [catalog]);

  const handlePlatform = (key) => {
    setActivePlatform(key);
    setSort('featured');
    // عند اختيار منصة من البانر ننزل إلى الشبكة
    if (activePlatform !== key) {
      requestAnimationFrame(() => {
        const el = document.getElementById('games-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  return (
    <main className="bg-[#090909]">
      <GamesHero />
      <PlatformBanner active={activePlatform} counts={counts} onSelect={handlePlatform} />
      <GameGrid
        games={games}
        loading={loading}
        error={error}
        onRetry={retry}
        activePlatform={activePlatform}
        onPlatform={handlePlatform}
        sort={sort}
        onSort={setSort}
      />
    </main>
  );
};

export default Games;