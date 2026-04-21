import type { ReactNode } from "react";
import { buildPrefixedClassName } from "./characterRosterShared";

type SideCard = {
  name: string;
  meta: string;
  onSelect?: () => void;
};

type CharacterCenteredCarouselProps = {
  prefix: string;
  ariaLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  previousCard: SideCard | null;
  nextCard: SideCard | null;
  activeCard: ReactNode;
  disableNavigation?: boolean;
};

export default function CharacterCenteredCarousel({
  prefix,
  ariaLabel,
  onPrevious,
  onNext,
  previousCard,
  nextCard,
  activeCard,
  disableNavigation = false,
}: CharacterCenteredCarouselProps) {
  return (
    <section
      className={buildPrefixedClassName(prefix, "carousel")}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={buildPrefixedClassName(prefix, "carousel__nav")}
        onClick={onPrevious}
        disabled={disableNavigation}
        aria-label="Previous"
      >
        ‹
      </button>

      <div className={buildPrefixedClassName(prefix, "carousel__track")}>
        {previousCard ? (
          <button
            type="button"
            className={`${buildPrefixedClassName(prefix, "carousel-card")} is-side`}
            onClick={previousCard.onSelect}
          >
            <span className={buildPrefixedClassName(prefix, "carousel-card__name")}>
              {previousCard.name}
            </span>
            <span className={buildPrefixedClassName(prefix, "carousel-card__meta")}>
              {previousCard.meta}
            </span>
          </button>
        ) : (
          <div
            className={`${buildPrefixedClassName(prefix, "carousel-card")} is-side is-empty`}
          />
        )}

        {activeCard}

        {nextCard ? (
          <button
            type="button"
            className={`${buildPrefixedClassName(prefix, "carousel-card")} is-side`}
            onClick={nextCard.onSelect}
          >
            <span className={buildPrefixedClassName(prefix, "carousel-card__name")}>
              {nextCard.name}
            </span>
            <span className={buildPrefixedClassName(prefix, "carousel-card__meta")}>
              {nextCard.meta}
            </span>
          </button>
        ) : (
          <div
            className={`${buildPrefixedClassName(prefix, "carousel-card")} is-side is-empty`}
          />
        )}
      </div>

      <button
        type="button"
        className={buildPrefixedClassName(prefix, "carousel__nav")}
        onClick={onNext}
        disabled={disableNavigation}
        aria-label="Next"
      >
        ›
      </button>
    </section>
  );
}
