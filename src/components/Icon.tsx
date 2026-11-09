import React from 'react';
import { Text } from 'react-native';
// Temporary glyphs. Replace this mapping with your own SVGs/assets later.
const glyphs = { home: '⌂', explore: '✳', review: '↻', profile: '☺', sparkle: '✦', arrow: '↗', sprout: '✳', chat: '✧' };
export function Icon({name, size = 24, color = '#203C32'}: { name: keyof typeof glyphs; size?: number; color?: string }) { return <Text accessible={false} style={{fontSize: size, color, fontWeight: '600'}}>{glyphs[name]}</Text>; }
