// Card genérico con header y footer
export function Card({ header, footer, children, className = "", ...props }) {
  return (
    <div
      role={header || footer ? "dialog" : undefined}
      aria-modal={header || footer ? "true" : undefined}
      className={`bg-white rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {header && <div className="border-b px-6 py-4">{header}</div>}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="border-t px-6 py-4 text-right">{footer}</div>}
    </div>
  );
}
  
  