import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function vw(percentage: number): number {
	return (SCREEN_WIDTH * percentage) / 100;
}

export function vh(percentage: number): number {
	return (SCREEN_HEIGHT * percentage) / 100;
}

export function scale(size: number, baseWidth: number = 375): number {
	return Math.round((SCREEN_WIDTH / baseWidth) * size);
}

export function font(size: number): number {
	return Math.round(size * PixelRatio.getFontScale());
}

export function isTallAspect(): boolean {
	const aspect = SCREEN_HEIGHT / SCREEN_WIDTH;
	return aspect > 2; // условно сверхвысокие экраны (20:9 и т.п.)
}

export function isTablet(): boolean {
	const minDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
	return minDimension >= 768;
}