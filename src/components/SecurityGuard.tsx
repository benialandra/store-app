'use client'

import { useEffect } from 'react'

export default function SecurityGuard() {
  useEffect(() => {
    // 1. Blokir Klik Kanan (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Blokir Tombol Keyboard (Inspect Element, View Source, Save)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C / Cmd+Option+C (Element Inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
      
      // Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
      
      // Ctrl+S / Cmd+S (Save Webpage)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // 3. Matikan / Timpa Console (Agar blank jika mereka berhasil buka lewat menu browser)
    if (typeof window !== 'undefined') {
      // Simpan console log asli jika sewaktu-waktu dibutuhkan (bisa dihapus nanti)
      const originalLog = console.log;
      
      // Timpa semua fungsi console
      console.log = function() {};
      console.warn = function() {};
      console.error = function() {};
      console.info = function() {};
      console.debug = function() {};
      console.trace = function() {};
      
      // Berikan peringatan keras bagi yang berhasil masuk
      setTimeout(() => {
        originalLog.apply(console, ["%cBERHENTI!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000; font-family: sans-serif;"]);
        originalLog.apply(console, ["%cArea ini ditujukan untuk pengembang. Mencoba meretas atau menyalin aset dari situs ini direkam secara otomatis oleh sistem keamanan.", "font-size: 18px; color: #333;"]);
      }, 100);
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Tidak merender UI apapun
  return null;
}
