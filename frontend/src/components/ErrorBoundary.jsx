import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for debugging; could be sent to a logging endpoint
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl rounded-xl border bg-white p-6 text-center shadow">
            <h2 className="mb-2 text-lg font-semibold">Algo deu errado</h2>
            <p className="mb-4 text-sm">A aplicação encontrou um erro ao renderizar. Abra o console do navegador para mais detalhes.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-blush px-4 py-2 text-white"
              >
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
