export function PublicPageHeading({ id, title, description, className = '' }) {
  return <header className={`public-intro ${className}`.trim()}>
    <h1 id={id}>{title}</h1>
    <p>{description}</p>
  </header>;
}
