import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CarConfig } from "./config/car.config";
import { carConfig } from "./config/car.config";

/**
 * "Coche de la semana" — ficha vertical animada de un vehículo, con la
 * identidad de Automarket Durango. 100% editable desde car.config.ts.
 */
export const AutomarketCar: React.FC<{ config?: CarConfig }> = ({
  config = carConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand, photo, badge, model, details, price, specs, cta } = config;
  const c = brand.colors;

  const enter = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });

  // Ken Burns sobre la foto.
  const zoom = interpolate(frame, [0, config.durationInSeconds * fps], [1.06, 1.16]);

  const badgeIn = enter(6);
  const modelIn = enter(12);
  const detailsIn = enter(18);
  const priceIn = enter(24);
  const specsIn = enter(32);
  const ctaIn = enter(42);
  const ctaPulse = 1 + Math.sin(frame / 18) * 0.02;

  return (
    <AbsoluteFill
      style={{ backgroundColor: c.background, fontFamily: brand.fontFamily }}
    >
      {/* ── Foto (60% superior) ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, height: "62%", overflow: "hidden" }}>
        {photo ? (
          <Img
            src={staticFile(photo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`,
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              background: `radial-gradient(60% 60% at 50% 40%, ${c.primary}55, ${c.background})`,
            }}
            className="items-center justify-center"
          >
            <span style={{ fontSize: 240 }}>🚗</span>
            <p className="mt-4 text-4xl font-semibold text-white/60">
              Añade tu foto en public/cars/
            </p>
          </AbsoluteFill>
        )}
        {/* Degradado que funde la foto con la tarjeta. */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, transparent 45%, ${c.background} 98%)`,
          }}
        />
      </div>

      {/* ── Ficha (parte inferior) ──────────────────────────────────────── */}
      <div
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "46%" }}
        className="flex flex-col items-center px-14 text-center"
      >
        {/* Badge de marca. */}
        <div
          style={{
            opacity: badgeIn,
            transform: `translateY(${(1 - badgeIn) * 24}px)`,
            backgroundColor: c.primary,
          }}
          className="mb-6 rounded-full px-8 py-3 text-3xl font-extrabold uppercase tracking-[0.16em] text-white"
        >
          {badge}
        </div>

        {/* Modelo. */}
        <h1
          style={{
            opacity: modelIn,
            transform: `translateY(${(1 - modelIn) * 30}px)`,
            color: c.text,
          }}
          className="text-[92px] font-black leading-[0.95] tracking-tight"
        >
          {model}
        </h1>

        {/* Detalles. */}
        <p
          style={{
            opacity: detailsIn,
            transform: `translateY(${(1 - detailsIn) * 20}px)`,
            color: c.muted,
          }}
          className="mt-3 text-4xl font-medium"
        >
          {details}
        </p>

        {/* Precio. */}
        <div
          style={{
            opacity: priceIn,
            transform: `translateY(${(1 - priceIn) * 22}px) scale(${interpolate(priceIn, [0, 1], [0.9, 1])})`,
          }}
          className="mt-7 flex items-baseline gap-4"
        >
          <span
            style={{ color: c.muted }}
            className="text-3xl font-bold uppercase tracking-widest"
          >
            Desde
          </span>
          <span
            style={{ color: c.accent === c.primary ? "#FCB900" : c.accent }}
            className="text-[108px] font-black leading-none tracking-tight"
          >
            {price}
          </span>
        </div>

        {/* Chips de specs. */}
        <div
          style={{ opacity: specsIn }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {specs.map((s, i) => (
            <span
              key={i}
              style={{
                backgroundColor: c.surface,
                borderColor: `${c.text}22`,
                color: c.text,
                transform: `translateY(${(1 - specsIn) * 16}px)`,
              }}
              className="rounded-full border px-6 py-3 text-3xl font-semibold"
            >
              {s}
            </span>
          ))}
        </div>

        {/* CTA. */}
        <div
          style={{
            opacity: ctaIn,
            transform: `translateY(${(1 - ctaIn) * 20}px) scale(${ctaPulse})`,
            backgroundColor: c.primary,
          }}
          className="mt-auto mb-16 rounded-full px-12 py-6 text-5xl font-extrabold text-white"
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
