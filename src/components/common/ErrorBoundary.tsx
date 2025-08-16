import React from 'react';

interface ErrorBoundaryState { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		return { hasError: true, error };
	}

	componentDidCatch(error: any, info: any) {
		console.warn('ErrorBoundary caught error', error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-4 border rounded bg-red-50 text-red-700">
					<p className="font-semibold">Something went wrong.</p>
					<p className="text-sm">Please try again or contact support.</p>
				</div>
			);
		}
		return this.props.children;
	}
} 