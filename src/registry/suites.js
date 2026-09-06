const manifestModules = import.meta.glob("../../systems/*/suite.json", {
  eager: true,
  import: "default"
});

const showcaseLoaders = import.meta.glob("../../systems/*/showcase/index.jsx");
const coverLoaders = import.meta.glob("../../systems/*/cover/index.jsx");
const comparisonLoaders = import.meta.glob("../../systems/*/comparison/index.jsx");

const referenceImages = import.meta.glob("../../references/*-source.png", {
  eager: true,
  query: "?url",
  import: "default"
});
const thumbnails = import.meta.glob("../../references/thumbnails/*.{webp,png}", { eager: true, query: "?url", import: "default" });

function resolveSuiteId(path) {
  return path.match(/systems\/([^/]+)\/suite\.json$/)?.[1];
}

function resolveReferenceImage(referencePath) {
  if (!referencePath) {
    return null;
  }

  const normalized = referencePath.replaceAll("\\", "/");
  const entry = Object.entries(referenceImages).find(([path]) => path.endsWith(`/${normalized}`));
  return entry?.[1] ?? null;
}

export const suites = Object.entries(manifestModules)
  .map(([manifestPath, manifest]) => {
    const id = resolveSuiteId(manifestPath);
    const showcasePath = `../../systems/${id}/showcase/index.jsx`;
    return {
      ...manifest,
      id,
      referenceImageUrl: resolveReferenceImage(manifest.referenceImage),
      thumbnailUrl: thumbnails[`../../${manifest.selection?.thumbnail}`] ?? null,
      loadShowcase: showcaseLoaders[showcasePath],
      loadCover: coverLoaders["../../systems/"+id+"/cover/index.jsx"],
      loadComparison: manifest.comparison ? comparisonLoaders[`../../systems/${id}/comparison/index.jsx`] : null
    };
  })
  .sort((left, right) => left.order - right.order || left.displayName.localeCompare(right.displayName));

export function getSuiteById(id) {
  return suites.find((suite) => suite.id === id) ?? null;
}
