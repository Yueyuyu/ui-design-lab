export function SectionHeader({ eyebrow, title, description, aside }) {
  return (
    <header className="gallery-section-header">
      <span>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <span className="gallery-section-header__description">{description}</span> : null}
      </span>
      {aside ? <aside>{aside}</aside> : null}
    </header>
  );
}

export function GalleryBlock({ eyebrow, title, description, children, className = "", id }) {
  return (
    <section className={`gallery-block ${className}`.trim()} id={id}>
      <header className="gallery-block__header">
        <span>
          {eyebrow ? <p>{eyebrow}</p> : null}
          <h2>{title}</h2>
        </span>
        {description ? <span>{description}</span> : null}
      </header>
      {children}
    </section>
  );
}
