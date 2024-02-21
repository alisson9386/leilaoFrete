import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length);
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req.user = payload;
        next();
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Missing token');
    }
  }
}
