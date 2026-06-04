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
  const navClassName = `${buildPrefixedClassName(
    prefix,
    "carousel__nav"
  )} game-button game-button--ghost game-icon-button`;
  const sideCardClassName = `${buildPrefixedClassName(
    prefix,
    "carousel-card"
  )} game-card game-card--interactive is-side`;
  const emptyCardClassName = `${buildPrefixedClassName(
    prefix,
    "carousel-card"
  )} game-card is-side is-empty`;

  return (
    <section
      className={buildPrefixedClassName(prefix, "carousel")}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={navClassName}
        onClick={onPrevious}
        disabled={disableNavigation}
        aria-label="Previous"
      >
        &lt;
      </button>

      <div className={buildPrefixedClassName(prefix, "carousel__track")}>
        {previousCard ? (
          <button
            type="button"
            className={sideCardClassName}
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
          <div className={emptyCardClassName} />
        )}

        {activeCard}

        {nextCard ? (
          <button
            type="button"
            className={sideCardClassName}
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
          <div className={emptyCardClassName} />
        )}
      </div>

      <button
        type="button"
        className={navClassName}
        onClick={onNext}
        disabled={disableNavigation}
        aria-label="Next"
      >
        &gt;
      </button>
    </section>
  );
}
