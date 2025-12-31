import * as React from 'react';
import clsx from 'clsx';

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  children,
  ...props
}) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue || '');
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as string) : uncontrolled;
  const setValue = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onValueChange?.(v);
  };
  React.useEffect(() => {
    if (!isControlled && defaultValue && uncontrolled === '') {
      setUncontrolled(defaultValue);
    }
  }, [defaultValue, isControlled, uncontrolled]);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div role="tablist" className={clsx('inline-flex rounded-lg p-1', className)} {...props} />
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return <button className={className} {...props}>{children}</button>;
  const selected = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={selected}
      data-state={selected ? 'active' : 'inactive'}
      className={clsx('px-3 py-1.5 rounded-md text-sm transition-colors', className)}
      onClick={(e) => {
        props.onClick?.(e);
        ctx.setValue(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...props }) => {
  const ctx = React.useContext(TabsContext);
  const selected = ctx ? ctx.value === value : false;
  return (
    <div role="tabpanel" hidden={!selected} className={className} {...props}>
      {selected ? children : null}
    </div>
  );
};

export default Tabs;
