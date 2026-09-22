export function PulseIcon({ name, ...props }) {
  const paths = {
    grip: <><path d="M6 4v.01M6 8v.01M6 12v.01M10 4v.01M10 8v.01M10 12v.01" strokeWidth="2.5" /></>,
    chevron: <path d="m6 4 4 4-4 4" />,
    close: <path d="m4 4 8 8M12 4l-8 8" />,
    pin: <><path d="m6 2 6 2-2 3 1 3-3-1-3 2-1-3 3-2zM5 11l-3 3" /></>,
    star: <path d="m8 2 1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 13l.7-4-2.9-2.8 4-.6z" />,
    check: <path d="m3.5 8 3 3 6-6" />,
    attention: <><path d="M8 3v6M8 12v.1" /></>,
    running: <><path d="M8 3a5 5 0 1 1-5 5" /><path d="M8 5v3l2 1" /></>,
    unavailable: <path d="M4 8h8" />,
    dock: <><rect x="2.5" y="3" width="11" height="10" rx="2"/><path d="M10 3v10" /></>,
    arrow: <><path d="M4 12 12 4M5 4h7v7" /></>
  };
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.unavailable}</svg>;
}
