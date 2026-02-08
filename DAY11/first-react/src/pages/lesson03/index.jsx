import { Routes, Route, Navigate, Link } from 'react-router';
import styles from './lesson03.module.css';

// 子頁面元件（稍後建立）
import ThemeExample from './pages/ThemeExample';
import MenuExample from './pages/MenuExample/inedx';
import TodoExample from './pages/TodoExample';

export default function Lesson03() {
  return (
    <div className={styles.lesson03_container}>
      {/* 內部導航列 */}
      <nav className={styles.lesson03_nav}>
        <h2>📚 Context & Reducer 範例</h2>
        <div className={styles.nav_links}>
          <Link to="/lesson03/theme" className={styles.nav_link}>🎨 主題切換</Link>
          <Link to="/lesson03/menu" className={styles.nav_link}>📑 巢狀選單</Link>
          <Link to="/lesson03/todo" className={styles.nav_link}>Todo List</Link>
        </div>
      </nav>

      {/* 子頁面渲染區域 */}
      <div className={styles.lesson03_content}>
        <Routes>
          <Route index element={<Navigate to="theme" replace />} />
          <Route path="theme" element={<ThemeExample />} />
          <Route path="menu" element={<MenuExample />} />
          <Route path="todo" element={<TodoExample />} />
        </Routes>
      </div>
    </div>
  );
}
