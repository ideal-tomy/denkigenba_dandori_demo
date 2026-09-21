import { useDemo } from "../state/DemoStore";

export function AppHeader() {
  const { returnUrl } = useDemo();

  return (
    <header>
      <div className="wrap bar">
        <div className="brand">
          <span className="spark">⚡</span>
          現場ダンドリ
          <small>電気工事の段取り</small>
        </div>
        {returnUrl ? (
          <a className="back-selection is-on" href={returnUrl}>
            ← 紹介へ
          </a>
        ) : null}
      </div>
    </header>
  );
}
