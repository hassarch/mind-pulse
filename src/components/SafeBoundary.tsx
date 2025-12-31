import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

type State = { hasError: boolean };

export class SafeBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('Section crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Something went wrong rendering this section.
        </div>
      );
    }
    return this.props.children;
  }
}

export default SafeBoundary;
