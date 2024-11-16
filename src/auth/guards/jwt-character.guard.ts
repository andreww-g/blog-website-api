import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtCharacterGuard extends AuthGuard('jwt-author') {}
