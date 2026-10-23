export interface DamageTaker {
    takePhysicalDamage(damage : number): void;
    takeForcefulDamage(damage : number): void;
    takeBuildingDamage(damage : number): void;
    takeFireDamage(damage: number): void;
    takeMagicDamage(damage: number): void;
}