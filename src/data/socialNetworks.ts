export interface SocialNetworkData {
	id: string;
	qrImage: string;
	username: string;
	title?: string;
	usernameFontSize?: number;
	link: string;
	label: string;
}

export type SocialNetworkOption = 'tiktok' | 'telegram-en' | 'telegram-ru';

export const socialNetworksData: Record<SocialNetworkOption, SocialNetworkData> = {
	tiktok: {
		id: 'qr-modal-tiktok',
		qrImage: '/images/tiktok.png',
		username: '@tonybrickstitch',
		title: 'TonyBrickStitch',
		link: 'https://www.tiktok.com/@tonybrickstitch',
		label: 'TonyBrickStitch on TikTok',
	},
	'telegram-en': {
		id: 'qr-modal-telegram-en',
		qrImage: '/images/telegram-en.jpg',
		username: '@TonyBrickStitch',
		usernameFontSize: 22,
		link: 'https://t.me/TonyBrickStitch',
		label: 'TonyBrickStitch’s Telegram Channel',
	},
	'telegram-ru': {
		id: 'qr-modal-telegram-ru',
		qrImage: '/images/telegram-ru.jpg',
		username: '@TonyBrickStitchRu',
		usernameFontSize: 20,
		link: 'https://t.me/TonyBrickStitchRu',
		label: 'Телеграм канал TonyBrickStitch',
	},
};
