import ThemedButton from './ThemedButton';

export default function Toolbar() {
  return (
    <div className="toolbar">
      <h3>🛠️ Toolbar 元件（中間層）</h3>
      <p className="note">這個元件不需要知道 theme 的存在</p>
      <ThemedButton />
    </div>
  );
}