import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtUserGuard extends AuthGuard('jwt') {
  handleRequest (err: any, user: any, info: any) {
    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('No authentication token provided');
    }

    if (info?.message === 'jwt malformed') {
      throw new UnauthorizedException('Invalid authentication token');
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }

    return user;
  }
}
