export type PackageKind = 'box' | 'gift' | 'letter'

/** Morph chain starts with an idea mark, not a seed. */
export type PackageStage = 'idea' | PackageKind

export type CourierPose = 'idle' | 'lookUp' | 'catch' | 'hold' | 'ride'
