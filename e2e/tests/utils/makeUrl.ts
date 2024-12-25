export function createMakeUrl(storyId: string) {
	const baseUrl = `http://localhost:6006/iframe.html?id=${storyId}`;

	return (args: Record<string, string | undefined>) => {
		const argPairs = Object.entries(args).filter(
			([_, value]) => value !== undefined,
		);

		if (argPairs.length === 0) {
			return baseUrl;
		}

		const argsStr = argPairs.map(([key, value]) => `${key}:${value}`).join(";");

		return `${baseUrl}&args=${encodeURIComponent(argsStr)}`;
	};
}
