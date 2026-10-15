"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CampaignHero.module.css";

const VIDEO_SRC = "/campaign/campaign-video.mp4";
const POSTER_SRC = "/campaign/campaign-poster.jpg";
const PRODUCTS_PATH = "/products";

export function CampaignHero() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  // 움직임 줄이기 / 데이터 절약 모드에서는 영상 없이 사진만 보여줍니다.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setShowVideo(!reduceMotion && !saveData);
  }, []);

  // 헤더 높이 변수가 없을 때를 대비해, 히어로가 시작하는 위치를 재서 헤더 아래 화면에 딱 맞춥니다.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const measure = () => hero.style.setProperty("--hero-top", `${hero.getBoundingClientRect().top + window.scrollY}px`);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // 마우스 위치를 CSS 변수로 넘기면, CSS가 가이드선을 움직입니다.
  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - top}px`);
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`${PRODUCTS_PATH}?q=${encodeURIComponent(q)}`);
  }

  return (
    <main ref={heroRef} className={styles.campaign} aria-label="ONEPIECE 캠페인" onPointerMove={handlePointerMove}>
      {/* 사진은 항상 깔아 두고, 영상이 재생되지 않을 때도 사진이 보입니다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.media} src={POSTER_SRC} alt="강변 건축물을 배경으로 검은 의상을 착용한 ONEPIECE 캠페인 모델" fetchPriority="high" />
      {showVideo && (
        <video
          className={styles.media}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setShowVideo(false)}
        />
      )}
      <div className={styles.shade} aria-hidden="true" />
      <a className={styles.modelLink} href={PRODUCTS_PATH} aria-label="캠페인 상품 보기" />
      <section className={styles.discovery} aria-labelledby="brand-title">
        <h1 id="brand-title">ONEPIECE</h1>
        {/* 검색창 폭은 이 묶음(= 슬로건 폭)의 2/3 입니다. */}
        <div className={styles.sloganBox}>
          <p className={styles.slogan}>ONE-PIECE is Master-piece.</p>
          <form className={styles.search} role="search" onSubmit={handleSearch}>
            <input aria-label="상품 검색" type="search" name="q" maxLength={100} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} required />
            <button type="submit" aria-label="검색">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
            </button>
          </form>
        </div>
      </section>
      <div className={styles.crosslines} aria-hidden="true">
        <div className={styles.horizontal} />
        <div className={styles.vertical} />
      </div>
    </main>
  );
}
