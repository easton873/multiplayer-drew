export interface DamageTaker {
    takeNormalWeaponDamage(damage : number);
    takeExplosionDamage(damage : number);
    takeSiegeDamage(damage : number);
}