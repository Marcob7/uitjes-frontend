type RemoteImageOptions = {
  width?: number;
  quality?: number;
};

const DEFAULT_WIDTH = 960;
const DEFAULT_QUALITY = 60;
const WIKIMEDIA_PREFIX = "/wikipedia/commons/";

function normalizeOptions(options?: RemoteImageOptions) {
  return {
    width: options?.width ?? DEFAULT_WIDTH,
    quality: options?.quality ?? DEFAULT_QUALITY,
  };
}

function toUnsplashUrl(src: string, options?: RemoteImageOptions) {
  const { width, quality } = normalizeOptions(options);
  const url = new URL(src);

  if (url.hostname !== "images.unsplash.com") {
    return src;
  }

  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "webp");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality));

  return url.toString();
}

function toWikimediaThumbUrl(src: string, options?: RemoteImageOptions) {
  const { width } = normalizeOptions(options);
  const url = new URL(src);

  if (url.hostname !== "upload.wikimedia.org") {
    return src;
  }

  if (!url.pathname.startsWith(WIKIMEDIA_PREFIX)) {
    return src;
  }

  const parts = url.pathname.slice(WIKIMEDIA_PREFIX.length).split("/");

  if (parts[0] === "thumb" && parts.length >= 5) {
    const fileName = parts[parts.length - 2];
    parts[parts.length - 1] = `${width}px-${fileName}`;
    url.pathname = `${WIKIMEDIA_PREFIX}${parts.join("/")}`;
    url.search = "";
    return url.toString();
  }

  if (parts.length < 3) {
    return src;
  }

  const fileName = parts[parts.length - 1];
  const hashB = parts[parts.length - 2];
  const hashA = parts[parts.length - 3];

  url.pathname = `${WIKIMEDIA_PREFIX}thumb/${hashA}/${hashB}/${fileName}/${width}px-${fileName}`;
  url.search = "";

  return url.toString();
}

export function optimizeRemoteImageUrl(src: string, options?: RemoteImageOptions) {
  if (!src.startsWith("http")) {
    return src;
  }

  try {
    if (src.includes("images.unsplash.com")) {
      return toUnsplashUrl(src, options);
    }

    if (src.includes("upload.wikimedia.org")) {
      return toWikimediaThumbUrl(src, options);
    }
  } catch {
    return src;
  }

  return src;
}

export function optimizeCssBackground(value: string, options?: RemoteImageOptions) {
  const match = value.trim().match(/^url\((['"]?)(.*?)\1\)$/);
  const rawUrl = match ? match[2] : value;
  const optimizedUrl = optimizeRemoteImageUrl(rawUrl, options);

  return `url('${optimizedUrl}')`;
}
