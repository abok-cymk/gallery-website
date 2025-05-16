import { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-8">
                    <h2 className="text-2xl/6 font-bold text-red-600">Something went wrong</h2>
                    <p>Please try refreshing the page or contact support.</p>
                </div>
            );
        }
        return this.props.children;
    }

}

export default ErrorBoundary;