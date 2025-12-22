import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Utilise la même clé secrète que dans le service Auth !
      secretOrKey:
        process.env.JWT_SECRET || 'SUPER_SECRET_KEY_A_CHANGER_DANS_ENV',
    });
  }

  async validate(payload: any) {
    // Ce que tu retournes ici est injecté dans `request.user`
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
