export interface DamageTaker {
    takeGenericDamage(damage : number);
    takeNormalWeaponDamage(damage : number);
    takeExplosionDamage(damage : number);
    takeSiegeDamage(damage : number);
}