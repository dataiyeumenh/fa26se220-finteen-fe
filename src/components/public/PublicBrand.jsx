import { Link } from "react-router-dom";

export function PublicBrand() {
  return (
    <Link to="/" className="ft-brand" aria-label="FinTeen — Trang chủ">
      <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" />
    </Link>
  );
}
