
export const MILLISECONDS = 1000

export const Seconds = (s) => (Math.round(s*MILLISECONDS))

export const PixelsPerSecond = (speed) => speed/MILLISECONDS

export const RadiansPerSecond = (rads) => rads/MILLISECONDS

export const RatePerSecond = (t) => MILLISECONDS/t

