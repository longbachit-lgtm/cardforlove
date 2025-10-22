import { useEffect, useMemo, useState } from "react";

/** Parse ID từ các dạng link YouTube phổ biến */
function parseYouTubeId(url = "") {
  try {
    // chấp nhận cả raw ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.split("/")[1] || "";
    }
    if (u.hostname.includes("youtube.com")) {
      // dạng watch?v=ID
      const v = u.searchParams.get("v");
      if (v) return v;
      // dạng /embed/ID
      const parts = u.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      // dạng /shorts/ID
      const sIdx = parts.findIndex((p) => p === "shorts");
      if (sIdx >= 0 && parts[sIdx + 1]) return parts[sIdx + 1];
    }
  } catch (_) {}
  return "";
}

export default function YouTubePreview({ value, onChange, readOnly = false }) {
  const [url, setUrl] = useState(value || "");
  const [playing, setPlaying] = useState(false);

  useEffect(() => setUrl(value || ""), [value]);

  const videoId = useMemo(() => parseYouTubeId(url), [url]);
  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  const handleInput = (e) => {
    if (readOnly) return;
    const val = e.target.value;
    setUrl(val);
    onChange?.(val); // đẩy lên formData (url gốc bạn dán)
  };

  const handlePlay = () => {
    if (!videoId) return;
    setPlaying(true);
  };

  const handleClear = () => {
    if (readOnly) return;
    setPlaying(false);
    setUrl("");
    onChange?.("");
  };

  return (
    <div className="card border-0 shadow-sm p-3 rounded-4">
      {!readOnly && <label className="form-label fw-semibold mb-2">YouTube URL</label>}
      {!readOnly && (
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Dán link YouTube, ví dụ: https://youtu.be/XXXXXXXXXXX"
            value={url}
            onChange={handleInput}
          />
          {url && (
            <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
              Xóa
            </button>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="mt-3">
        {!videoId ? (
          <small className="text-muted">Chưa nhận diện được video. Hãy kiểm tra lại URL.</small>
        ) : !playing ? (
          <div
            className="position-relative rounded-3 overflow-hidden"
            style={{ aspectRatio: "16 / 9", cursor: "pointer" }}
            onClick={handlePlay}
            role="button"
          >
            <img
              src={thumb}
              alt="YouTube thumbnail"
              className="w-100 h-100 object-fit-cover"
              style={{ objectFit: "cover" }}
            />
            <div
              className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 72,
                height: 72,
                background: "rgba(0,0,0,0.55)",
                border: "2px solid #fff",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
