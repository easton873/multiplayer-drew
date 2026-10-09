export interface DamageTaker {
    takePhysicalDamage(damage : number);
    takeForcefulDamage(damage : number);
    takeBuildingDamage(damage : number);
    takeFireDamage(damage: number);
    takeMagicDamage(damage: number);
}