// Icon definitions for the application

import { 
  Heart, Sparkles, Gift, Star, Flower, Bird, Rainbow, Sun, Moon, Cherry, 
  Zap, PartyPopper, Candy, IceCream, Camera, Music, Palette, Feather, 
  Leaf, Cloud, Coffee, Wine, Trophy, Medal, Rocket, Crown, Smile 
} from 'lucide-react';
import type { IconData } from '../types/app';

export const CUTE_ICONS: IconData[] = [
  { icon: Heart, color: "text-pink-500", name: 'Heart' },
  { icon: Flower, color: "text-pink-400", name: 'Flower' },
  { icon: Bird, color: "text-purple-400", name: 'Bird' },
  { icon: Rainbow, color: "text-purple-500", name: 'Rainbow' },
  { icon: Sun, color: "text-yellow-400", name: 'Sun' },
  { icon: Moon, color: "text-blue-400", name: 'Moon' },
  { icon: Cherry, color: "text-red-400", name: 'Cherry' },
  { icon: Star, color: "text-yellow-300", name: 'Star' },
  { icon: Sparkles, color: "text-pink-300", name: 'Sparkles' },
  { icon: Gift, color: "text-rose-400", name: 'Gift' },
  { icon: Zap, color: "text-pink-400", name: 'Zap' },
  { icon: PartyPopper, color: "text-rose-400", name: 'PartyPopper' },
  { icon: Candy, color: "text-pink-500", name: 'Candy' },
  { icon: IceCream, color: "text-pink-400", name: 'IceCream' },
  { icon: Camera, color: "text-purple-400", name: 'Camera' },
  { icon: Music, color: "text-blue-400", name: 'Music' },
  { icon: Palette, color: "text-rose-400", name: 'Palette' },
  { icon: Feather, color: "text-pink-500", name: 'Feather' },
  { icon: Leaf, color: "text-green-500", name: 'Leaf' },
  { icon: Cloud, color: "text-sky-400", name: 'Cloud' },
  { icon: Coffee, color: "text-amber-600", name: 'Coffee' },
  { icon: Wine, color: "text-red-500", name: 'Wine' },
  { icon: Trophy, color: "text-yellow-500", name: 'Trophy' },
  { icon: Medal, color: "text-yellow-500", name: 'Medal' },
  { icon: Rocket, color: "text-indigo-500", name: 'Rocket' },
  { icon: Crown, color: "text-yellow-500", name: 'Crown' },
  { icon: Smile, color: "text-pink-400", name: 'Smile' },
] as const;

export function getRandomIconIndex(): number {
  return Math.floor(Math.random() * CUTE_ICONS.length);
}

export function getIconByIndex(index: number): IconData {
  return CUTE_ICONS[index] || CUTE_ICONS[0];
}
