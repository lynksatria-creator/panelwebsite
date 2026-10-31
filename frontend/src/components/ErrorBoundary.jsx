import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center font-sans bg-background text-foreground">
          <div>
            <p className="font-serif text-3xl">Oops, terjadi kesalahan.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Muat ulang halaman untuk mencoba lagi.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
